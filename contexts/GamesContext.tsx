import { createContext, useState } from "react";

export const GamesContext = createContext<{
  undercoverConfig: {
    undercoverCount: number;
    themes: number[];
  };
  setUndercoverConfig: (undercoverConfig: {
    undercoverCount: number;
    themes: number[];
  }) => void;
}>({
  undercoverConfig: {
    undercoverCount: 0,
    themes: [],
  },
  setUndercoverConfig: () => {},
});

export const GamesProvider = ({ children }: { children: React.ReactNode }) => {
  const [undercoverConfig, setUndercoverConfig] = useState<{
    undercoverCount: number;
    themes: number[];
  }>({
    undercoverCount: 0,
    themes: [],
  });
  return (
    <GamesContext value={{ undercoverConfig, setUndercoverConfig }}>
      {children}
    </GamesContext>
  );
};
