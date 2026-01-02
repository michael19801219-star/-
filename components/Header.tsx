
import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onChat }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={onHome}
        >
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.336a4 4 0 01-2.573.345l-2.387-.477a2 2 0 00-1.022.547l-1.396 1.396a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.573 2.573l2.387-.477a2 2 0 001.022-.547l1.396-1.396a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-2.573-2.573z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">高考化学提分宝</h1>
        </div>
        <nav className="flex space-x-6">
          <button onClick={onHome} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">首页</button>
          <button onClick={onChat} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">AI答疑</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
