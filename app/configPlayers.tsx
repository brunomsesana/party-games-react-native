import TextP from "@/components/TextP";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useNavigation } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function configPlayers() {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { players, updatePlayers } = useContext(PlayerContext);
  const [newPlayer, setNewPlayer] = useState<string>("");
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
  useEffect(() => {
    console.log(players);
  }, [players]);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.main, { opacity: currentOpacity }]}>
        <TextP style={{ fontSize: 30, color: "white" }}>Jogadores:</TextP>
        {players.length > 0 ? (
          players.map((x, i) => <TextP key={i}>{x}</TextP>)
        ) : (
          <TextP style={{ color: "white", margin: 10 }}>
            Nenhum jogador na lista
          </TextP>
        )}
        <View style={styles.inputContainer}>
          <TextP style={{ fontSize: 11, color: "black" }}>Novo Jogador:</TextP>
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <TextP style={{ textAlign: "center" }}>Voltar</TextP>
        </TouchableOpacity>
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
});
