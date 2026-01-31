import { GamesContext } from "@/contexts/GamesContext";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import TextP from "./TextP";

export default function ThemeSelector({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { undercoverConfig, setUndercoverConfig } = useContext(GamesContext);
  const [tempUndercoverConfig, setTempUndercoverConfig] = useState({
    ...undercoverConfig,
  });

  function handleSave() {
    setUndercoverConfig(tempUndercoverConfig);
    setOpen(false);
  }

  return (
    <View style={styles.bg}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => setOpen(false)}
          >
            <TextP>X</TextP>
          </TouchableOpacity>
          <TextP style={{ fontSize: 30, textAlign: "center" }}>
            {t("themes")}:
          </TextP>
        </View>
        <View>
          {Object.keys(t("undercoverWords", { returnObjects: true })).map(
            (x, i) => (
              <TouchableOpacity
                style={[
                  styles.button,
                  tempUndercoverConfig.themes.includes(i) && {
                    backgroundColor: "lightgreen",
                    borderColor: "green",
                    borderWidth: 2,
                  },
                ]}
                key={i}
                onPress={() => {
                  let tempConfig = { ...tempUndercoverConfig };
                  if (tempUndercoverConfig.themes.includes(i)) {
                    tempConfig.themes.splice(
                      tempConfig.themes.findIndex((y) => y == i),
                      1,
                    );
                  } else {
                    tempConfig.themes.push(i);
                  }
                  setTempUndercoverConfig(tempConfig);
                }}
              >
                <TextP style={{ textAlign: "center" }}>{x}</TextP>
              </TouchableOpacity>
            ),
          )}
        </View>
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
    width: "100%",
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
