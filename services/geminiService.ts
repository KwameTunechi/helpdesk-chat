
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async *sendMessageStream(history: { role: 'user' | 'model'; parts: { text: string }[] }[], prompt: string) {
    try {
      const streamResponse = await this.ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4,
          tools: [{ googleSearch: {} }]
        },
      });

      for await (const chunk of streamResponse) {
        // Access chunk property directly as per coding guidelines
        const response = chunk as GenerateContentResponse;
        yield {
          text: response.text || "",
          groundingMetadata: response.candidates?.[0]?.groundingMetadata
        };
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      yield { text: " [System Error: Connection to AI lost] " };
    }
  }
}

export const geminiService = new GeminiService();
