import "@/assets/utils/i18n";
import { GamesProvider } from "@/contexts/GamesContext";
import { PlayerProvider } from "@/contexts/PlayersContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import mobileAds from 'react-native-google-mobile-ads';

export default function RootLayout() {
  useEffect(() => {
    mobileAds()
    .initialize()
    .then(adapterStatuses => {
      // Initialization complete!
    });
  }, [])
  return (
    <PlayerProvider>
      <GamesProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="games/index"
            options={{
              headerShown: false,
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="playersConfig"
            options={{
              headerShown: false,
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="games/undercover/index"
            options={{
              headerShown: false,
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="games/undercover/play"
            options={{
              headerShown: false,
            }}
          ></Stack.Screen>
        </Stack>
      </GamesProvider>
    </PlayerProvider>
  );
}
