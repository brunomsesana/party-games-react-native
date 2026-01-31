import * as Localization from "expo-localization"; // Mudança aqui
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import enUs from "./en-US.json";
import ptBr from "./pt-BR.json";

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback) => {
    // O Expo Localization retorna um array de locales
    const locales = Localization.getLocales();

    // Pega a tag (ex: 'pt-BR' ou 'en-US') do primeiro item
    const bestLanguage = locales[0]?.languageTag || "en-US";

    callback(bestLanguage);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    fallbackLng: "en-US",
    resources: {
      "en-US": { translation: enUs },
      "pt-BR": { translation: ptBr },
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
