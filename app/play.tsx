import TextP from "@/components/TextP";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Play() {
  const opacityAnim = useRef(new Animated.Value(0)).current;
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
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.main, { opacity: currentOpacity }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigate("/games/infiltrado");
          }}
        >
          <TextP style={{ textAlign: "center" }}>Infiltrado</TextP>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <TextP style={{ textAlign: "center" }}>Cidade Dorme</TextP>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <TextP style={{ textAlign: "center" }}>Arquivo Confidencial</TextP>
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
});
