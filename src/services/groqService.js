import { EMPTY_EDUCATION, EMPTY_EXPERIENCE, EMPTY_PROJECT } from '../constants/defaultProfile';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const EXTRACTION_PROMPT = `You are a resume parser. Extract candidate information from the resume text below.
Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "headline": "string (job title or professional headline)",
  "location": "string (city, country)",
  "linkedinUrl": "string or empty",
  "summary": "string (professional summary)",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "string",
      "title": "string",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or YYYY or Present",
      "description": "string"
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY",
      "endDate": "YYYY"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "link": "string or empty",
      "techStack": "string"
    }
  ]
}
IMPORTANT CONSTRAINTS:
1. Do NOT summarize, shorten, paraphrase, or rewrite the professional summary or the experience/project descriptions. Copy and extract the full, detailed content exactly as it appears in the resume text.
2. Extract ALL listed experiences, projects, and education history, rather than just the most recent ones.
Use empty strings or empty arrays when data is not found.`;

/**
 * Call Groq free LLM to extract structured profile data from resume text.
 */
export async function extractProfileFromResume(resumeText) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error(
      'Groq API key is missing. Add VITE_GROQ_API_KEY to your .env file. Get a free key at https://console.groq.com/keys',
    );
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: `Resume text:\n\n${resumeText.slice(0, 12000)}` },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error (${response.status})`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No response from Groq API.');
  }

  return normalizeExtractedProfile(JSON.parse(content));
}

function normalizeExtractedProfile(raw) {
  return {
    fullName: raw.fullName || '',
    email: raw.email || '',
    phone: raw.phone || '',
    headline: raw.headline || '',
    location: raw.location || '',
    linkedinUrl: raw.linkedinUrl || '',
    summary: raw.summary || '',
    skills: Array.isArray(raw.skills) ? raw.skills.filter(Boolean) : [],
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((exp) => ({ ...EMPTY_EXPERIENCE, ...exp }))
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((edu) => ({ ...EMPTY_EDUCATION, ...edu }))
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((proj) => ({ ...EMPTY_PROJECT, ...proj }))
      : [],
  };
}
