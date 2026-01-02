
import { GoogleGenAI, Type } from "@google/genai";
import { ChemistryReport, AIQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeExamPaper = async (base64Image: string): Promise<ChemistryReport> => {
  const model = "gemini-3-flash-preview";
  const prompt = `你是一位资深高考化学老师。请分析这张化学试卷图片中的题目及学生的作答情况。
  要求：
  1. 识别每一道题的内容、学生的答案、正确答案。
  2. 判定对错。
  3. 针对错题，提供深度的【原理讲解】、【逻辑推导】、【注意事项】和【易错点分析】。
  4. 总结学生的知识薄弱点。`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
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
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generatePracticeQuestions = async (weakPoints: string[]): Promise<AIQuestion[]> => {
  const model = "gemini-3-pro-preview";
  const prompt = `针对以下化学薄弱知识点，生成3道高质量的高考难度模拟练习题：${weakPoints.join(", ")}。
  要求：题目严谨，选项具有迷惑性，解析极其详尽。`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ text: prompt }],
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
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: '你是一位极其有耐心且专业的化学特级教师。你的任务是帮助学生理解化学原理。请用通俗易懂且逻辑严密的方式回答问题。',
    }
  });

  // We manually handle history as the SDK might vary, or just use a simple sendMessage
  const result = await chat.sendMessage({ message });
  return result.text;
};
