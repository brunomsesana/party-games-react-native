import BackButton from "@/components/BackButton";
import RoleSelector from "@/components/RoleSelector";
import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import TextP from "../../../components/TextP";

export default function SleepingCity() {
  const [open, setOpen] = useState(false);
  const { sleepingCityConfig } = useContext(GamesContext);
  const { players, updatePlayers } = useContext(PlayerContext);
  const { t } = useTranslation();
  const roles = t("sleepingCityRoles", { returnObjects: true }) as {
    role: string;
    intention: number;
    desc: string;
  }[];
  const router = useRouter();
  const [rolesDescOpen, setRolesDescOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  return (
    <>
      {rolesDescOpen && (
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
                onPress={() => setRolesDescOpen(false)}
              >
                <TextP>X</TextP>
              </TouchableOpacity>
              <TextP
                style={{ fontSize: 30, textAlign: "center", marginBottom: 20 }}
              >
                {t("rolesDesc")}:
              </TextP>
            </View>
            {roles.map((x, i) => (
              <TextP
                style={{
                  textAlign: "center",
                }}
                key={i}
              >
                <TextP style={{ fontWeight: "bold" }}>{x.role}: </TextP>
                {x.desc}
              </TextP>
            ))}
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
            {sleepingCityConfig.scoring && (
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
                    {x.name}: {x.sleepingCityScore}
                  </TextP>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    let playersTemp = players.map((x) => ({
                      ...x,
                      sleepingCityScore: 0,
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
              <TextP style={{ fontWeight: "bold" }}>{t("won")}: </TextP>
              +1 {t("point") + " " + t("forYou")}
            </TextP>
          </View>
        </View>
      )}
      <View style={styles.container}>
        <View style={{ marginBottom: 70, alignItems: "center" }}>
          <TextP
            style={{
              fontSize: 30,
              color: "white",
              textAlign: "center",
            }}
          >
            Cidade Dorme
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
              onPress={() => setRolesDescOpen(true)}
            >
              <TextP style={{ color: "white", textAlign: "center" }}>
                {t("rolesDesc")}
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
            style={[styles.button, players.length < 3 && { opacity: 0.5 }]}
            disabled={players.length < 3}
            onPress={() => {
              setOpen(true);
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {sleepingCityConfig.roles.find((x) => x > 0)
                ? t("roles") +
                  ": " +
                  sleepingCityConfig.roles
                    .map((x, i) => x > 0 && roles[i].role)
                    .filter(Boolean)
                    .join(", ")
                : t("selectRoles")}
            </TextP>
          </TouchableOpacity>
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
                },
              ]}
              onPress={() => router.push("/games/sleepingCity/play")}
            >
              <TextP style={{ textAlign: "center", color: "white" }}>
                {t("play")}
              </TextP>
            </TouchableOpacity>
            <BackButton back="/games" tryBack={false}></BackButton>
          </View>
        </View>
        {open && <RoleSelector setOpen={setOpen}></RoleSelector>}
      </View>
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
  titles: {},
});
