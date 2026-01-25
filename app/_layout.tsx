import { PlayerProvider } from "@/contexts/PlayersContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PlayerProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="play"
          options={{
            headerShown: false,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="configPlayers"
          options={{
            headerShown: false,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="games/infiltrado"
          options={{
            headerShown: false,
          }}
        ></Stack.Screen>
      </Stack>
    </PlayerProvider>
  );
}
