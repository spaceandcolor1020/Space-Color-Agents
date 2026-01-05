
import { GoogleGenAI, Type } from "@google/genai";
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
        // The recommended way is to configure a responseSchema for the expected output.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meta: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                role: { type: Type.STRING },
                timeline: { type: Type.STRING },
                awards: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "role", "timeline", "awards"]
            },
            lenses: {
              type: Type.OBJECT,
              properties: {
                recruiter: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    content: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    status: { type: Type.STRING },
                    artifact: { type: Type.STRING },
                  },
                  required: ["headline", "content", "reasoning", "status"]
                },
                engineer: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    content: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    status: { type: Type.STRING },
                    artifact: { type: Type.STRING },
                  },
                  required: ["headline", "content", "reasoning", "status"]
                },
                designer: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    content: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    status: { type: Type.STRING },
                    artifact: { type: Type.STRING },
                  },
                  required: ["headline", "content", "reasoning", "status"]
                },
                source: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    content: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    status: { type: Type.STRING }
                  },
                  required: ["headline", "content", "reasoning", "status"]
                }
              },
              required: ["recruiter", "engineer", "designer", "source"]
            }
          },
          required: ["meta", "lenses"]
        },
        temperature: 0.7,
      },
    });

    // Extracting text output directly from the .text property
    const jsonStr = response.text?.trim() || '';
    return JSON.parse(jsonStr) as ProjectData;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate context lenses. Please check your text and try again.");
  }
};
