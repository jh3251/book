
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  enhanceDescription: async (title: string, author: string, currentDesc: string): Promise<string> => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Enhance this book selling description for a marketplace. 
        Title: ${title}
        Author: ${author}
        Draft Description: ${currentDesc}
        
        Keep it concise, professional, and highlight its value for a student. Only return the enhanced text.`,
      });
      return response.text || currentDesc;
    } catch (error) {
      console.error("Gemini Error:", error);
      return currentDesc;
    }
  },
  
  getBookInsights: async (title: string, author: string): Promise<string> => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide 3 quick interesting facts or why someone should read/study "${title}" by ${author}. Keep it very short, bullet points.`,
      });
      return response.text || "";
    } catch (error) {
      return "";
    }
  }
};
