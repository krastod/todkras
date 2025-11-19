
import { GoogleGenAI } from "@google/genai";
import { AirdropItem, SearchResult, SecurityResult, PortfolioResult, WalletType, LanguageCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyWallet = (address: string): WalletType => {
  if (address.startsWith('0x') && address.length === 42) return WalletType.EVM;
  if (address.length > 30 && address.length < 45 && !address.startsWith('0x')) return WalletType.SOLANA;
  if (address.startsWith('bc1') || address.startsWith('1') || address.startsWith('3')) return WalletType.BITCOIN;
  if (address.startsWith('cosmos')) return WalletType.COSMOS;
  return WalletType.UNKNOWN;
};

const getRevokeLink = (type: WalletType, address: string): string => {
  if (type === WalletType.EVM) return `https://revoke.cash/address/${address}`;
  if (type === WalletType.SOLANA) return `https://famousfoxes.com/revoke`; // Common solana tool
  return "https://revoke.cash";
};

const getLanguageName = (code: LanguageCode): string => {
    const map: Record<LanguageCode, string> = {
        bg: 'Bulgarian',
        en: 'English',
        ru: 'Russian',
        zh: 'Chinese (Simplified)',
        hi: 'Hindi',
        ko: 'Korean',
        fr: 'French',
        es: 'Spanish',
        de: 'German'
    };
    return map[code] || 'English';
}

export const analyzeAirdrops = async (address: string, lang: LanguageCode = 'bg'): Promise<SearchResult> => {
  const walletType = identifyWallet(address);
  const targetLang = getLanguageName(lang);

  const prompt = `
    Act as a senior cryptocurrency airdrop analyst.
    I have a wallet address: ${address} which appears to be a ${walletType} wallet.

    Goal: Search for CURRENTLY ACTIVE or RECENTLY ANNOUNCED airdrops relevant to this network ecosystem. 
    Do not hallucinate. Use Google Search to find real, live data.

    Please perform the following:
    1. Search for "latest crypto airdrops ${walletType} 2024 2025".
    2. Search for "active claims for ${walletType} users".
    3. Identify 3-5 specific projects that are popular right now for potential eligibility or farming.
    4. Determine the likely category (Layer 2, DeFi, etc.).

    Output Format:
    Provide a JSON object inside \`\`\`json\`\`\` code blocks.
    The content MUST be in the ${targetLang} language.
    The structure must be:
    {
      "summary": "A brief overview (in ${targetLang}) of the current airdrop climate for this wallet type.",
      "airdrops": [
        {
          "name": "Project Name",
          "token": "Token Symbol (or TBD)",
          "status": "Active" or "Upcoming" or "Rumor",
          "likelihood": "High" or "Medium" or "Low",
          "description": "Short criteria in ${targetLang}.",
          "category": "L2" or "DeFi" or "NFT" or "Infrastructure" or "Other",
          "actionUrl": "Official URL if found, otherwise empty string"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    const text = response.text || "";
    
    const groundingLinks: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
                groundingLinks.push(chunk.web.uri);
            }
        });
    }

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        walletType,
        airdrops: parsed.airdrops || [],
        summary: parsed.summary || "No information found.",
        groundingLinks
      };
    } else {
        return {
            walletType,
            airdrops: [],
            summary: "Failed to structure data automatically.",
            groundingLinks
        };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Error connecting to AI services.");
  }
};

export const analyzeWalletSecurity = async (address: string, lang: LanguageCode = 'bg'): Promise<SecurityResult> => {
  const walletType = identifyWallet(address);
  const revokeLink = getRevokeLink(walletType, address);
  const targetLang = getLanguageName(lang);

  const prompt = `
    Act as a Blockchain Security Auditor.
    Target Address: ${address} (${walletType}).

    Goal: Perform a reputation check and generate a security checklist.
    
    Tasks:
    1. Search Google for "${address} scam report", "${address} hack", "${address} phishing database", "${address} etherscan comments".
    2. If you find SPECIFIC reports linking this address to scams, set "isFlagged" to true.
    3. Generate a security assessment based on common vectors for ${walletType} (e.g. unlimited token approvals, malicious signatures).
    4. Provide advice on how to use Revoke.cash or similar tools.

    Output Format (JSON in \`\`\`json\`\`\`):
    The content MUST be in the ${targetLang} language.
    {
      "summary": "Summary in ${targetLang}. If the address is clean in search results, say 'No public reports found, but always be careful'. If flagged, warn clearly.",
      "isFlagged": boolean (true if search results indicate a known scammer/hacker address),
      "riskScore": number (10-100 based on search findings. 10 is low risk/clean, 90+ is confirmed scam address),
      "alerts": [
        {
          "level": "Critical" | "High" | "Medium" | "Low" | "Safe",
          "title": "Title in ${targetLang}",
          "description": "Description in ${targetLang}",
          "action": "Actionable advice in ${targetLang}"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const text = response.text || "";
    
    const groundingLinks: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
                groundingLinks.push(chunk.web.uri);
            }
        });
    }

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        walletType,
        riskScore: parsed.riskScore || 10,
        isFlagged: parsed.isFlagged || false,
        summary: parsed.summary || "Analysis complete.",
        alerts: parsed.alerts || [],
        revokeLink,
        groundingLinks
      };
    } else {
       return {
        walletType,
        riskScore: 20,
        isFlagged: false,
        summary: "Could not confirm reputation via search. Follow standard security procedures.",
        alerts: [{
          level: 'Medium',
          title: 'Manual Check',
          description: 'AI found no direct reports, but this does not guarantee safety.',
          action: 'Use Revoke.cash'
        }],
        revokeLink,
        groundingLinks
      };
    }
  } catch (error) {
    console.error("Security Scan Error:", error);
    throw new Error("Error during security audit.");
  }
};

export const analyzePortfolio = async (address: string, lang: LanguageCode = 'bg'): Promise<PortfolioResult> => {
  const walletType = identifyWallet(address);
  const targetLang = getLanguageName(lang);

  // Construct specific URLs based on wallet type
  let toolLinks = [];
  if (walletType === WalletType.EVM) {
    toolLinks = [
      { name: "DeBank", url: `https://debank.com/profile/${address}`, description: "View all DeFi positions and balances." },
      { name: "Zapper", url: `https://zapper.xyz/account/${address}`, description: "Portfolio management and NFT." },
      { name: "OpenSea", url: `https://opensea.io/${address}`, description: "NFT Collection viewer." },
      { name: "Etherscan", url: `https://etherscan.io/address/${address}`, description: "Transaction history." }
    ];
  } else if (walletType === WalletType.SOLANA) {
    toolLinks = [
      { name: "Step Finance", url: `https://app.step.finance/en/dashboard?watch=${address}`, description: "Solana Dashboard for all positions." },
      { name: "SolanaFM", url: `https://solana.fm/address/${address}`, description: "Explorer for Solana." },
      { name: "Magic Eden", url: `https://magiceden.io/u/${address}`, description: "NFT Portfolio." }
    ];
  } else {
    toolLinks = [
       { name: "Blockchain.com", url: `https://www.blockchain.com/explorer/addresses/btc/${address}`, description: "Bitcoin Explorer" }
    ];
  }

  const prompt = `
    Act as a Crypto Portfolio Manager.
    Target Address: ${address} (${walletType}).
    
    Goal: Provide a portfolio summary based on PUBLIC SEARCH DATA.
    
    Note: Since you cannot query the blockchain directly for real-time integer balances, you must:
    1. Search for this address to see if it belongs to a known entity (Whale, Exchange, Influencer).
    2. If known, list their reported top holdings.
    3. If unknown (regular user), list the MAJOR Protocols and Networks that are popular for ${walletType} right now, as "Likely Places to Check".
    4. Identify standard Staking or Lending pools relevant to this chain.

    Output Format (JSON in \`\`\`json\`\`\`):
    The content MUST be in the ${targetLang} language.
    {
      "summary": "${targetLang} summary. If address is generic, say 'This appears to be a personal wallet. Use links below for exact balances' in ${targetLang}. If it is a known entity (e.g. Vitalik), describe it.",
      "topHoldings": [
        { "name": "Name (e.g. Ethereum)", "type": "Token", "network": "Ethereum", "url": "Link to CoinGecko or similar" }
      ],
      "defiPositions": [
        { "name": "Protocol Name (e.g. Uniswap V3)", "type": "DeFi Pool", "network": "Ethereum", "url": "Link to protocol" }
      ],
      "nfts": [
         { "name": "Collection Name", "type": "NFT", "network": "Ethereum", "url": "Link to collection" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const text = response.text || "";
    const groundingLinks: string[] = [];
    
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) groundingLinks.push(chunk.web.uri);
        });
    }

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        walletType,
        summary: parsed.summary,
        topHoldings: parsed.topHoldings || [],
        defiPositions: parsed.defiPositions || [],
        nfts: parsed.nfts || [],
        tools: toolLinks,
        groundingLinks
      };
    } else {
        // Fallback if AI fails to parse structure
        return {
            walletType,
            summary: "Could not extract detailed info. Please use the direct tools below.",
            topHoldings: [],
            defiPositions: [],
            nfts: [],
            tools: toolLinks,
            groundingLinks
        };
    }
  } catch (error) {
    console.error("Portfolio Scan Error:", error);
    // Return a safe fallback with just the links
    return {
        walletType,
        summary: "Error during AI analysis. Use direct scanner links.",
        topHoldings: [],
        defiPositions: [],
        nfts: [],
        tools: toolLinks,
        groundingLinks: []
    };
  }
};
