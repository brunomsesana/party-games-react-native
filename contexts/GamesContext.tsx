import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";

export const GamesContext = createContext<{
  undercoverConfig: {
    undercoverCount: number;
    themes: number[];
    scoring: boolean;
    time: number;
  };
  setUndercoverConfig: (undercoverConfig: {
    undercoverCount: number;
    themes: number[];
    scoring: boolean;
    time: number;
  }) => void;
  sleepingCityConfig: {
    roles: number[],
    time: number;
    scoring: boolean;
  },
  setSleepingCityConfig: (sleepingCityConfig: {
    roles: number[],
    time: number;
    scoring: boolean;
  }) => void;
}>({
  undercoverConfig: {
    undercoverCount: 0,
    themes: [],
    scoring: true,
    time: 0
  },
  setUndercoverConfig: () => {},
  sleepingCityConfig: {
    roles: [],
    time: 0,
    scoring: true
  },
  setSleepingCityConfig: () => {}
});

export const GamesProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [undercoverConfig, setUndercoverConfig] = useState<{
    undercoverCount: number;
    themes: number[];
    scoring: boolean;
    time: number;
  }>({
    undercoverCount: 0,
    themes: [],
    scoring: true,
    time: 0
  });
  const [sleepingCityConfig, setSleepingCityConfig] = useState<
    {
      roles: number[],
      time: number;
      scoring: boolean;
    }
  >({
    roles: Object.keys(t("sleepingCityRoles", { returnObjects: true })).map((_, i) => i == 0 ? 1 : 0),
    time: 0,
    scoring: true
  })
  return (
    <GamesContext value={{ undercoverConfig, setUndercoverConfig, sleepingCityConfig, setSleepingCityConfig }}>
      {children}
    </GamesContext>
  );
};
