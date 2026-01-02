
import React, { useState } from 'react';
import { AIQuestion } from '../types';

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
  };

  if (!question) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-500 flex items-center text-sm hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回报告
        </button>
        <div className="flex items-center space-x-4">
          <button onClick={downloadPDF} className="text-blue-600 flex items-center text-sm hover:underline">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载练习卷
          </button>
          <div className="text-slate-400 text-sm font-medium">
            进度: <span className="text-slate-800">{currentIdx + 1}</span> / {questions.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 leading-relaxed mb-6">
            {question.text}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center group
                  ${selectedAnswer === key ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}
                  ${showExplanation && key === question.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                  ${showExplanation && selectedAnswer === key && key !== question.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                `}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 transition-colors
                  ${selectedAnswer === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}
                  ${showExplanation && key === question.correctAnswer ? 'bg-green-500 text-white' : ''}
                  ${showExplanation && selectedAnswer === key && key !== question.correctAnswer ? 'bg-red-500 text-white' : ''}
                `}>
                  {key}
                </span>
                <span className={`flex-1 ${selectedAnswer === key ? 'text-blue-900 font-semibold' : 'text-slate-700'}`}>
                  {value}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
          {!showExplanation ? (
            <button
              onClick={() => setShowExplanation(true)}
              disabled={!selectedAnswer}
              className="bg-slate-800 text-white font-bold py-3 px-8 rounded-xl disabled:opacity-30"
            >
              提交答案
            </button>
          ) : (
            <div className="flex-1">
              <div className={`p-4 rounded-xl mb-4 ${selectedAnswer === question.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <p className="font-bold">
                  {selectedAnswer === question.correctAnswer ? '回答正确！' : `回答错误。正确答案是 ${question.correctAnswer}`}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">特级解析</h4>
                <p className="text-blue-700 text-sm leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
              </div>
            </div>
          )}
          
          {showExplanation && (
            <button
              onClick={handleNext}
              className="ml-4 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors self-end"
            >
              {currentIdx === questions.length - 1 ? '完成练习' : '下一题'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;
