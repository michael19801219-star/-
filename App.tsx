
import React, { useState, useEffect, useRef } from 'react';
import { AppState, ChemistryReport, AIQuestion } from './types';
import { analyzeExamPaper, generatePracticeQuestions } from './services/geminiService';
import Header from './components/Header';
import Home from './components/Home';
import AnalysisReport from './components/AnalysisReport';
import PracticeSession from './components/PracticeSession';
import AIChatDrawer from './components/AIChatDrawer';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [report, setReport] = useState<ChemistryReport | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<AIQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setState(AppState.ANALYZING);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeExamPaper(base64);
        setReport(result);
        setState(AppState.REPORT);
      } catch (error) {
        console.error("Analysis failed:", error);
        alert("分析失败，请重试。");
        setState(AppState.HOME);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startPractice = async () => {
    if (!report || report.weakPoints.length === 0) return;
    
    setIsLoading(true);
    try {
      const questions = await generatePracticeQuestions(report.weakPoints);
      setPracticeQuestions(questions);
      setState(AppState.PRACTICE);
    } catch (error) {
      console.error("Failed to generate questions:", error);
      alert("题目生成失败。");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onHome={() => setState(AppState.HOME)} onChat={toggleChat} />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {state === AppState.HOME && (
          <Home onUpload={handleFileUpload} />
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 text-lg animate-pulse">正在利用AI分析化学试卷...</p>
            <p className="text-xs text-slate-400">我们将提取题目、诊断错因并生成深度解析</p>
          </div>
        )}

        {state === AppState.REPORT && report && (
          <AnalysisReport 
            report={report} 
            onPractice={startPractice} 
            isGenerating={isLoading} 
          />
        )}

        {state === AppState.PRACTICE && (
          <PracticeSession 
            questions={practiceQuestions} 
            onBack={() => setState(AppState.REPORT)} 
          />
        )}
      </main>

      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating Action Button for Chat */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-105 z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default App;
