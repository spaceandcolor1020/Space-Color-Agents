
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { ProjectData } from "../types";

// Helper function to generate context lenses from raw case study text
export const generateLenses = async (rawText: string): Promise<ProjectData> => {
  // Always initialize with the direct environment variable as per requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for advanced reasoning and structuring tasks
      model: "gemini-3-pro-preview",
      contents: `Transform this case study text into the Multi-Lens JSON format:\n\n${rawText}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    // Extracting text output directly from the .text property
    const jsonStr = response.text || '';
    return JSON.parse(jsonStr) as ProjectData;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate context lenses. Please check your text and try again.");
  }
};
