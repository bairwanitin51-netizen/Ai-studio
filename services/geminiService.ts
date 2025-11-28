import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ModelId } from "../types";

// Helper to get client securely
const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure the environment is configured correctly.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateText = async (modelId: string, prompt: string): Promise<string> => {
  const ai = getClient();
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Generate Error:", error);
    throw error;
  }
};

export const generateCode = async (modelId: string, instruction: string, currentCode: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    You are an expert coding assistant.
    Current Code Context:
    \`\`\`
    ${currentCode}
    \`\`\`
    
    Instruction: ${instruction}
    
    Output ONLY the valid code block needed to fulfill the instruction. Do not wrap in markdown backticks if possible, or if you do, I will strip them. Just the code.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId, // Prefer Pro for coding
      contents: prompt,
    });
    let text = response.text || "";
    // Basic cleanup of markdown if present
    text = text.replace(/^```[a-z]*\n/i, '').replace(/```$/, '');
    return text.trim();
  } catch (error) {
    console.error("Gemini Code Error:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getClient();
  try {
    // Determine model based on capability. Pro is better for Vision.
    // Using 2.5 flash image or 3 pro image preview if available. 
    // The prompt guidance says gemini-2.5-flash-image is standard.
    const model = 'gemini-2.5-flash-image'; 
    
    // Base64 string usually comes with data:image/png;base64, prefix. We need to strip it or handle it.
    // The SDK often expects just the data part if we construct the inlineData manually.
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });
    
    return response.text || "No analysis provided.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

// Simple chat wrapper
export class ChatSession {
  private chat: Chat;

  constructor(modelId: string, systemInstruction?: string) {
    const ai = getClient();
    this.chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction || "You are a helpful AI assistant in the AI Studio app.",
      }
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "";
    } catch (error) {
      console.error("Chat Error:", error);
      throw error;
    }
  }
}
