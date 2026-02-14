import { createContext, useState } from "react";

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
}>({
  undercoverConfig: {
    undercoverCount: 0,
    themes: [],
    scoring: true,
    time: 0
  },
  setUndercoverConfig: () => {},
});

export const GamesProvider = ({ children }: { children: React.ReactNode }) => {
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
  const [undercoverScore, setUndercoverScore] = useState<{
    player: number;
    score: number;
  }[]>([])
  return (
    <GamesContext value={{ undercoverConfig, setUndercoverConfig }}>
      {children}
    </GamesContext>
  );
};
