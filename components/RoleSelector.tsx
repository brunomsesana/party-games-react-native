import { GamesContext } from "@/contexts/GamesContext";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import TextP from "./TextP";

export default function RoleSelector({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { sleepingCityConfig, setSleepingCityConfig } =
    useContext(GamesContext);
  const { players } = useContext(PlayerContext);
  const [tempSleepingCityConfig, setTempSleepingCityConfig] = useState({
    ...sleepingCityConfig,
  });
  const [noRole, setNoRole] = useState(players.length - 1);

  useEffect(() => {
    let roleCount = 0;
    sleepingCityConfig.roles.forEach((x) => {
      roleCount += x;
    });
    setNoRole(players.length - roleCount);
  }, [players]);

  function handleSave() {
    setSleepingCityConfig(tempSleepingCityConfig);
    setOpen(false);
  }

  return (
    <View style={styles.bg}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", padding: 15 }}
            onPress={() => setOpen(false)}
          >
            <TextP>X</TextP>
          </TouchableOpacity>
          <TextP style={{ fontSize: 30, textAlign: "center" }}>
            {t("roles")}:
          </TextP>
          <TextP style={{ textAlign: "center" }}>
            {t("civileanCount")}: {noRole}
          </TextP>
        </View>
        <ScrollView
          style={{
            marginBottom: 20,
            borderBottomColor: "black",
            borderBottomWidth: 2,
          }}
        >
          {(
            t("sleepingCityRoles", { returnObjects: true }) as {
              role: string;
              intention: string;
              desc: string;
            }[]
          ).map((x, i) => (
            <View
              style={[
                styles.button,
                tempSleepingCityConfig.roles[i] > 0 && {
                  backgroundColor: "lightgreen",
                  borderColor: "green",
                  borderWidth: 2,
                },
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
              key={i}
            >
              <TouchableOpacity
                style={[styles.button, { marginBottom: 0 }]}
                onPress={() => {
                  if (tempSleepingCityConfig.roles[i] > (i == 0 ? 1 : 0)) {
                    setTempSleepingCityConfig({
                      ...tempSleepingCityConfig,
                      roles: tempSleepingCityConfig.roles.map((y, j) =>
                        i === j ? y - 1 : y,
                      ),
                    });
                    setNoRole((prev) => prev + 1);
                  }
                }}
              >
                <TextP>-</TextP>
              </TouchableOpacity>
              <TextP style={{ textAlign: "center", width: "70%" }}>
                {t("roleCount", { role: x.role })}:{" "}
                {tempSleepingCityConfig.roles[i]}
              </TextP>
              <TouchableOpacity
                style={[styles.button, { marginBottom: 0 }]}
                onPress={() => {
                  if (i == 0 ? noRole > 2 : noRole > 0) {
                    setTempSleepingCityConfig({
                      ...tempSleepingCityConfig,
                      roles: tempSleepingCityConfig.roles.map((y, j) =>
                        i === j ? y + 1 : y,
                      ),
                    });
                    setNoRole((prev) => prev - 1);
                  }
                }}
              >
                <TextP>+</TextP>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "#341272", borderColor: "black" },
          ]}
          onPress={handleSave}
        >
          <TextP style={{ textAlign: "center", color: "white" }}>
            {t("save")}
          </TextP>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    zIndex: 2,
    backgroundColor: "#c0d9e3",
    top: "10%",
    bottom: "10%",
    left: "10%",
    right: "10%",
    padding: 30,
    borderRadius: 15,
    justifyContent: "space-between",
  },
  button: {
    textAlign: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: 1,
    marginBottom: 10,
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
