const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

// Helper: Gemini sometimes wraps JSON in markdown code fences — strip that
const cleanJsonResponse = (text) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
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

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini extraction response:', cleaned);
    throw new Error('AI returned invalid JSON during extraction');
  }
};

// CALL 2: Turn structured data into polished portfolio content
const generatePortfolioContent = async (structuredData) => {
  const prompt = `
You are helping create a personal portfolio website. Given this resume data, generate polished, achievement-focused portfolio content as ONLY valid JSON. No explanation, no markdown — just the JSON object.

Resume data:
${JSON.stringify(structuredData)}

Return JSON in this exact schema:
{
  "tagline": "one punchy line, under 12 words, describing who they are professionally",
  "bio": "2-3 sentence achievement-focused summary, written in first person",
  "topSkills": ["top 5 most relevant skills only, prioritized"],
  "polishedExperience": [
    { "role": "", "company": "", "duration": "", "achievementDescription": "rewritten to sound achievement-focused, not just a task list" }
  ],
  "polishedProjects": [
    { "name": "", "description": "", "githubLink": "", "liveLink": "" }
  ],
  "themeColors": {
    "primary": "#hexcode",
    "secondary": "#hexcode",  
    "accent": "#hexcode"
  }
}
`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini content generation response:', cleaned);
    throw new Error('AI returned invalid JSON during content generation');
  }
};


module.exports = { extractResumeData, generatePortfolioContent };