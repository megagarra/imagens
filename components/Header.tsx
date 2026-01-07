
import React from 'react';
import { Palette, Github, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Civitai Studio
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Powered by Gemini & Civitai</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Discover</a>
          <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">My Generations</a>
          <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Models</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
          </button>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all">
            <Github className="w-4 h-4" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
