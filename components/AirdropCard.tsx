
import React from 'react';
import { AirdropItem, LanguageCode } from '../types';
import { ExternalLink, AlertCircle, CheckCircle2, Timer } from 'lucide-react';
import { t } from '../i18n';

interface Props {
  item: AirdropItem;
  lang: LanguageCode;
}

const AirdropCard: React.FC<Props> = ({ item, lang }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Upcoming': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'Rumor': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'Upcoming': return <Timer className="w-4 h-4 mr-1" />;
      default: return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{item.name}</h3>
            <span className="text-xs font-mono text-slate-500 px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
              {item.token}
            </span>
          </div>
          <span className="text-xs text-slate-400 uppercase tracking-wider">{item.category}</span>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center ${getStatusColor(item.status)}`}>
          {getStatusIcon(item.status)}
          {item.status}
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-6 flex-grow leading-relaxed">
        {item.description}
      </p>

      <div className="pt-4 border-t border-slate-700 mt-auto flex items-center justify-between">
        <div className="text-xs">
           <span className="text-slate-500">{t(lang, 'likelihood')} </span>
           <span className={`${item.likelihood === 'High' ? 'text-green-400' : item.likelihood === 'Medium' ? 'text-yellow-400' : 'text-red-400'} font-bold`}>
             {item.likelihood}
           </span>
        </div>
        {item.actionUrl && (
          <a 
            href={item.actionUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-blue-400 hover:text-white transition-colors"
          >
            {t(lang, 'check_link')} <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AirdropCard;
