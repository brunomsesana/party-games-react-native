import BackButton from "@/components/BackButton";
import TextP from "@/components/TextP";
import ThemeSelector from "@/components/ThemeSelector";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

export default function Undercover() {
  const { undercoverConfig, setUndercoverConfig } = useContext(GamesContext);
  const { players, updatePlayers, isAdFree } = useContext(PlayerContext);
  const { t } = useTranslation();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const themes = Object.keys(t("undercoverWords", { returnObjects: true }));
  const [rulesOpen, setRulesOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const bannerRef = useRef<BannerAd>(null);
  const router = useRouter();
  useForeground(() => {
    if (!isAdFree && bannerRef.current) {
      bannerRef.current.load();
    }
  });

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
            {undercoverConfig.scoring && (
              <View
                style={{
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                {players.map((x, i) => (
                  <TextP style={{ textAlign: "center" }} key={i}>
                    {x.name}: {x.undercoverScore}
                  </TextP>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    let playersTemp = players.map((x) => ({
                      ...x,
                      undercoverScore: 0,
                    }));
                    updatePlayers(playersTemp);
                  }}
                  style={[styles.button, { marginTop: 15 }]}
                >
                  <TextP style={{ textAlign: "center" }}>
                    {t("resetScore")}
                  </TextP>
                </TouchableOpacity>
              </View>
            )}
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
        <View style={{ marginBottom: 70, alignItems: "center" }}>
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
              justifyContent: "center",
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
              router.push("/playersConfig");
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("configurePlayers")}
            </TextP>
          </TouchableOpacity>
          {/* <TouchableOpacity
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
                time:
                  undercoverConfig.time >= 60 ? 0 : (undercoverConfig.time +
                  5),
              });
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("time")}: {undercoverConfig.time == 0 ? t("disabled") : undercoverConfig.time + " " + t("seconds")}
            </TextP>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => {
              setUndercoverConfig({
                ...undercoverConfig,
                scoring: !undercoverConfig.scoring,
              });
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("scoreEnabled")}:{" "}
              {undercoverConfig.scoring ? t("yes") : t("no")}
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
              onPress={() => router.push("/games/undercover/play")}
            >
              <TextP style={{ textAlign: "center", color: "white" }}>
                {t("play")}
              </TextP>
            </TouchableOpacity>
            <BackButton back="/games" tryBack={false}></BackButton>
          </View>
        </View>
      </View>
      {!isAdFree && (
        <BannerAd
          ref={bannerRef}
          unitId={
            __DEV__
              ? TestIds.ADAPTIVE_BANNER
              : "ca-app-pub-3794910185024045/6360357076"
          }
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8f6fe0",
    flex: 1,
    justifyContent: "center",
  },
  main: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
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
    margin: 5,
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
