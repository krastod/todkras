
import React from 'react';
import { SecurityResult, LanguageCode } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, Lock } from 'lucide-react';
import { t } from '../i18n';

interface Props {
  result: SecurityResult;
  address: string;
  lang: LanguageCode;
}

const SecurityDashboard: React.FC<Props> = ({ result, address, lang }) => {
  const isHighRisk = result.riskScore > 50 || result.isFlagged;

  const getAlertColor = (level: string) => {
    switch(level) {
        case 'Critical': return 'bg-red-900/30 border-red-700 text-red-200';
        case 'High': return 'bg-orange-900/30 border-orange-700 text-orange-200';
        case 'Medium': return 'bg-yellow-900/30 border-yellow-700 text-yellow-200';
        default: return 'bg-blue-900/30 border-blue-700 text-blue-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Risk Header */}
      <div className={`rounded-2xl p-8 border ${isHighRisk ? 'bg-red-950/30 border-red-600' : 'bg-emerald-950/30 border-emerald-600'} flex flex-col md:flex-row items-center gap-8`}>
         <div className={`p-6 rounded-full border-4 ${isHighRisk ? 'bg-red-900 border-red-500' : 'bg-emerald-900 border-emerald-500'}`}>
             {isHighRisk ? <ShieldAlert className="w-16 h-16 text-white" /> : <ShieldCheck className="w-16 h-16 text-white" />}
         </div>
         <div className="flex-1 text-center md:text-left">
             <h2 className="text-3xl font-bold text-white mb-2">
                 {isHighRisk ? t(lang, 'risk_found') : t(lang, 'risk_low')}
             </h2>
             <p className="text-slate-300 mb-4">{result.summary}</p>
             <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                <span className="bg-slate-900 px-3 py-1 rounded border border-slate-700 text-slate-400 font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <span className={`px-3 py-1 rounded font-bold ${isHighRisk ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {t(lang, 'risk_score')} {result.riskScore}/100
                </span>
             </div>
         </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  {t(lang, 'alerts_title')}
              </h3>
          </div>
          {result.alerts.map((alert, idx) => (
              <div key={idx} className={`p-6 rounded-xl border ${getAlertColor(alert.level)}`}>
                  <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg">{alert.title}</h4>
                      <span className="text-xs uppercase tracking-wider font-bold px-2 py-1 bg-black/30 rounded">
                          {alert.level}
                      </span>
                  </div>
                  <p className="text-sm opacity-90 mb-4">{alert.description}</p>
                  <div className="bg-black/20 p-3 rounded-lg">
                      <p className="text-xs font-semibold uppercase mb-1 opacity-70">{t(lang, 'action_label')}</p>
                      <p className="text-sm font-medium">{alert.action}</p>
                  </div>
              </div>
          ))}
      </div>

      {/* Revoke Action Card */}
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-blue-400" />
                  {t(lang, 'revoke_title')}
              </h3>
              <p className="text-slate-400 max-w-xl">
                  {t(lang, 'revoke_desc')}
              </p>
          </div>
          <a 
            href={result.revokeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            {t(lang, 'revoke_btn')}
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
      </div>
    </div>
  );
};

export default SecurityDashboard;
