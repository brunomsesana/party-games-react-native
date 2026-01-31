import RevealCard from "@/components/RevealCard";
import RevealCard2 from "@/components/RevealCard2";
import TextP from "@/components/TextP";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { Redirect } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function UndercoverPlay() {
  const { undercoverConfig } = useContext(GamesContext);
  const { players } = useContext(PlayerContext);
  const [turn, setTurn] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);
  const [themeName, setThemeName] = useState<string>("");
  const [voting, setVoting] = useState(false);
  const [votes, setVotes] = useState<Record<number, number>>([]);
  const [confirmPanel, setConfirmPanel] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const [finishedVoting, setFinishedVoting] = useState(false);
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
    setThemeName(themeName);
    const themeWords = allWords[themeName];

    const randomWord =
      themeWords[Math.floor(Math.random() * themeWords.length)];

    return {
      undercoverPlayers: selectedUndercovers,
      word: randomWord,
    };
  }, []);

  function handleNext() {
    setPressed(true);
    if (turn != players.length - 1) {
      setTimeout(() => {
        setTurn(turn + 1);
      }, 400);
    } else {
      setGameRunning(false);
      setTurn(0);
    }
  }

  function handleVote() {
    let tempVotes = votes;
    tempVotes[selectedPlayer]++;
    setVotes(tempVotes);
    setConfirmPanel(false);
    setSelectedPlayer(0);
    if (turn != players.length - 1) {
      setTurn(turn + 1);
    } else {
      setFinishedVoting(true);
    }
  }
  useEffect(() => {
    let tempVotes = votes;
    players.forEach((_, i) => {
      tempVotes[i] = 0;
    });
    setVotes(tempVotes);
  }, []);

  return !(
    undercoverConfig.themes.length == 0 || undercoverConfig.undercoverCount == 0
  ) ? (
    <>
      {gameRunning ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RevealCard
            players={players}
            turn={turn}
            pressed={pressed}
            setPressed={setPressed}
            theme={themeName}
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
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <TextP style={{ textAlign: "center" }}>{t("nextPlayer")}</TextP>
            </TouchableOpacity>
          </RevealCard>
        </GestureHandlerRootView>
      ) : voting ? (
        finishedVoting ? (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RevealCard2>
              <TextP style={{ fontSize: 30 }}>
                {gameData?.undercoverPlayers.join(", ")}!
              </TextP>
              <TextP>{t("votingResults")}:</TextP>
              {players.map((x, i) => (
                <TextP>
                  {x} : {votes[i]}
                </TextP>
              ))}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigate("/games/undercover");
                }}
              >
                <TextP style={{ textAlign: "center" }}>{t("backToMenu")}</TextP>
              </TouchableOpacity>
            </RevealCard2>
          </GestureHandlerRootView>
        ) : (
          <>
            {confirmPanel && (
              <View style={styles.bg}>
                <View style={styles.panel}>
                  <TextP style={{ fontSize: 25, textAlign: "center" }}>
                    Tem certeza que deseja votar em: {players[selectedPlayer]}?
                  </TextP>
                  <View style={{ flexDirection: "row", width: "90%" }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setConfirmPanel(false)}
                    >
                      <TextP style={{ textAlign: "center" }}>Cancelar</TextP>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: "#341272", borderColor: "black" },
                      ]}
                      onPress={handleVote}
                    >
                      <TextP style={{ textAlign: "center", color: "white" }}>
                        Confirmar
                      </TextP>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.container}>
              <TextP style={{ fontSize: 30, color: "white" }}>
                {players[turn]}
              </TextP>
              <TextP style={{ color: "white" }}>É sua vez de votar...</TextP>
              <TextP style={{ color: "white", marginBottom: 20 }}>
                Quem você acha que está infiltrado?
              </TextP>
              {players.map(
                (x, i) =>
                  i != turn && (
                    <TouchableOpacity
                      style={styles.button}
                      key={i}
                      onPress={() => {
                        setConfirmPanel(true);
                        setSelectedPlayer(i);
                      }}
                    >
                      <TextP style={{ textAlign: "center" }}>{x}</TextP>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </>
        )
      ) : (
        <View style={styles.container}>
          <TextP style={{ fontSize: 30, margin: 20, color: "white" }}>
            {t("gameFinished")}
          </TextP>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setVoting(true);
            }}
          >
            <TextP style={{ textAlign: "center" }}>{t("vote")}</TextP>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate("/games/undercover")}
          >
            <TextP style={{ textAlign: "center" }}>{t("backToMenu")}</TextP>
          </TouchableOpacity>
        </View>
      )}
    </>
  ) : (
    <Redirect href={"/games/undercover"}></Redirect>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8f6fe0",
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
  panel: {
    flex: 1,
    position: "absolute",
    zIndex: 2,
    backgroundColor: "#c0d9e3",
    top: "35%",
    bottom: "35%",
    left: "10%",
    right: "10%",
    padding: 30,
    borderRadius: 15,
    justifyContent: "center",
  },
  bg: {
    flex: 1,
    backgroundColor: "#00000080",
    zIndex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
