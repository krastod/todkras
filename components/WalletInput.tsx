
import React, { useState } from 'react';
import { Search, Wallet, ShieldAlert, Zap, PieChart } from 'lucide-react';
import { LanguageCode } from '../types';
import { t } from '../i18n';

interface WalletInputProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
  mode: 'airdrop' | 'security' | 'portfolio';
  setMode: (mode: 'airdrop' | 'security' | 'portfolio') => void;
  lang: LanguageCode;
}

const WalletInput: React.FC<WalletInputProps> = ({ onSearch, isLoading, mode, setMode, lang }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim().length > 10) {
      onSearch(address.trim());
    }
  };

  const getTitle = () => {
    if (mode === 'airdrop') return (
        <>
            {t(lang, 'hero_airdrop_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {t(lang, 'hero_airdrop_subtitle')}
            </span>
        </>
    );
    if (mode === 'security') return (
        <>
            {t(lang, 'hero_security_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            {t(lang, 'hero_security_subtitle')}
            </span>
        </>
    );
    return (
        <>
            {t(lang, 'hero_portfolio_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            {t(lang, 'hero_portfolio_subtitle')}
            </span>
        </>
    );
  }

  const getDescription = () => {
      if (mode === 'airdrop') return t(lang, 'hero_airdrop_desc');
      if (mode === 'security') return t(lang, 'hero_security_desc');
      return t(lang, 'hero_portfolio_desc');
  }

  const getButtonClass = (active: boolean, type: 'airdrop' | 'security' | 'portfolio') => {
      const base = "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ";
      if (!active) return base + "text-slate-400 hover:text-white";
      
      if (type === 'airdrop') return base + "bg-blue-600 text-white shadow-lg shadow-blue-900/50";
      if (type === 'security') return base + "bg-red-600 text-white shadow-lg shadow-red-900/50";
      return base + "bg-violet-600 text-white shadow-lg shadow-violet-900/50";
  }

  const getBorderGradient = () => {
      if (mode === 'airdrop') return 'from-blue-600 to-purple-600';
      if (mode === 'security') return 'from-red-600 to-orange-600';
      return 'from-violet-600 to-fuchsia-600';
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center relative z-10">
      
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 inline-flex flex-wrap justify-center gap-1">
            <button
                onClick={() => setMode('airdrop')}
                className={getButtonClass(mode === 'airdrop', 'airdrop')}
            >
                <Zap className="w-4 h-4 mr-2" />
                {t(lang, 'mode_airdrop')}
            </button>
            <button
                onClick={() => setMode('portfolio')}
                className={getButtonClass(mode === 'portfolio', 'portfolio')}
            >
                <PieChart className="w-4 h-4 mr-2" />
                {t(lang, 'mode_portfolio')}
            </button>
            <button
                onClick={() => setMode('security')}
                className={getButtonClass(mode === 'security', 'security')}
            >
                <ShieldAlert className="w-4 h-4 mr-2" />
                {t(lang, 'mode_security')}
            </button>
        </div>
      </div>

      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
        {getTitle()}
      </h2>
      
      <p className="text-slate-400 mb-8 text-lg max-w-lg mx-auto">
        {getDescription()}
      </p>
      
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${getBorderGradient()}`}></div>
        <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-700 p-2 shadow-2xl">
            <div className="pl-3 text-slate-500">
                <Wallet className="w-6 h-6" />
            </div>
            <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={mode === 'portfolio' ? t(lang, 'input_placeholder_portfolio') : t(lang, 'input_placeholder_default')}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 outline-none placeholder-slate-500 font-mono"
            disabled={isLoading}
            />
            <button
            type="submit"
            disabled={isLoading || address.length < 10}
            className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 text-white disabled:bg-slate-700 disabled:cursor-not-allowed ${
                mode === 'airdrop' ? 'bg-blue-600 hover:bg-blue-500' : 
                mode === 'security' ? 'bg-red-600 hover:bg-red-500' : 
                'bg-violet-600 hover:bg-violet-500'
            }`}
            >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                <span>
                    {mode === 'airdrop' ? t(lang, 'btn_search') : mode === 'portfolio' ? t(lang, 'btn_analyze') : t(lang, 'btn_scan')}
                </span>
                <Search className="w-4 h-4" />
                </>
            )}
            </button>
        </div>
      </form>
      
      <div className="mt-4 flex justify-center space-x-4 text-xs text-slate-500">
        <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>EVM Compatible</span>
        <span className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Solana</span>
        <span className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Bitcoin</span>
      </div>
    </div>
  );
};

export default WalletInput;
