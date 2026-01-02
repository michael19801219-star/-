
import { GoogleGenAI, Type } from "@google/genai";
import { ChemistryReport, AIQuestion } from "../types.ts";

// Always use the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExamPaper = async (base64Images: string[]): Promise<ChemistryReport> => {
  // Use gemini-3-pro-preview for advanced reasoning tasks like exam analysis.
  const model = "gemini-3-pro-preview";
  
  const imageParts = base64Images.map(base64 => ({
    inlineData: { data: base64, mimeType: "image/jpeg" }
  }));

  const prompt = `你是一位资深高考化学老师。请分析提供的这些化学试卷图片（可能包含多页）中的题目及学生的作答情况。
  要求：
  1. 识别每一张图中每一道题的内容、学生的答案、正确答案。
  2. 判定对错。
  3. 针对所有错题，提供深度的【原理讲解】、【逻辑推导】、【注意事项】和【易错点分析】。
  4. 综合所有页面，总结学生的知识薄弱点。
  5. 给出综合分数（0-100）。
  
  请严格按照指定的JSON格式输出，不要包含任何MarkDown代码块标记或其他冗余文字。`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          weakPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          analyzedQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                originalText: { type: Type.STRING },
                topic: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                studentAnswer: { type: Type.STRING },
                correctAnswer: { type: Type.STRING },
                explanation: {
                  type: Type.OBJECT,
                  properties: {
                    principle: { type: Type.STRING },
                    logic: { type: Type.STRING },
                    precautions: { type: Type.STRING },
                    commonMistakes: { type: Type.STRING }
                  }
                }
              }
            }
          }
        },
        required: ["overallScore", "weakPoints", "analyzedQuestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI未能返回分析数据。");
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("数据格式解析失败，请尝试重新拍照。");
  }
};

export const generatePracticeQuestions = async (weakPoints: string[]): Promise<AIQuestion[]> => {
  const model = "gemini-3-pro-preview";
  const prompt = `针对以下化学薄弱知识点，生成3道高质量的高考难度模拟练习题：${weakPoints.join(", ")}。
  要求：题目严谨，选项具有迷惑性，解析极其详尽。`;

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            options: {
              type: Type.OBJECT,
              properties: {
                A: { type: Type.STRING },
                B: { type: Type.STRING },
                C: { type: Type.STRING },
                D: { type: Type.STRING }
              }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const chatWithAI = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: '你是一位极其有耐心且专业的化学特级教师。你的任务是帮助学生理解化学原理。请用通俗易懂且逻辑严密的方式回答问题。',
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
