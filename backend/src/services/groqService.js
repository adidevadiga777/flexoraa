const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Candidate models list to try in sequence in case of model availability or rate limits (429).
const CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
];

// --- Simple in-memory throttle 
const MIN_INTERVAL_MS = 2100;
let lastCallAt = 0;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const throttle = async () => {
  const now = Date.now();
  const wait = lastCallAt + MIN_INTERVAL_MS - now;
  if (wait > 0) {
    await sleep(wait);
  }
  lastCallAt = Date.now();
};


const cleanJsonResponse = (text) => {
  if (!text) return '';
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return cleaned;
};

const backoffDelay = (attempt) => 1500 * 2 ** (attempt - 1) + Math.random() * 500;

const generateWithFallback = async (prompt, generationConfig = null) => {
  let lastError = null;
  let hitQuotaLimit = false;

  for (const modelName of CANDIDATE_MODELS) {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await throttle();
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          ...(generationConfig?.temperature !== undefined
            ? { temperature: generationConfig.temperature }
            : {}),
        });
        return completion.choices[0].message.content;
      } catch (err) {
        lastError = err;
        const status = err.status || err?.response?.status;
        const msg = (err.message || '').toLowerCase();
        const isQuotaError = status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('rate limit');
        const isNotFound = status === 404 || msg.includes('404') || msg.includes('not found') || msg.includes('decommissioned');

        if (isNotFound) {
          console.warn(`Groq model '${modelName}' not found or decommissioned (404). Skipping to next model...`);
          break;
        }

        if (isQuotaError) {
          hitQuotaLimit = true;
          if (attempt < maxAttempts) {
            const wait = backoffDelay(attempt);
            console.warn(`Groq model '${modelName}' hit rate limit (429). Retrying in ${(wait / 1000).toFixed(1)}s...`);
            await sleep(wait);
          } else {
            console.warn(`Groq model '${modelName}' quota limit reached after ${maxAttempts} attempts. Trying next model...`);
            break;
          }
        } else {
          console.warn(`Groq model '${modelName}' failed (attempt ${attempt}): ${err.message}`);
          break;
        }
      }
    }
  }

  if (hitQuotaLimit) {
    throw new Error('Groq API rate limit reached (429). Please wait a few seconds and try again.');
  }

  throw lastError || new Error('All Groq candidate models failed.');
};

// CALL 1: Extract structured data from raw resume text
const extractResumeData = async (resumeText) => {
  const prompt = `
Extract the following resume text into ONLY valid JSON. No explanation, no markdown, no extra text — just the JSON object.

Schema:
{
  "name": "",
  "title": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "github": "",
  "skills": [],
  "experience": [
    { "role": "", "company": "", "duration": "", "description": "" }
  ],
  "projects": [
    { "name": "", "description": "", "link": "" }
  ],
  "education": [
    { "degree": "", "institution": "", "year": "" }
  ]
}

Resume text:
"""
${resumeText}
"""

IMPORTANT: Only use text that literally appears in the resume above. If a field cannot be found in the resume text, set it to an empty string "" or empty array []. Never invent, guess, or use placeholder values such as "First Last", "John Doe", or "email@example.com" — an empty field is correct if the information genuinely isn't present.
`;

  const rawText = await generateWithFallback(prompt, { temperature: 0 });
  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Groq extraction response:', cleaned);
    throw new Error('AI returned invalid JSON during extraction');
  }
};

// CALL 2: Turn structured data into polished portfolio content
const generatePortfolioContent = async (structuredData, userInstruction = '') => {
  const prompt = `
You are helping create a personal portfolio website. Given this resume data${userInstruction ? ` and user preference: "${userInstruction}"` : ''}, generate polished, achievement-focused portfolio content as ONLY valid JSON. No explanation, no markdown — just the JSON object.

Resume data:
${JSON.stringify(structuredData)}
${userInstruction ? `\nUser instructions / preferences to apply:\n"${userInstruction}"\n` : ''}
Return JSON in this exact schema.

Schema:
{
  "tagline": "one punchy line, under 12 words, describing who they are professionally",
  "heroBio": "1 concise sentence engaging intro summary specifically for the hero section",
  "bio": "2-3 sentence detailed achievement-focused summary for the about section, written in first person",
  "topSkills": ["top 5 most relevant skills only, prioritized"],
  "polishedExperience": [
    { "role": "", "company": "", "duration": "", "achievementDescription": "rewritten to sound achievement-focused, not just a task list" }
  ],
  "polishedProjects": [
    { "name": "", "description": "", "githubLink": "", "liveLink": "" }
  ]
}
`

  const rawText = await generateWithFallback(prompt, { temperature: 0.9 });
  const cleaned = cleanJsonResponse(rawText);

  try {
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error('Failed to parse Groq content generation response:', cleaned);
    throw new Error('AI returned invalid JSON during content generation');
  }
};

