
import React from 'react';
import { PortfolioResult, PortfolioItem, LanguageCode } from '../types';
import { Wallet, Layers, Image, ExternalLink, Coins, Box } from 'lucide-react';
import { t } from '../i18n';

interface Props {
  result: PortfolioResult;
  address: string;
  lang: LanguageCode;
}

const PortfolioDashboard: React.FC<Props> = ({ result, address, lang }) => {

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <Wallet className="mr-3 text-violet-400" />
                    {t(lang, 'portfolio_overview')}
                </h2>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                    {result.summary}
                </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">{t(lang, 'network')}</p>
                <p className="text-lg font-mono font-bold text-violet-400">{result.walletType}</p>
            </div>
        </div>
      </div>

      {/* Direct Tools Links (Critical for Utility) */}
      <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Box className="w-5 h-5 mr-2 text-violet-400" />
              {t(lang, 'tools_title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {result.tools.map((tool, idx) => (
                  <a 
                    key={idx} 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
                  >
                      <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-white group-hover:text-violet-300">{tool.name}</span>
                          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400" />
                      </div>
                      <p className="text-xs text-slate-400">{tool.description}</p>
                  </a>
              ))}
          </div>
      </div>

      {/* Holdings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Assets / Tokens */}
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-emerald-400" />
                  {t(lang, 'assets_title')}
              </h3>
              {result.topHoldings.length > 0 ? (
                  <div className="space-y-3">
                      {result.topHoldings.map((item, i) => (
                          <PortfolioRow key={i} item={item} />
                      ))}
                  </div>
              ) : (
                  <EmptyState text={t(lang, 'no_data')} />
              )}
          </div>

           {/* DeFi & Pools */}
           <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-400" />
                  {t(lang, 'defi_title')}
              </h3>
              {result.defiPositions.length > 0 ? (
                  <div className="space-y-3">
                      {result.defiPositions.map((item, i) => (
                          <PortfolioRow key={i} item={item} />
                      ))}
                  </div>
              ) : (
                  <EmptyState text={t(lang, 'no_data')} />
              )}
          </div>

      </div>

      {/* NFTs */}
      <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-pink-400" />
              {t(lang, 'nft_title')}
          </h3>
          {result.nfts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {result.nfts.map((item, i) => (
                       <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center space-x-3">
                           <div className="w-10 h-10 bg-pink-900/30 rounded-lg flex items-center justify-center">
                               <Image className="w-5 h-5 text-pink-500" />
                           </div>
                           <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-white truncate">{item.name}</p>
                               <p className="text-xs text-slate-500">{item.network}</p>
                           </div>
                           {item.url && (
                               <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                                   <ExternalLink className="w-4 h-4" />
                               </a>
                           )}
                       </div>
                   ))}
               </div>
          ) : (
              <div className="bg-slate-800/30 border border-slate-700 border-dashed rounded-xl p-8 text-center text-slate-400">
                  <p>{t(lang, 'no_data')}</p>
              </div>
          )}
      </div>
    </div>
  );
};

const PortfolioRow: React.FC<{item: PortfolioItem}> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 hover:border-slate-600 transition-colors">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                {item.name.substring(0,2).toUpperCase()}
            </div>
            <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-slate-500">{item.type} • {item.network}</p>
            </div>
        </div>
        {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-violet-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
            </a>
        )}
    </div>
);

const EmptyState: React.FC<{text: string}> = ({ text }) => (
    <div className="text-center py-8 px-4 text-slate-500 text-sm italic">
        {text}
    </div>
);

export default PortfolioDashboard;
