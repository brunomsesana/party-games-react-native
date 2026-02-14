import RevealCard from "@/components/RevealCard";
import RevealCard2 from "@/components/RevealCard2";
import TextP from "@/components/TextP";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { Redirect, useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from "react-native-google-mobile-ads";

const adInstance = InterstitialAd.createForAdRequest(__DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-3794910185024045/2281511260");

export default function UndercoverPlay() {
  const { undercoverConfig } = useContext(GamesContext);
  const { players, updatePlayers, isAdFree } = useContext(PlayerContext);
  const [turn, setTurn] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);
  const [themeName, setThemeName] = useState<string>("");
  const [voting, setVoting] = useState(false);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [confirmPanel, setConfirmPanel] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const [finishedVoting, setFinishedVoting] = useState(false);
  const [revealed, setRevelead] = useState(false);
  const { t } = useTranslation();
  const bannerRef = useRef<BannerAd>(null);
  const [adReady, setAdReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAdFree) return;
    const unsubscribeLoaded = adInstance.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAdReady(true);
      }
    );

    const unsubscribeClosed = adInstance.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setAdReady(false);
        if (!isAdFree) {
          adInstance.load();
        }
      }
    );

    adInstance.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [isAdFree]);

  const isConfigInvalid =
    !undercoverConfig.themes ||
    undercoverConfig.themes.length === 0 ||
    undercoverConfig.undercoverCount === 0;
  const gameData = useMemo(() => {
    if (isConfigInvalid) {
      return null;
    }
    let selectedUndercovers: number[] = [];
    let playersPool = [...players];

    for (let i = 0; i < undercoverConfig.undercoverCount; i++) {
      const randomIndex = Math.floor(Math.random() * players.length);
      if (playersPool[randomIndex].name == ""){
        i--;
        continue;
      }
      playersPool[randomIndex] = { name: "", undercoverScore: 0, sleepingCityScore: 0, classifiedScore: 0 };
      selectedUndercovers.push(randomIndex);
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
    setVotes(prevVotes => ({
      ...prevVotes,
      [selectedPlayer]: (prevVotes[selectedPlayer] || 0) + 1
    }));
    let playersTemp = [...players];
    if (gameData?.undercoverPlayers.includes(selectedPlayer)) {
      playersTemp[turn].undercoverScore++;
    }
    updatePlayers(playersTemp)
    setConfirmPanel(false);
    setSelectedPlayer(0);
    if (turn != players.length - 1) {
      setTurn(turn + 1);
    } else {
      setFinishedVoting(true);
    }
  }
  function handleEndGame(guessed: boolean, whoRevealed?: number) {
    let playersTemp = [...players];

    const voteValues = Object.values(votes);
    const maxVotes = voteValues.length > 0 ? Math.max(...voteValues) : 0;

    const mostVotedIndices = Object.keys(votes)
      .filter(key => votes[Number(key)] === maxVotes)
      .map(Number);

    const isTieWithCivilian = mostVotedIndices.some(
      index => !gameData?.undercoverPlayers.includes(index)
    );

    playersTemp.map((x, i) => {
      if (gameData?.undercoverPlayers.includes(i)) {
        if (votes[i] === maxVotes) {
          if (!isTieWithCivilian) {
            x.undercoverScore--;
          }
        }

        if (guessed) {
          x.undercoverScore += 2;
        }
        if (revealed) {
          x.undercoverScore++;
        }
      } else {
        if (revealed && whoRevealed == i) {
          x.undercoverScore--;
        }
      }
    })

    updatePlayers(playersTemp);
    router.push("/games/undercover");
  }

  useEffect(() => {
    let tempVotes = votes;
    players.forEach((_, i) => {
      tempVotes[i] = 0;
    });
    setVotes(tempVotes);
  }, []);

  useEffect(() => {
    // Mostra o anúncio apenas quando o jogo parar
    if (!gameRunning && adReady) {
      adInstance.show().catch(e => console.log("Ad not ready"));
    }
  }, [gameRunning]);

  return !(
    undercoverConfig.themes.length == 0 || undercoverConfig.undercoverCount == 0
  ) ? (
    <>
      {gameRunning ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RevealCard
            players={players.map(x => x.name)}
            turn={turn}
            pressed={pressed}
            setPressed={setPressed}
            theme={themeName}
            innerStyle={gameData?.undercoverPlayers.includes(turn) ? { backgroundColor: "darkred" } : undefined}
          >
            {gameData?.undercoverPlayers.includes(turn) ? (
              <>
                <TextP style={{ color: "lightgrey" }}>
                  {t("undercoverAlert") + ": "}
                </TextP>
                <TextP
                  style={{ color: "white", fontWeight: "bold", fontSize: 30 }}
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
            <RevealCard2 text={undercoverConfig.undercoverCount > 1 ? t("undercoverAre") : t("undercoverIs") + "..."}>
              <View style={{ alignItems: "center", justifyContent: "center", marginTop: 150 }}>
                <TextP style={{ fontSize: 30 }}>
                  {gameData?.undercoverPlayers.map(x => players[x].name).join(", ")}!
                </TextP>
                {undercoverConfig.scoring &&
                  <>
                    <TextP>{t("votingResults")}:</TextP>
                    {players.map((x, i) => (
                      <TextP key={i}>
                        {x.name} : {votes[i]}
                      </TextP>
                    ))}
                  </>
                }
              </View>
              {!revealed ?
                undercoverConfig.scoring ? <View style={{ alignItems: "center", justifyContent: "center", marginTop: "5%" }}>
                  <TextP style={{ fontSize: 20, textAlign: "center" }}>{undercoverConfig.undercoverCount <= 1 ? t("timeToOneGuess") : t("timeToGuess")}</TextP>
                  <TextP style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>{undercoverConfig.undercoverCount <= 1 ? t("didOneGuess") : t("didGuess")}</TextP>
                  <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleEndGame(false) }}><TextP style={{ textAlign: "center" }}>{t("no")}</TextP></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { handleEndGame(true) }}><TextP style={{ textAlign: "center" }}>{t("yes")}</TextP></TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.button} onPress={() => { setRevelead(true) }}><TextP style={{ textAlign: "center" }}>{t("revealed")}</TextP></TouchableOpacity>
                </View> :
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      router.push("/games/undercover");
                    }}
                  >
                    <TextP style={{ textAlign: "center" }}>{t("backToMenu")}</TextP>
                  </TouchableOpacity> : <View style={{ alignItems: "center", justifyContent: "center", marginTop: "5%" }}>
                  <TextP style={{ fontSize: 20, textAlign: "center" }}>{t("whoRevealed")}</TextP>
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {players.map((x, i) =>
                      !gameData?.undercoverPlayers.includes(i) && <TouchableOpacity key={i} style={[styles.button, { width: "auto" }]} onPress={() => { handleEndGame(false, i) }}><TextP style={{ textAlign: "center" }}>{x.name}</TextP></TouchableOpacity>)}
                  </View>
                </View>}
            </RevealCard2>
          </GestureHandlerRootView>
        ) : (
          <>
            {confirmPanel && (
              <View style={styles.bg}>
                <View style={styles.panel}>
                  <TextP style={{ fontSize: 25, textAlign: "center" }}>
                    {t("sureVote")}: {players[selectedPlayer].name}?
                  </TextP>
                  <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setConfirmPanel(false)}
                    >
                      <TextP style={{ textAlign: "center" }}>{t("cancel")}</TextP>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: "#341272", borderColor: "black" },
                      ]}
                      onPress={handleVote}
                    >
                      <TextP style={{ textAlign: "center", color: "white" }}>
                        {t("confirm")}
                      </TextP>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.container}>
              <TextP style={{ fontSize: 30, color: "white" }}>
                {players[turn].name}
              </TextP>
              <TextP style={{ color: "white" }}>{t("turnToVote")}...</TextP>
              <TextP style={{ color: "white", marginBottom: 20 }}>
                {t("whoVote")}?
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
                      <TextP style={{ textAlign: "center" }}>{x.name}</TextP>
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
          {undercoverConfig.scoring ? <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setVoting(true);
            }}
          >
            <TextP style={{ textAlign: "center" }}> {t("vote")}</TextP>
          </TouchableOpacity> :
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setVoting(true);
                setFinishedVoting(true);
              }}
            >
              <TextP style={{ textAlign: "center" }}>{t("revealUndercover")}</TextP>
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/games/undercover")}
          >
            <TextP style={{ textAlign: "center" }}>{t("backToMenu")}</TextP>
          </TouchableOpacity>
        </View>
      )}
      {!isAdFree &&
        <BannerAd ref={bannerRef} unitId={__DEV__ ? TestIds.ADAPTIVE_BANNER : "ca-app-pub-3794910185024045/2421112062"} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />}
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
    width: "45%",
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
