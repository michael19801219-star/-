
import React, { useState } from 'react';
import { AIQuestion } from '../types.ts';

interface PracticeSessionProps {
  questions: AIQuestion[];
  onBack: () => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ questions, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const question = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
    setUserAnswers({ ...userAnswers, [question.id]: option });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(userAnswers[questions[currentIdx + 1].id] || null);
      setShowExplanation(false);
    } else {
      onBack();
    }
  };

  const downloadPDF = () => {
    const content = questions.map((q, i) => {
      const optionsStr = Object.entries(q.options).map(([k, v]) => `${k}. ${v}`).join('\n');
      return `第${i + 1}题：\n${q.text}\n${optionsStr}\n\n答案：${q.correctAnswer}\n解析：${q.explanation}\n\n-------------------\n`;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '高考化学强化训练题.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!question) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-500 flex items-center text-sm hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回报告
        </button>
        <div className="flex items-center space-x-6">
          <button onClick={downloadPDF} className="text-blue-600 flex items-center text-sm font-semibold hover:underline">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载完整练习卷
          </button>
          <div className="text-slate-400 text-sm font-bold bg-white px-3 py-1 rounded-full border border-slate-100">
            进度: <span className="text-blue-600">{currentIdx + 1}</span> / {questions.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px] flex flex-col transition-all">
        <div className="mb-8">
          <div className="mb-8">
             <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">高考难度模拟</span>
             <h3 className="text-xl font-bold text-slate-800 leading-relaxed mt-4">
              {question.text}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center group
                  ${selectedAnswer === key ? 'border-blue-600 bg-blue-50 shadow-inner' : 'border-slate-50 hover:border-blue-200 hover:bg-slate-50'}
                  ${showExplanation && key === question.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                  ${showExplanation && selectedAnswer === key && key !== question.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                `}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 transition-all
                  ${selectedAnswer === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}
                  ${showExplanation && key === question.correctAnswer ? 'bg-green-500 text-white' : ''}
                  ${showExplanation && selectedAnswer === key && key !== question.correctAnswer ? 'bg-red-500 text-white' : ''}
                `}>
                  {key}
                </span>
                <span className={`flex-1 text-base ${selectedAnswer === key ? 'text-blue-900 font-bold' : 'text-slate-700 font-medium'}`}>
                  {value}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-50">
          {!showExplanation ? (
            <button
              onClick={() => setShowExplanation(true)}
              disabled={!selectedAnswer}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl disabled:opacity-20 transition-all hover:bg-black"
            >
              提交本题
            </button>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <div className={`p-5 rounded-2xl mb-6 flex items-center space-x-3 ${selectedAnswer === question.correctAnswer ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedAnswer === question.correctAnswer ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                   {selectedAnswer === question.correctAnswer ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                   )}
                </div>
                <p className="font-bold text-lg">
                  {selectedAnswer === question.correctAnswer ? '回答正确！' : `回答错误。正确答案是 ${question.correctAnswer}`}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>
                  名师精析
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{question.explanation}</p>
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center"
              >
                {currentIdx === questions.length - 1 ? '结束练习' : '下一题'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;
