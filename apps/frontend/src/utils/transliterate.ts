export const transliterateToBengali = async (text: string): Promise<string> => {
  if (!text) return '';

  let processedText = text;

  // Pre-process common business abbreviations and words
  const customReplacements = [
    { regex: /\bM\/S\.?(?=\s|$)/gi, replacement: 'মেসার্স' },
    { regex: /\bENTERPRISE\b/gi, replacement: 'এন্টারপ্রাইজ' },
    { regex: /\bSTORE\b/gi, replacement: 'স্টোর' },
    { regex: /\bSTORES\b/gi, replacement: 'স্টোরস' },
    { regex: /\bLTD\.?\b/gi, replacement: 'লিমিটেড' },
    { regex: /\bLIMITED\b/gi, replacement: 'লিমিটেড' },
    { regex: /\bTRADERS\b/gi, replacement: 'ট্রেডার্স' },
    { regex: /\bCO\.?\b/gi, replacement: 'কোং' },
    { regex: /\bCOMPANY\b/gi, replacement: 'কোম্পানি' },
    { regex: /\bBROS\.?\b/gi, replacement: 'ব্রাদার্স' },
    { regex: /\bCORPORATION\b/gi, replacement: 'কর্পোরেশন' },
    { regex: /\bAGENCY\b/gi, replacement: 'এজেন্সি' },
    { regex: /\bAGENCIES\b/gi, replacement: 'এজেন্সিজ' },
    { regex: /\bPHARMACY\b/gi, replacement: 'ফার্মেসি' },
    { regex: /\bMOTORS\b/gi, replacement: 'মটরস' },
    { regex: /\bFASHION\b/gi, replacement: 'ফ্যাশন' },
    { regex: /\bGARMENTS\b/gi, replacement: 'গার্মেন্টস' },
    { regex: /\bTEXTILE\b/gi, replacement: 'টেক্সটাইল' },
    { regex: /\bBUILDERS\b/gi, replacement: 'বিল্ডার্স' },
    { regex: /\bPROPERTIES\b/gi, replacement: 'প্রপার্টিজ' },
    { regex: /\bHOSPITAL\b/gi, replacement: 'হাসপাতাল' },
    { regex: /\bCLINIC\b/gi, replacement: 'ক্লিনিক' },
    { regex: /\bDIAGNOSTIC\b/gi, replacement: 'ডায়াগনস্টিক' },
    { regex: /\bCENTER\b/gi, replacement: 'সেন্টার' },
    { regex: /\bCENTRE\b/gi, replacement: 'সেন্টার' },
    { regex: /&/g, replacement: 'এন্ড' },
  ];

  for (const { regex, replacement } of customReplacements) {
    processedText = processedText.replace(regex, replacement);
  }

  // Split by spaces to transliterate word by word
  const words = processedText.split(' ');
  const transliteratedWords = await Promise.all(words.map(async (word) => {
    // Don't transliterate empty strings or pure numbers/symbols if we can avoid it, but google handles numbers well.
    // Also skip if it already contains Bengali characters (from our custom replacements)
    if (!word.trim() || /[\u0980-\u09FF]/.test(word)) return word;
    
    try {
      const response = await fetch(`https://api.isupportbd.com/api/transliterate?text=${encodeURIComponent(word)}`);
      const data = await response.json();
      
      if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
        return data[1][0][1][0]; // Return the first (best) match
      }
      return word; // Fallback to original
    } catch (e) {
      console.error('Transliteration failed for word:', word, e);
      return word;
    }
  }));

  return transliteratedWords.join(' ');
};

// Translate numbers specifically since they are often standalone
export const translateNumbersToBengali = (text: string): string => {
  if (!text) return '';
  const engToBn: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', 
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return text.split('').map(char => engToBn[char] || char).join('');
};
