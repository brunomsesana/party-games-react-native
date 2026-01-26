import RevealCard from "@/components/RevealCard";
import TextP from "@/components/TextP";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { Redirect } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function UndercoverPlay() {
  const { undercoverConfig } = useContext(GamesContext);
  const { players } = useContext(PlayerContext);
  const [turn, setTurn] = useState(0);
  const [pressed, setPressed] = useState(false);
  const { t } = useTranslation();
  const isConfigInvalid =
    !undercoverConfig.themes ||
    undercoverConfig.themes.length === 0 ||
    undercoverConfig.undercoverCount === 0;
  const gameData = useMemo(() => {
    if (isConfigInvalid) {
      return null;
    }
    let selectedUndercovers: string[] = [];
    let playersPool = [...players];

    for (let i = 0; i < undercoverConfig.undercoverCount; i++) {
      const randomIndex = Math.floor(Math.random() * playersPool.length);
      const [removed] = playersPool.splice(randomIndex, 1);
      selectedUndercovers.push(removed);
    }

    const allWords = t("undercoverWords", { returnObjects: true }) as Record<
      string,
      any
    >;
    const allThemesNames = Object.keys(allWords);

    const selectedThemeIndex =
      undercoverConfig.themes[
        Math.floor(Math.random() * undercoverConfig.themes.length)
      ];
    const themeName = allThemesNames[selectedThemeIndex];
    const themeWords = allWords[themeName];

    const randomWord =
      themeWords[Math.floor(Math.random() * themeWords.length)];

    return {
      undercoverPlayers: selectedUndercovers,
      word: randomWord,
    };
  }, []);

  return !(
    undercoverConfig.themes.length == 0 || undercoverConfig.undercoverCount == 0
  ) ? (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RevealCard
          players={players}
          turn={turn}
          pressed={pressed}
          setPressed={setPressed}
        >
          {gameData?.undercoverPlayers.includes(players[turn]) ? (
            <>
              <TextP style={{ color: "red" }}>
                {t("undercoverAlert") + ": "}
              </TextP>
              <TextP
                style={{ color: "darkred", fontWeight: "bold", fontSize: 30 }}
              >
                {gameData.word.tip}
              </TextP>
            </>
          ) : (
            <>
              <TextP>{t("yourWord") + ": "}</TextP>
              <TextP style={{ fontSize: 30 }}>{gameData?.word.word}</TextP>
            </>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPressed(true);
              setTimeout(() => {
                setTurn((turn + 1) % players.length);
              }, 400);
            }}
          >
            <TextP style={{ textAlign: "center" }}>{t("nextPlayer")}</TextP>
          </TouchableOpacity>
        </RevealCard>
      </GestureHandlerRootView>
    </>
  ) : (
    <Redirect href={"/games/undercover"}></Redirect>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c0d9e3",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    textAlign: "center",
    backgroundColor: "white",
    width: "50%",
    padding: 10,
    borderRadius: 10,
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: 1,
    margin: 10,
  },
});
