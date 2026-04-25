const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const CACHE_KEY = "tarang_trans_v1";

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
  };
  return text.replace(/&[a-z#0-9]+;/gi, (match) => entities[match] || match);
}

function loadCache(): Record<string, Record<string, string>> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, Record<string, string>>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

async function translateOne(text: string, lang: string): Promise<string> {
  if (!text.trim()) return text;
  try {
    const res = await fetch(
      `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${lang}`
    );
    const data = await res.json();
    if (
      data.responseStatus === 200 &&
      data.responseData?.translatedText &&
      data.responseData.translatedText !== "QUERY LENGTH LIMIT EXCEDEED"
    ) {
      return decodeHtmlEntities(data.responseData.translatedText);
    }
  } catch {}
  return text;
}

export async function translateStrings(
  strings: Record<string, string>,
  lang: string
): Promise<Record<string, string>> {
  const cache = loadCache();
  if (cache[lang]) return cache[lang];

  const entries = Object.entries(strings);
  const result: Record<string, string> = {};

  // Process in parallel batches of 10 to avoid overwhelming the API
  const BATCH_SIZE = 10;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const translated = await Promise.all(
      batch.map(([key, val]) =>
        translateOne(val, lang).then((t) => ({ key, val: t }))
      )
    );
    translated.forEach(({ key, val }) => {
      result[key] = val;
    });
  }

  cache[lang] = result;
  saveCache(cache);
  return result;
}

export function clearTranslationCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

export const supportedLanguages = [
  { code: "en", name: "English", native: "EN" },
  { code: "hi", name: "Hindi", native: "हिं" },
  { code: "mr", name: "Marathi", native: "मर" },
  { code: "gu", name: "Gujarati", native: "ગુ" },
  { code: "ta", name: "Tamil", native: "தமி" },
  { code: "te", name: "Telugu", native: "తె" },
  { code: "kn", name: "Kannada", native: "ಕ" },
  { code: "ml", name: "Malayalam", native: "മ" },
  { code: "bn", name: "Bengali", native: "বাং" },
  { code: "pa", name: "Punjabi", native: "ਪੰ" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "ar", name: "Arabic", native: "عر" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本" },
  { code: "ko", name: "Korean", native: "한국" },
  { code: "es", name: "Spanish", native: "ES" },
  { code: "fr", name: "French", native: "FR" },
  { code: "de", name: "German", native: "DE" },
  { code: "pt", name: "Portuguese", native: "PT" },
  { code: "ru", name: "Russian", native: "RU" },
  { code: "it", name: "Italian", native: "IT" },
  { code: "tr", name: "Turkish", native: "TR" },
  { code: "th", name: "Thai", native: "ไท" },
  { code: "vi", name: "Vietnamese", native: "VI" },
  { code: "id", name: "Indonesian", native: "ID" },
  { code: "ms", name: "Malay", native: "MY" },
];
