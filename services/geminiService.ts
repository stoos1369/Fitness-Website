import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
// NOTE: In a real production app, ensure API keys are handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface ExerciseGuide {
  description: string;
  tips: string[];
  searchQuery: string;
}

export const fetchExerciseDetails = async (exerciseName: string): Promise<ExerciseGuide> => {
  if (!process.env.API_KEY) {
    // Fallback if no API Key is present to prevent crashing
    return {
      description: "API Key not configured. Please add your Gemini API Key to view details.",
      tips: ["Check your environment variables."],
      searchQuery: exerciseName
    };
  }

  try {
    const prompt = `
      Provide a brief instructional guide for the exercise: "${exerciseName}".
      Return the response in JSON format with the following structure:
      {
        "description": "A 1-2 sentence summary of the movement.",
        "tips": ["Tip 1", "Tip 2", "Tip 3 (Common mistake to avoid)"],
        "searchQuery": "The best youtube search query for this exercise"
      }
      Keep it concise and beginner-friendly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text);
    return {
      description: data.description || `Perform ${exerciseName} with proper form.`,
      tips: data.tips || [],
      searchQuery: data.searchQuery || `${exerciseName} exercise tutorial`
    };

  } catch (error) {
    console.error("Error fetching exercise details:", error);
    return {
      description: "Could not retrieve AI instructions at this time.",
      tips: ["Try searching manually below."],
      searchQuery: `${exerciseName} exercise tutorial`
    };
  }
};
