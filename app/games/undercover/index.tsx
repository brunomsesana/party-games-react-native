import BackButton from "@/components/BackButton";
import TextP from "@/components/TextP";
import ThemeSelector from "@/components/ThemeSelector";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useNavigation } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Undercover() {
  const navigation = useNavigation();
  const { undercoverConfig, setUndercoverConfig } = useContext(GamesContext);
  const { players } = useContext(PlayerContext);
  const { t } = useTranslation();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const themes = Object.keys(t("undercoverWords", { returnObjects: true }));
  const [rulesOpen, setRulesOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  useEffect(() => {
    if (players.length >= 3) {
      if (
        undercoverConfig.undercoverCount == 0 ||
        players.length < 6 ||
        (undercoverConfig.undercoverCount > 2 && players.length < 8) ||
        (undercoverConfig.undercoverCount > 3 && players.length < 12) ||
        undercoverConfig.undercoverCount < players.length - 7
      ) {
        setUndercoverConfig({ ...undercoverConfig, undercoverCount: 1 });
      }
    } else {
      setUndercoverConfig({ ...undercoverConfig, undercoverCount: 0 });
    }
  }, [players]);

  return (
    <>
      {rulesOpen && (
        <View style={styles.bg}>
          <View style={styles.panel}>
            <View>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  padding: 10,
                  position: "absolute",
                  right: -10,
                  top: -15,
                  zIndex: 3,
                }}
                onPress={() => setRulesOpen(false)}
              >
                <TextP>X</TextP>
              </TouchableOpacity>
              <TextP
                style={{ fontSize: 30, textAlign: "center", marginBottom: 20 }}
              >
                {t("rules")}:
              </TextP>
            </View>
            <TextP
              style={{
                textAlign: "center",
              }}
            >
              <TextP style={{ fontWeight: "bold" }}>
                {t("commonPlayers")}:{" "}
              </TextP>
              {t("undercoverCommonRules")}
            </TextP>
            <TextP
              style={{
                textAlign: "center",
              }}
            >
              <TextP style={{ fontWeight: "bold" }}>{t("undercover")}: </TextP>
              {t("undercoverRules")}
            </TextP>
          </View>
        </View>
      )}
      {scoreOpen && (
        <View style={styles.bg}>
          <View style={styles.panel}>
            <View>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  padding: 10,
                  position: "absolute",
                  right: -10,
                  top: -15,
                  zIndex: 3,
                }}
                onPress={() => setScoreOpen(false)}
              >
                <TextP>X</TextP>
              </TouchableOpacity>
              <TextP
                style={{ fontSize: 30, textAlign: "center", marginBottom: 20 }}
              >
                {t("score")}:
              </TextP>
            </View>
            <TextP
              style={{
                textAlign: "center",
              }}
            >
              <TextP style={{ fontWeight: "bold" }}>{t("rightVote")}: </TextP>
              +1 {t("point") + " " + t("forYou")}
            </TextP>
            <TextP
              style={{
                textAlign: "center",
              }}
            >
              <TextP style={{ fontWeight: "bold" }}>
                {t("undercoverMostVoted")}:{" "}
              </TextP>
              -1 {t("point") + " " + t("forUndercover")}
            </TextP>
            <TextP
              style={{
                textAlign: "center",
              }}
            >
              <TextP style={{ fontWeight: "bold" }}>
                {t("undercoverRightGuess")}:{" "}
              </TextP>
              +2 {t("points") + " " + t("forUndercover")}
            </TextP>
            <TextP
              style={{
                textAlign: "center",
              }}
            >
              <TextP style={{ fontWeight: "bold" }}>
                {t("revealedSecret")}:{" "}
              </TextP>
              -1{" "}
              {t("point") +
                " " +
                t("forYou") +
                " " +
                t("and") +
                " +1 " +
                t("point") +
                " " +
                t("forUndercover")}
            </TextP>
          </View>
        </View>
      )}
      <View style={styles.container}>
        {selectorOpen && (
          <ThemeSelector setOpen={setSelectorOpen}></ThemeSelector>
        )}
        <View
          style={{ marginTop: 150, marginBottom: 70, alignItems: "center" }}
        >
          <TextP
            style={{
              fontSize: 30,
              color: "white",
              textAlign: "center",
            }}
          >
            {t("undercover")}
          </TextP>
          <TextP
            style={{
              color: "white",
              textAlign: "center",
              width: "80%",
            }}
          >
            {t("undercoverDescription")}
          </TextP>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "45%",
            }}
          >
            <TouchableOpacity
              style={styles.miniBtn}
              onPress={() => setRulesOpen(true)}
            >
              <TextP style={{ color: "white", textAlign: "center" }}>
                {t("rules")}
              </TextP>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtn}
              onPress={() => setScoreOpen(true)}
            >
              <TextP style={{ color: "white", textAlign: "center" }}>
                {t("score")}
              </TextP>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.main}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigate("/playersConfig");
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("configurePlayers")}
            </TextP>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              players.length < 3 &&
                ({
                  backgroundColor: "#a1a1a1",
                  borderColor: "black",
                  cursor: "not-allowed",
                  opacity: 0.5,
                } as any),
            ]}
            disabled={players.length < 3}
            onPress={() => {
              setUndercoverConfig({
                ...undercoverConfig,
                undercoverCount:
                  (undercoverConfig.undercoverCount %
                    (players.length >= 6
                      ? players.length >= 8
                        ? players.length >= 12
                          ? players.length - 7
                          : 3
                        : 2
                      : 1)) +
                  1,
              });
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("undercoverCount")}: {undercoverConfig.undercoverCount}
            </TextP>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectorOpen(true);
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {undercoverConfig.themes.length > 0
                ? t("themes") +
                  ": " +
                  undercoverConfig.themes.map((x) => themes[x]).join(", ")
                : t("selectThemes")}
            </TextP>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              marginTop: "7%",
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "#341272",
                  borderColor: "black",
                  opacity:
                    undercoverConfig.themes.length <= 0 ||
                    undercoverConfig.undercoverCount <= 0
                      ? 0.5
                      : 1,
                },
              ]}
              disabled={
                undercoverConfig.themes.length <= 0 ||
                undercoverConfig.undercoverCount <= 0
              }
              onPress={() => navigate("/games/undercover/play")}
            >
              <TextP style={{ textAlign: "center", color: "white" }}>
                {t("play")}
              </TextP>
            </TouchableOpacity>
            <BackButton back="/games" tryBack={false}></BackButton>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8f6fe0",
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "flex-start",
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
    marginBottom: 10,
  },
  miniBtn: {
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#341272",
    borderRadius: 8,
  },
  bg: {
    zIndex: 1,
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000080",
  },
  panel: {
    backgroundColor: "#c0d9e3",
    width: "80%",
    padding: 30,
    borderRadius: 15,
  },
});
