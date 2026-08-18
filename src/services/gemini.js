import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Gemini API key not found. Check your .env file.");
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export const getGeminiResponse = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

//mood based recommendations 
export const getMoodRecommendations = async (mood) => {
  const prompt = `
You are a movie recommendation assistant for FlixNow.

The user is currently feeling:
${mood.name}

Mood description:
${mood.description}

Preferred genres:
${mood.genres.join(", ")}

Mood keywords:
${mood.keywords.join(", ")}

Recommend 8 well-known movies that strongly match this mood.

Return ONLY valid JSON in this exact format:

{
  "moodSummary": "short explanation of the mood",
  "movies": [
    {
      "title": "Movie title",
      "reason": "Why this movie matches the mood",
      "confidence": 95
    }
  ]
}

Rules:
- Recommend real movies.
- Do not invent movie titles.
- Prefer popular, well-known movies.
- Do not include markdown.
- Return exactly 8 movies.
`;

  try {
    const response = await getGeminiResponse(prompt);

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Mood recommendation error:", error);
    return {
      moodSummary: "",
      movies: [],
    };
  }
};


//recommendations based on watchlist
export const getMovieRecommendations = async (watchlist) => {
  const movieTitles = watchlist
    .map((movie) => movie.title)
    .filter(Boolean);

  const prompt = `
You are an AI movie recommendation assistant for FlixNow.

The user has these movies in their watchlist:

${movieTitles.map((title) => `- ${title}`).join("\n")}

Analyze the user's movie preferences based on these titles.

Recommend 8 movies that the user is likely to enjoy.

Return ONLY valid JSON in exactly this format:

{
  "tasteSummary": "Short explanation of the user's movie taste",
  "movies": [
    {
      "title": "Movie Title",
      "reason": "Why this movie matches the user's taste",
      "confidence": 95
    }
  ]
}

Rules:
- Recommend real movies only.
- Do not invent movie titles.
- Do not recommend movies already in the watchlist.
- Prefer well-known movies.
- Give different recommendations rather than repeating similar titles.
- Do not include markdown.
- Return exactly 8 recommendations.
`;

  try {
    const response = await getGeminiResponse(prompt);

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);

  } catch (error) {
    console.error(
      "Movie recommendation error:",
      error
    );

    return {
      tasteSummary: "",
      movies: [],
    };
  }
};

//smart search 
export const parseSmartSearch = async (query) => {
  const prompt = `
You are the smart search engine for FlixNow, an AI-powered movie discovery application.

The user searched for:

"${query}"

Convert the user's natural language request into structured movie search filters.

Return ONLY valid JSON in exactly this format:

{
  "searchQuery": "",
  "genres": [],
  "minRating": null,
  "maxRuntime": null,
  "minRuntime": null,
  "releaseYearFrom": null,
  "releaseYearTo": null,
  "sortBy": "popularity.desc"
}

Available genres:

Action
Adventure
Animation
Comedy
Crime
Documentary
Drama
Family
Fantasy
History
Horror
Music
Mystery
Romance
Science Fiction
TV Movie
Thriller
War
Western

Rules:

1. Extract only information clearly implied by the user's query.
2. If no genre is mentioned, return an empty genres array.
3. If no rating is mentioned, return null for minRating.
4. If no runtime is mentioned, return null for minRuntime and maxRuntime.
5. If no release year is mentioned, return null for releaseYearFrom and releaseYearTo.
6. Understand phrases such as:
   - "under 2 hours" → maxRuntime: 120
   - "less than 90 minutes" → maxRuntime: 90
   - "over 2 hours" → minRuntime: 120
   - "highly rated" → minRating: 7
   - "recent movies" → releaseYearFrom: current year minus 5
7. Convert genre names to the exact genre names listed above.
8. Do not invent filters.
9. sortBy must be one of:
   - popularity.desc
   - vote_average.desc
   - primary_release_date.desc
10. Return valid JSON only.
`;

  try {
    const response = await getGeminiResponse(prompt);

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);

  } catch (error) {
    console.error("Smart search parsing error:", error);

    return {
      searchQuery: query,
      genres: [],
      minRating: null,
      maxRuntime: null,
      minRuntime: null,
      releaseYearFrom: null,
      releaseYearTo: null,
      sortBy: "popularity.desc"
    };
  }
};

//AI Movie Summary
export const getMovieSummary = async (movie) => {

  const prompt = `
You are FlixNow's AI movie assistant.

Create a concise, spoiler-free summary for this movie.

Movie title:
${movie.title}

Release date:
${movie.release_date || "Unknown"}

Genres:
${movie.genres?.map((genre) => genre.name).join(", ") || "Unknown"}

TMDB overview:
${movie.overview || "No overview available."}

Return ONLY valid JSON in this format:

{
  "summary": "A concise spoiler-free summary of the movie.",
  "themes": ["theme 1", "theme 2", "theme 3"],
  "whyWatch": "One short reason why someone might enjoy this movie."
}

Rules:
- Do not reveal the ending.
- Do not reveal the climax.
- Do not include major plot twists.
- Keep the summary between 2 and 4 sentences.
- Use simple language.
- Return valid JSON only.
`;

  try {

    const response =
      await getGeminiResponse(prompt);

    const cleanedResponse =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleanedResponse);

  } catch (error) {

    console.error(
      "Movie summary error:",
      error
    );

    throw error;
  }
};