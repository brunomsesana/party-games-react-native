import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = "@party_games:players";

export const PlayerContext = createContext<{
  players: string[];
  updatePlayers: (newPlayers: string[]) => void;
  loading: boolean;
}>({
  players: [],
  updatePlayers: () => {},
  loading: true,
});

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setPlayers(JSON.parse(saved));
      } catch (e) {
        console.error("Error while loading player list: ", e);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  const updatePlayers = async (newPlayers: string[]) => {
    setPlayers(newPlayers);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayers));
  };

  return (
    <PlayerContext.Provider value={{ players, updatePlayers, loading }}>
      {children}
    </PlayerContext.Provider>
  );
};
