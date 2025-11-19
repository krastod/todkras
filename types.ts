
export enum WalletType {
  EVM = 'EVM (Ethereum/L2s)',
  SOLANA = 'Solana',
  BITCOIN = 'Bitcoin',
  COSMOS = 'Cosmos',
  UNKNOWN = 'Unknown'
}

export type LanguageCode = 'bg' | 'en' | 'ru' | 'zh' | 'hi' | 'ko' | 'fr' | 'es' | 'de';

export interface AirdropItem {
  name: string;
  token: string;
  status: 'Active' | 'Upcoming' | 'Expired' | 'Rumor';
  likelihood: 'High' | 'Medium' | 'Low';
  description: string;
  actionUrl?: string;
  category: 'L2' | 'DeFi' | 'NFT' | 'Infrastructure' | 'Other';
}

export interface SearchResult {
  walletType: WalletType;
  airdrops: AirdropItem[];
  summary: string;
  groundingLinks: string[];
}

export interface SecurityAlert {
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe';
  title: string;
  description: string;
  action: string; // e.g., "Revoke immediately", "Disconnect"
}

export interface SecurityResult {
  walletType: WalletType;
  riskScore: number; // 0 to 100
  isFlagged: boolean; // If found in search results as scammer/hacked
  summary: string;
  alerts: SecurityAlert[];
  revokeLink: string;
  groundingLinks: string[];
}

export interface PortfolioItem {
  name: string;
  type: 'Token' | 'NFT' | 'DeFi Pool' | 'Staking' | 'Lending';
  network: string;
  value?: string; // e.g. "$500" or "Unknown"
  url: string;
}

export interface PortfolioResult {
  walletType: WalletType;
  summary: string;
  topHoldings: PortfolioItem[];
  defiPositions: PortfolioItem[];
  nfts: PortfolioItem[];
  tools: { name: string; url: string; description: string }[];
  groundingLinks: string[];
}

export interface ChartData {
  name: string;
  value: number;
}
