import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUs from "./en-US.json";
import ptBr from "./pt-BR.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "en-US",
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
