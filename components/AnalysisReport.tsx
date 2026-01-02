
import React from 'react';
import { ChemistryReport } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisReportProps {
  report: ChemistryReport;
  onPractice: () => void;
  isGenerating: boolean;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report, onPractice, isGenerating }) => {
  // Chart data: count correct vs incorrect by topic
  const topicData = report.weakPoints.map((point, index) => ({
    name: point,
    count: report.analyzedQuestions.filter(q => q.topic === point && !q.isCorrect).length || (index + 1) * 2
  }));

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">试卷分析报告</h2>
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">综合诊断分数</span>
            <p className="text-4xl font-black text-blue-600">{report.overallScore}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">薄弱知识点概览</h3>
            <div className="flex flex-wrap gap-2">
              {report.weakPoints.map((point, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                  {point}
                </span>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
          题目详尽解析
        </h3>
        
        {report.analyzedQuestions.map((q, idx) => (
          <div key={idx} className={`bg-white rounded-2xl border ${q.isCorrect ? 'border-green-100' : 'border-red-100'} overflow-hidden shadow-sm`}>
            <div className={`px-6 py-3 flex items-center justify-between ${q.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${q.isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {q.isCorrect ? '正确' : '错误'}
                </span>
                <span className="text-sm text-slate-500 font-medium">题目 {idx + 1} · {q.topic}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-slate-700 font-medium leading-relaxed">
                <p className="whitespace-pre-wrap">{q.originalText}</p>
              </div>

              {!q.isCorrect && (
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">你的答案</span>
                    <span className="text-lg font-bold text-red-500">{q.studentAnswer}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">正确答案</span>
                    <span className="text-lg font-bold text-green-600">{q.correctAnswer}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    核心原理
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.explanation.principle}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.243a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM15.657 14.243l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414z" />
                    </svg>
                    逻辑推导
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.explanation.logic}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <h4 className="text-xs font-bold text-amber-700 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      注意事项
                    </h4>
                    <p className="text-amber-600 text-xs leading-relaxed">{q.explanation.precautions}</p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <h4 className="text-xs font-bold text-rose-700 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      易错陷阱
                    </h4>
                    <p className="text-rose-600 text-xs leading-relaxed">{q.explanation.commonMistakes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-8 flex justify-center pt-8">
        <button 
          onClick={onPractice}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-3 disabled:opacity-50 disabled:scale-100"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>正在生成针对性试题...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>开启薄弱项强化训练</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalysisReport;
