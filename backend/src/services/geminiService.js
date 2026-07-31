const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Candidate models list to try in sequence in case of model availability or rate limits (429)
const CANDIDATE_MODELS = [
  'gemini-flash-latest',   // auto-tracks the newest stable Flash model — best default
  'gemini-2.5-flash',      // may still work depending on your account/region, kept as fallback
  'gemini-2.5-flash-lite'  // cheaper/faster fallback if the above are rate-limited
];

// Helper: Gemini sometimes wraps JSON in markdown code fences or text — strip that
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

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const generateWithFallback = async (prompt, generationConfig = null) => {
  let lastError = null;
  let hitQuotaLimit = false;

  for (const modelName of CANDIDATE_MODELS) {
    const modelParams = { model: modelName };
    if (generationConfig && Object.keys(generationConfig).length > 0) {
      modelParams.generationConfig = generationConfig;
    }
    const model = genAI.getGenerativeModel(modelParams);

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err) {
        lastError = err;
        const msg = (err.message || '').toLowerCase();
        const isQuotaError = msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted');
        const isNotFound = msg.includes('404') || msg.includes('not found');

        if (isNotFound) {
          console.warn(`Gemini model '${modelName}' not found (404). Skipping to next model...`);
          break;
        }

        if (isQuotaError) {
          hitQuotaLimit = true;
          if (attempt < 2) {
            console.warn(`Gemini model '${modelName}' hit rate limit (429). Retrying in 1.5s...`);
            await sleep(1500);
          } else {
            console.warn(`Gemini model '${modelName}' quota limit reached. Pausing 1.5s and trying next model...`);
            await sleep(1500);
            break;
          }
        } else {
          console.warn(`Gemini model '${modelName}' failed (attempt ${attempt}): ${err.message}`);
          break;
        }
      }
    }
  }

  if (hitQuotaLimit) {
    throw new Error('Gemini API rate limit reached (429). Please wait a few seconds and try again.');
  }

  throw lastError || new Error('All Gemini candidate models failed.');
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
`;

  const rawText = await generateWithFallback(prompt);
  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini extraction response:', cleaned);
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
Return JSON in this exact schema. All themeColors values MUST be valid 6-digit hex color codes starting with #. fontFamily MUST be a plain font name string only (e.g. Inter, Roboto).

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
  ],
  "themeColors": {
    "background": "#F6F3EC",
    "text": "#1B1B18",
    "primary": "#B4522B",
    "secondary": "#847F71",
    "accent": "#DEDACD"
  },
  "fontFamily": "Inter"
}
`;

  const rawText = await generateWithFallback(prompt);
  const cleaned = cleanJsonResponse(rawText);

  try {
    const parsed = JSON.parse(cleaned);
    // Sanitize themeColors — strip any non-hex values the AI accidentally returned as descriptions
    if (parsed.themeColors && typeof parsed.themeColors === 'object') {
      const defaults = { background: '#F6F3EC', text: '#1B1B18', primary: '#B4522B', secondary: '#847F71', accent: '#DEDACD' };
      for (const key of Object.keys(parsed.themeColors)) {
        const val = String(parsed.themeColors[key] || '');
        if (!val.match(/^#[0-9A-Fa-f]{3,6}$/)) {
          // Try to extract a hex code from the string
          const hexMatch = val.match(/#[0-9A-Fa-f]{3,6}/);
          parsed.themeColors[key] = hexMatch ? hexMatch[0] : (defaults[key] || '#888888');
        }
      }
    }
    // Sanitize fontFamily — strip extra quotes/descriptions
    if (parsed.fontFamily && typeof parsed.fontFamily === 'string') {
      parsed.fontFamily = parsed.fontFamily.replace(/['"`()]/g, '').split(',')[0].trim();
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse Gemini content generation response:', cleaned);
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
`;

  const rawText = await generateWithFallback(prompt, { temperature: 0.2 });
  const cleaned = cleanJsonResponse(rawText);

  try {
    const parsed = JSON.parse(cleaned);
    // Strip placeholder strings
    for (const k in parsed) {
      if (parsed[k] === '...' || (Array.isArray(parsed[k]) && parsed[k][0] === '...')) {
        delete parsed[k];
      }
    }
    // Sanitize themeColors — strip any non-hex values the AI accidentally returned as descriptions
    if (parsed.themeColors && typeof parsed.themeColors === 'object') {
      const existingColors = inputJson.themeColors || {};
      const defaults = { background: '#F6F3EC', text: '#1B1B18', primary: '#B4522B', secondary: '#847F71', accent: '#DEDACD' };
      for (const key of Object.keys(parsed.themeColors)) {
        const val = String(parsed.themeColors[key] || '');
        if (!val.match(/^#[0-9A-Fa-f]{3,6}$/)) {
          const hexMatch = val.match(/#[0-9A-Fa-f]{3,6}/);
          parsed.themeColors[key] = hexMatch ? hexMatch[0] : (existingColors[key] || defaults[key] || '#888888');
        }
      }
    }
    // Sanitize fontFamily — strip extra quotes/descriptions
    if (parsed.fontFamily && typeof parsed.fontFamily === 'string') {
      parsed.fontFamily = parsed.fontFamily.replace(/['"`()]/g, '').split(',')[0].trim();
    }
    return {
      ...inputJson,
      ...parsed
    };
  } catch (error) {
    console.error('Failed to parse Gemini edit response:', cleaned, 'Error:', error);
    throw new Error('AI returned invalid JSON during content edit: ' + error.message);
  }
};

module.exports = { extractResumeData, generatePortfolioContent, editPortfolioContent };