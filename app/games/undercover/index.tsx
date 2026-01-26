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

  useEffect(() => {
    console.log(undercoverConfig.themes);
  }, [undercoverConfig]);

  return (
    <View style={styles.container}>
      {selectorOpen && (
        <ThemeSelector setOpen={setSelectorOpen}></ThemeSelector>
      )}
      <View style={{ marginTop: 150, marginBottom: 70 }}>
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
          }}
        >
          {t("undercoverDescription")}
        </TextP>
      </View>
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigate("/playersConfig");
          }}
        >
          <TextP style={{ textAlign: "center" }}>{t("configurePlayers")}</TextP>
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
          <BackButton back="/games"></BackButton>
        </View>
      </View>
    </View>
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
});
