import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBPzNMNGMPqsbIo-O5chASw9AdXHRihgjY");

// Try models in order of preference
const MODEL_PRIORITY = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-pro",
];

const buildPrompt = (userPrompt) => `You are a movie and TV show recommendation engine for a Netflix-like platform.
The user has described what they want to watch:
"${userPrompt}"

Return exactly 8 recommendations. Your response MUST be ONLY a valid JSON array — no markdown, no explanation, no extra text.

Format:
[
  {
    "title": "Exact movie or show title as it appears on TMDB",
    "year": "Release year as string (e.g. '2021')",
    "type": "movie or tv",
    "reason": "One short sentence explaining why this matches the user's mood/description"
  }
]

Rules:
- Prioritize well-known titles that exist on TMDB
- Mix movies and TV shows unless the user specifies
- Match the emotional tone and genres described by the user
- Keep reasons concise (max 12 words)
- Return ONLY the raw JSON array, nothing else`;

/**
 * Given a natural language user description (mood, genre, feeling),
 * returns an array of { title, year, type, reason } objects.
 * Tries multiple Gemini models in priority order.
 */
export const getAIMovieSuggestions = async (userPrompt) => {
  const prompt = buildPrompt(userPrompt);
  let lastError = null;

  for (const modelName of MODEL_PRIORITY) {
    try {
      console.log(`[Gemini] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Strip markdown code fences if present
      const clean = text.replace(/^```json?\s*/i, "").replace(/\s*```$/, "").trim();

      const parsed = JSON.parse(clean);
      console.log(`[Gemini] Success with model: ${modelName}`);
      return parsed;
    } catch (err) {
      console.warn(`[Gemini] Model ${modelName} failed:`, err.message);
      lastError = err;

      // If it's a quota/billing error (429), no point trying other models with same key
      if (err.message?.includes("429") || err.message?.includes("quota")) {
        throw new Error(
          "QUOTA_EXCEEDED: Your Gemini API key has exceeded its free tier quota. " +
          "Please wait a minute and try again, or visit https://aistudio.google.com to check your usage."
        );
      }

      // If it's an auth error (403/401), stop immediately
      if (err.message?.includes("403") || err.message?.includes("401") || err.message?.includes("API_KEY")) {
        throw new Error(
          "API_KEY_INVALID: The Gemini API key is invalid or not enabled. " +
          "Please go to https://aistudio.google.com and ensure the key has Gemini API access."
        );
      }

      // 404 = model not found, try next
      // Other errors: continue to next model
      continue;
    }
  }

  // All models failed
  throw lastError || new Error("All Gemini models failed. Please try again later.");
};
