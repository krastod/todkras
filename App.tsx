
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import WalletInput from './components/WalletInput';
import AirdropCard from './components/AirdropCard';
import StatsChart from './components/StatsChart';
import SecurityDashboard from './components/SecurityDashboard';
import PortfolioDashboard from './components/PortfolioDashboard';
import { analyzeAirdrops, analyzeWalletSecurity, analyzePortfolio } from './services/geminiService';
import { SearchResult, SecurityResult, PortfolioResult, LanguageCode } from './types';
import { Info, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { t } from './i18n';

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('bg');
  const [mode, setMode] = useState<'airdrop' | 'security' | 'portfolio'>('airdrop');
  const [loading, setLoading] = useState(false);
  
  const [airdropResult, setAirdropResult] = useState<SearchResult | null>(null);
  const [securityResult, setSecurityResult] = useState<SecurityResult | null>(null);
  const [portfolioResult, setPortfolioResult] = useState<PortfolioResult | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string>('');

  const handleSearch = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    setAirdropResult(null);
    setSecurityResult(null);
    setPortfolioResult(null);
    setSearchedAddress(address);

    try {
      if (mode === 'airdrop') {
        const data = await analyzeAirdrops(address, lang);
        setAirdropResult(data);
      } else if (mode === 'security') {
        const data = await analyzeWalletSecurity(address, lang);
        setSecurityResult(data);
      } else {
        const data = await analyzePortfolio(address, lang);
        setPortfolioResult(data);
      }
    } catch (err) {
      setError("Error during analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mode, lang]);

  // Handler to switch mode and clear results
  const handleModeChange = (newMode: 'airdrop' | 'security' | 'portfolio') => {
    setMode(newMode);
    setAirdropResult(null);
    setSecurityResult(null);
    setPortfolioResult(null);
    setError(null);
    setSearchedAddress('');
  };

  const getLoadingText = () => {
      if (mode === 'airdrop') return t(lang, 'loading_airdrop');
      if (mode === 'security') return t(lang, 'loading_security');
      return t(lang, 'loading_portfolio');
  }

  const getLoadingColor = () => {
      if (mode === 'airdrop') return 'text-blue-400';
      if (mode === 'security') return 'text-red-400';
      return 'text-violet-400';
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] overflow-x-hidden selection:bg-blue-500/30">
      <Header lang={lang} setLang={setLang} />

      <main className="flex-grow px-4 md:px-8 pb-16">
        {/* Hero Section */}
        <div className={`${(airdropResult || securityResult || portfolioResult) ? 'py-8' : 'py-20'} transition-all duration-500`}>
          <WalletInput 
            onSearch={handleSearch} 
            isLoading={loading} 
            mode={mode}
            setMode={handleModeChange}
            lang={lang}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto mt-8 text-center animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-slate-800 rounded-xl"></div>
              <div className="h-64 bg-slate-800 rounded-xl"></div>
              <div className="h-64 bg-slate-800 rounded-xl"></div>
            </div>
            <p className={`mt-6 font-mono text-sm ${getLoadingColor()}`}>
                {getLoadingText()}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* AIRDROP Results Section */}
        {airdropResult && !loading && mode === 'airdrop' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up">
            
            {/* Status Banner */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1">
                 <div className="flex items-center space-x-3 mb-4">
                   <div className="bg-slate-700 p-2 rounded-lg">
                     <ShieldCheck className="text-emerald-400 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-white">{t(lang, 'analysis_for')} <span className="font-mono text-blue-400">{searchedAddress.slice(0,6)}...{searchedAddress.slice(-4)}</span></h3>
                     <p className="text-sm text-slate-400">{t(lang, 'network')} {airdropResult.walletType}</p>
                   </div>
                 </div>
                 <p className="text-slate-300 italic border-l-4 border-blue-500 pl-4 py-1 bg-slate-900/30 rounded-r">
                   "{airdropResult.summary}"
                 </p>
               </div>
               
               {/* Simple Visualization */}
               <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                 <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Category Distribution</h4>
                 <StatsChart items={airdropResult.airdrops} />
               </div>
            </div>

            {/* Airdrop Grid */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-blue-500 w-1 h-8 mr-3 rounded-full"></span>
                {t(lang, 'found_opps')}
                <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                  {airdropResult.airdrops.length}
                </span>
              </h3>
              
              {airdropResult.airdrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {airdropResult.airdrops.map((drop, idx) => (
                    <AirdropCard key={idx} item={drop} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                  <p className="text-slate-400">{t(lang, 'no_airdrops')}</p>
                </div>
              )}
            </div>
            
            {/* Sources */}
            {airdropResult.groundingLinks && airdropResult.groundingLinks.length > 0 && (
                <SourcesList links={airdropResult.groundingLinks} lang={lang} />
            )}
          </div>
        )}

        {/* SECURITY Results Section */}
        {securityResult && !loading && mode === 'security' && (
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <SecurityDashboard result={securityResult} address={searchedAddress} lang={lang} />
                
                 {/* Sources */}
                {securityResult.groundingLinks && securityResult.groundingLinks.length > 0 && (
                    <SourcesList links={securityResult.groundingLinks} lang={lang} />
                )}
            </div>
        )}

        {/* PORTFOLIO Results Section */}
        {portfolioResult && !loading && mode === 'portfolio' && (
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <PortfolioDashboard result={portfolioResult} address={searchedAddress} lang={lang} />
                
                 {/* Sources */}
                {portfolioResult.groundingLinks && portfolioResult.groundingLinks.length > 0 && (
                    <SourcesList links={portfolioResult.groundingLinks} lang={lang} />
                )}
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>{t(lang, 'footer_text')}</p>
        <p className="mt-2 text-xs">Powered by Gemini 2.5 Flash & Google Search Grounding</p>
      </footer>
    </div>
  );
};

const SourcesList: React.FC<{links: string[], lang: LanguageCode}> = ({ links, lang }) => (
    <div className="mt-12 pt-8 border-t border-slate-800">
    <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center">
        <Info className="w-4 h-4 mr-2" />
        {t(lang, 'sources_title')}
    </h4>
    <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
        <a 
            key={i} 
            href={link} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-900/50 transition-colors"
        >
            <LinkIcon className="w-3 h-3 mr-1.5" />
            {new URL(link).hostname}
        </a>
        ))}
    </div>
    </div>
);

export default App;
