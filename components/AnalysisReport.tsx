
import React from 'react';
import { ChemistryReport } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisReportProps {
  report: ChemistryReport;
  onPractice: () => void;
  isGenerating: boolean;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report, onPractice, isGenerating }) => {
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
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wide">薄弱知识点概览</h3>
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
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
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
          <div key={idx} className={`bg-white rounded-2xl border ${q.isCorrect ? 'border-green-100' : 'border-red-100'} overflow-hidden shadow-sm transition-all hover:shadow-md`}>
            <div className={`px-6 py-3 flex items-center justify-between ${q.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${q.isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {q.isCorrect ? '正确' : '错误'}
                </span>
                <span className="text-sm text-slate-600 font-semibold">{q.topic}</span>
              </div>
              <span className="text-xs text-slate-400">题目 {idx + 1}</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="whitespace-pre-wrap">{q.originalText}</p>
              </div>

              {!q.isCorrect && (
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block mb-1">你的答案</span>
                    <span className="text-xl font-bold text-red-500">{q.studentAnswer || '无'}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block mb-1">正确答案</span>
                    <span className="text-xl font-bold text-green-600">{q.correctAnswer}</span>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-1.5 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    核心原理
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.explanation.principle}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-1.5 flex items-center">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                    逻辑推导
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.explanation.logic}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <h4 className="text-xs font-bold text-amber-700 mb-1 flex items-center uppercase tracking-wider">
                      注意事项
                    </h4>
                    <p className="text-amber-600 text-xs leading-relaxed">{q.explanation.precautions}</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <h4 className="text-xs font-bold text-rose-700 mb-1 flex items-center uppercase tracking-wider">
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

      <div className="sticky bottom-8 flex justify-center pt-8 pointer-events-none">
        <button 
          onClick={onPractice}
          disabled={isGenerating}
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-3 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>正在生成强化卷...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
