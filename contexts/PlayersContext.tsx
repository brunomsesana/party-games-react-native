import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import Purchases from 'react-native-purchases';

const STORAGE_KEY = "@party_games:players";

export const PlayerContext = createContext<{
  players: {name: string, undercoverScore: number, sleepingCityScore: number, classifiedScore: number}[];
  updatePlayers: (newPlayers: {name: string, undercoverScore: number, sleepingCityScore: number, classifiedScore: number}[]) => void;
  loading: boolean;
  isAdFree: boolean;
  setIsAdFree: (isAdFree: boolean) => void;
}>({
  players: [],
  updatePlayers: () => {},
  loading: true,
  isAdFree: false,
  setIsAdFree: () => {}
});

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<{name: string, undercoverScore: number, sleepingCityScore: number, classifiedScore: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdFree, setIsAdFree] = useState(false);

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
    const checkStatus = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
    
        if(typeof customerInfo.entitlements.active['Party Games Pro'] !== "undefined") {
          setIsAdFree(true);
        }
      
      } catch (e) {
        // Error fetching customer info
      }
    }
    checkStatus();
  }, []);

  const updatePlayers = async (newPlayers: {name: string, undercoverScore: number, sleepingCityScore: number, classifiedScore: number}[]) => {
    setPlayers(newPlayers);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayers));
  };

  return (
    <PlayerContext.Provider value={{ players, updatePlayers, loading, isAdFree, setIsAdFree }}>
      {children}
    </PlayerContext.Provider>
  );
};
