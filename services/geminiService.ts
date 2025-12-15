import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PROMPTS } from "../constants";
import { UserProfile, Persona, ThesisTopic } from "../types";

// Helper to remove Markdown code blocks if the model adds them to JSON
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned;
};

// Initialize Gemini Client
// In a real production app, you might want to proxy this through a backend to hide the key,
// but for this client-side demo, we use the env variable directly.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePersona = async (user: UserProfile): Promise<Persona> => {
  const ai = getAiClient();
  
  const userContext = `
    【输入信息】
    - 年龄：${user.age}
    - 当前公司：${user.company}
    - 行业：${user.industry}
    - 当前岗位：${user.position}
    - 工作年限：${user.years}
    - 简历文件：(Attached below)
  `;

  // Define Schema for structured output
  const personaSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      industry_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      career_stage: { type: Type.STRING },
      core_management_domains: { type: Type.ARRAY, items: { type: Type.STRING } },
      unique_research_advantage: { type: Type.STRING },
      suitable_thesis_types: { type: Type.ARRAY, items: { type: Type.STRING } },
      data_access_assessment: { type: Type.STRING },
    },
    required: ["industry_keywords", "career_stage", "core_management_domains", "unique_research_advantage", "suitable_thesis_types", "data_access_assessment"]
  };

  try {
    const parts: any[] = [{ text: userContext }];
    
    if (user.resumeBase64) {
      // Clean base64 string if it contains data URI prefix
      const base64Data = user.resumeBase64.split(',')[1] || user.resumeBase64;
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: PROMPTS.PERSONA_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: personaSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(cleanJson(text)) as Persona;

  } catch (error) {
    console.error("Error generating persona:", error);
    throw error;
  }
};

export const generateTopics = async (persona: Persona): Promise<ThesisTopic[]> => {
  const ai = getAiClient();
  
  const prompt = `
    【输入：MBA 研究画像 JSON】
    ${JSON.stringify(persona, null, 2)}
  `;

  const topicSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        background: { type: Type.STRING },
        research_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        theoretical_perspective: { type: Type.STRING },
        data_sources: { type: Type.STRING },
        methodology: { type: Type.STRING },
        academic_value: { type: Type.STRING },
        practical_value: { type: Type.STRING },
        advisor_acceptance_reason: { type: Type.STRING },
        feasibility: { type: Type.STRING },
      },
      required: ["title", "background", "research_questions", "theoretical_perspective", "data_sources", "methodology", "advisor_acceptance_reason", "feasibility"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: PROMPTS.TOPIC_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: topicSchema,
        thinkingConfig: { thinkingBudget: 0 } // Flash doesn't support thinking, just ensure it's off or low latency
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(cleanJson(text)) as ThesisTopic[];

  } catch (error) {
    console.error("Error generating topics:", error);
    throw error;
  }
};

export const generateOutline = async (topic: ThesisTopic): Promise<string> => {
  const ai = getAiClient();
  
  const prompt = `
    【输入：选定的论文选题 JSON】
    ${JSON.stringify(topic, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Use Flash for speed, or Pro for better reasoning if available
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: PROMPTS.OUTLINE_SYSTEM,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return text;

  } catch (error) {
    console.error("Error generating outline:", error);
    throw error;
  }
};

export const generateFeasibility = async (topic: ThesisTopic, outline: string): Promise<string> => {
  const ai = getAiClient();
  
  const prompt = `
    【输入：选定的论文选题 JSON】
    ${JSON.stringify(topic)}

    【输入：论文大纲】
    ${outline}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: PROMPTS.FEASIBILITY_SYSTEM,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return text;

  } catch (error) {
    console.error("Error generating feasibility report:", error);
    throw error;
  }
};
