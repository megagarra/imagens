
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const enhancePrompt = async (basePrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Stable Diffusion prompt engineer. 
      Transform the following simple idea into a detailed, highly effective image generation prompt.
      Include artistic styles, lighting details, camera settings (if relevant), and high-quality descriptors.
      Keep it descriptive and separated by commas.
      
      User Idea: "${basePrompt}"
      
      Return ONLY the enhanced prompt string, nothing else.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || basePrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return basePrompt;
  }
};