// CALL 3: Edit existing portfolio content based on user instruction
const editPortfolioContent = async (currentPortfolioContent, instruction, currentName = '') => {
  const cleanContent = currentPortfolioContent
    ? JSON.parse(JSON.stringify(currentPortfolioContent))
    : {};

  const inputJson = {
    name: currentName || cleanContent?.name || '',
    ...cleanContent
  };

  const prompt = `
You are an AI assistant updating a user's portfolio website content.
Here is the current portfolio content JSON:
${JSON.stringify(inputJson, null, 2)}

The user wants to make the following edit:
"${instruction}"

Modify the portfolio JSON object to apply the requested edit and return ONLY valid JSON matching the exact schema. No markdown code fences, no extra commentary text outside JSON.

Schema:
{
  "name": "Full name of person (update if instruction asks to change name)",
  "tagline": "Professional tagline or title",
  "heroBio": "Short 1-sentence intro summary for hero section",
  "bio": "2-3 sentence detailed achievement summary for about section",
  "topSkills": ["skill1", "skill2"],
  "polishedExperience": [
    { "role": "", "company": "", "duration": "", "achievementDescription": "" }
  ],
  "polishedProjects": [
    { "name": "", "description": "", "githubLink": "", "liveLink": "" }
  ],
  "themeColors": {
    "background": "#hexcode",
    "text": "#hexcode",
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode"
  },
  "fontFamily": "font-name"
}

Rules:
- Apply ONLY the user's requested edit (e.g. name, tagline, bio, skills, experience, projects, themeColors background/text/accent/primary/secondary, or fontFamily).
- Keep every other existing value exactly as provided in the current portfolio content JSON unless requested otherwise.
- Do NOT output placeholder strings like "...". Preserve existing actual content values.
- If the instruction asks to update name, set the "name" property to the new full name requested.
- Never invent or alter githubLink/liveLink unless the instruction specifically asks you to.
- Only include "themeColors" or "fontFamily" in your response if the user's instruction actually asked to change colors, theme, or font. Otherwise omit them entirely so existing values are preserved untouched.
`;

  const rawText = await generateWithFallback(prompt, { temperature: 0.2 });
  const cleaned = cleanJsonResponse(rawText);

  try {
    const parsed = JSON.parse(cleaned);
    s
    for (const k in parsed) {
      if (parsed[k] === '...' || (Array.isArray(parsed[k]) && parsed[k][0] === '...')) {
        delete parsed[k];
      }
    }
    if (parsed.themeColors && typeof parsed.themeColors === 'object') {
      const existingColors = inputJson.themeColors || {};
      for (const key of Object.keys(parsed.themeColors)) {
        const val = String(parsed.themeColors[key] || '');
        if (!val.match(/^#[0-9A-Fa-f]{3,6}$/)) {
          const hexMatch = val.match(/#[0-9A-Fa-f]{3,6}/);
          if (hexMatch) {
            parsed.themeColors[key] = hexMatch[0];
          } else if (existingColors[key]) {
            parsed.themeColors[key] = existingColors[key];
          } else {
            delete parsed.themeColors[key];
          }
        }
      }

      if (Object.keys(parsed.themeColors).length === 0) {
        delete parsed.themeColors;
      }
    }

    if (parsed.fontFamily && typeof parsed.fontFamily === 'string') {
      parsed.fontFamily = parsed.fontFamily.replace(/['"`()]/g, '').split(',')[0].trim();
    }

    return {
      ...inputJson,
      ...parsed
    };
  } catch (error) {
    console.error('Failed to parse Groq edit response:', cleaned, 'Error:', error);
    throw new Error('AI returned invalid JSON during content edit: ' + error.message);
  }
};

module.exports = { extractResumeData, generatePortfolioContent, editPortfolioContent };