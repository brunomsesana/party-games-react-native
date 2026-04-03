import RevealCard3 from "@/components/RevealCard3";
import TextP from "@/components/TextP";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SleepingCityPlay() {
  const { t } = useTranslation();
  const { sleepingCityConfig } = useContext(GamesContext);
  const { players } = useContext(PlayerContext);
  const [pressed, setPressed] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [targetedPlayers, setTargetedPlayers] = useState<number[]>([]);
  const gameData = useMemo(() => {
    const allRoles = t("sleepingCityRoles", { returnObjects: true }) as {
      role: string;
      desc: string;
      intention: number;
    }[];
    let roleDeck: (number | undefined)[] = [];
    sleepingCityConfig.roles.forEach((quantity, roleIndex) => {
      for (let i = 0; i < quantity; i++) {
        roleDeck.push(roleIndex);
      }
    });

    while (roleDeck.length < players.length) {
      roleDeck.push(undefined);
    }

    for (let i = roleDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roleDeck[i], roleDeck[j]] = [roleDeck[j], roleDeck[i]];
    }

    const playerRoles: Record<number, number | undefined> = {};
    players.forEach((_, index) => {
      playerRoles[index] = roleDeck[index];
    });

    return playerRoles;
  }, []);
  useEffect(() => {
    console.log(selectedPlayers);
  }, [selectedPlayers]);
  function handleNext() {
    setPressed(true);
    if (turn != players.length - 1) {
      setTimeout(() => {
        setTurn(turn + 1);
      }, 400);
    } else {
      setTurn(0);
    }
  }
  function handleKill() {}
  const [turn, setTurn] = useState(0);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RevealCard3
        players={players.map((x) => x.name)}
        pressed={pressed}
        setPressed={setPressed}
        turn={turn}
      >
        <TextP>{t("youAre")}:</TextP>
        <TextP style={{ fontSize: 30, fontWeight: "bold" }}>
          {gameData[turn] != undefined
            ? (
                t("sleepingCityRoles", { returnObjects: true }) as {
                  role: string;
                  desc: string;
                  intention: number;
                }[]
              )[gameData[turn]].role
            : t("civilean")}
        </TextP>
        {gameData[turn] == 0 ? (
          <>
            <TextP>{t("whoToKill")}</TextP>
            {(targetedPlayers.length > 0 ? targetedPlayers : players).map(
              (x, i) =>
                (gameData[i] == undefined
                  ? 1
                  : (
                      t("sleepingCityRoles", { returnObjects: true }) as {
                        role: string;
                        desc: string;
                        intention: number;
                      }[]
                    )[gameData[i]].intention) != 0 && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      selectedPlayers.includes(i)
                        ? {
                            backgroundColor: "lightgreen",
                            borderColor: "green",
                            borderWidth: 3,
                          }
                        : null,
                    ]}
                    onPress={() => {
                      selectedPlayers.includes(i)
                        ? setSelectedPlayers(
                            selectedPlayers.filter((y) => y != i),
                          )
                        : setSelectedPlayers([...selectedPlayers, i]);
                    }}
                    key={i}
                  >
                    <TextP>{typeof x == "number" ? players[x] : x.name}</TextP>
                  </TouchableOpacity>
                ),
            )}
          </>
        ) : (
          gameData[turn] == 1
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (gameData[turn] == 0) {
              handleKill();
            }
            handleNext();
          }}
        >
          <TextP style={{ textAlign: "center" }}>
            {gameData[turn] == 0 ? t("confirm") : t("nextPlayer")}
          </TextP>
        </TouchableOpacity>
      </RevealCard3>
    </GestureHandlerRootView>
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
