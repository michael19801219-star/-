
import React, { useState } from 'react';
import { AppState, ChemistryReport, AIQuestion } from './types.ts';
import { analyzeExamPaper, generatePracticeQuestions } from './services/geminiService.ts';
import Header from './components/Header.tsx';
import Home from './components/Home.tsx';
import AnalysisReport from './components/AnalysisReport.tsx';
import PracticeSession from './components/PracticeSession.tsx';
import AIChatDrawer from './components/AIChatDrawer.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [report, setReport] = useState<ChemistryReport | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<AIQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setState(AppState.ANALYZING);

    try {
      const base64Promises = (Array.from(files) as File[]).map((file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]);
            } else {
              reject(new Error('无法读取文件数据'));
            }
          };
          reader.onerror = () => reject(new Error('读取文件失败'));
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(base64Promises);
      const result = await analyzeExamPaper(base64Images);
      setReport(result);
      setState(AppState.REPORT);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert(`分析失败: ${error.message || '网络连接或AI处理异常'}。请确保上传了清晰且多页内容连贯的试卷。`);
      setState(AppState.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const startPractice = async () => {
    if (!report || report.weakPoints.length === 0) return;
    
    setIsLoading(true);
    try {
      const questions = await generatePracticeQuestions(report.weakPoints);
      setPracticeQuestions(questions);
      setState(AppState.PRACTICE);
    } catch (error) {
      console.error("Practice generation error:", error);
      alert("题目生成失败，请稍后重试。");
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
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-700 text-xl font-bold animate-pulse mb-2">AI 老师正在深度诊断...</p>
              <p className="text-slate-400 text-sm">正在识别题型、逻辑关联并总结薄弱知识点</p>
            </div>
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

      <button 
        onClick={toggleChat}
        title="AI 答疑"
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default App;
