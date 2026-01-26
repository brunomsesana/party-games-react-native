import TrashIcon from "@/assets/vectors/trash.svg";
import BackButton from "@/components/BackButton";
import TextP from "@/components/TextP";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useNavigation } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PlayersConfig() {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { players, updatePlayers } = useContext(PlayerContext);
  const [newPlayer, setNewPlayer] = useState<string>("");
  const { t } = useTranslation();
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);
  const currentOpacity = opacityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  function handleAddPlayer() {
    if (newPlayer && newPlayer.trim().length > 0) {
      updatePlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  }
  function handleRemovePlayer(index: number) {
    let tempPlayers = [...players];
    tempPlayers.splice(index, 1);
    updatePlayers(tempPlayers);
  }
  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: currentOpacity, flex: 1 }}>
        <TextP
          style={{
            fontSize: 30,
            color: "white",
            textAlign: "center",
            top: "10%",
          }}
        >
          {t("players")}:
        </TextP>
        <View style={styles.main}>
          <View style={styles.scrollContainer}>
            {players.length > 0 ? (
              <ScrollView>
                {players.map((x, i) => (
                  <View
                    key={i}
                    style={[
                      styles.itemContainer,
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <TextP>{x}</TextP>
                    <TouchableOpacity onPress={() => handleRemovePlayer(i)}>
                      <TrashIcon width={30} height={30}></TrashIcon>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <TextP style={{ color: "white" }}>{t("noPlayers")}</TextP>
            )}
          </View>
          <View style={[styles.inputContainer, { marginTop: 100 }]}>
            <TextP style={{ fontSize: 11, color: "black" }}>
              {t("newPlayer")}:
            </TextP>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                value={newPlayer}
                onChangeText={setNewPlayer}
                style={styles.input}
              />
              <TouchableOpacity
                style={[styles.button, { width: "auto" }]}
                onPress={handleAddPlayer}
              >
                <TextP>+</TextP>
              </TouchableOpacity>
            </View>
          </View>
          <BackButton back="/"></BackButton>
        </View>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8f6fe0",
  },
  main: {
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
    marginBottom: 10,
  },
  input: {
    textAlign: "center",
    backgroundColor: "white",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: 1,
    marginBottom: 10,
  },
  inputContainer: {
    textAlign: "center",
    backgroundColor: "lightgray",
    width: "50%",
    padding: 10,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  itemContainer: {
    textAlign: "center",
    backgroundColor: "lightgray",
    width: "98%",
    padding: 10,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  scrollContainer: {
    maxHeight: "40%",
    width: "50%",
  },
});
