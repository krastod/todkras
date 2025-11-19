
import React from 'react';
import { Zap, Globe } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, t } from '../i18n';

interface HeaderProps {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <Zap className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
          {t(lang, 'app_title')}
        </h1>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent sm:hidden">
          {t(lang, 'app_title')}
        </h1>
      </div>
      <nav className="flex items-center space-x-4 md:space-x-6 text-sm font-medium text-slate-400">
        <a href="#" className="hover:text-blue-400 transition-colors hidden md:block">{t(lang, 'nav_home')}</a>
        <a href="#" className="hover:text-blue-400 transition-colors hidden md:block">{t(lang, 'nav_about')}</a>
        
        {/* Language Selector */}
        <div className="relative group">
            <div className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded-lg cursor-pointer border border-slate-700 transition-colors">
                <Globe className="w-4 h-4 text-slate-400" />
                <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value as LanguageCode)}
                    className="bg-transparent text-slate-200 text-xs appearance-none outline-none cursor-pointer pr-1"
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-slate-800 text-slate-200">
                            {l.flag} {l.code.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;