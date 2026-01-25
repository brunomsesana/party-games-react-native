import Bg1 from "@/assets/vectors/bg_1.svg";
import Bg2 from "@/assets/vectors/bg_2.svg";
import TextP from "@/components/TextP";
import { navigate } from "expo-router/build/global-state/routing";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function Index() {
  const { width, height } = useWindowDimensions();

  const vmin = Math.min(width, height);
  const INITIAL_SIZE = vmin * 0.7 * 2;
  const [zIndexBg1, setZIndexBg1] = useState(-1);
  const [svg2Size, setSvg2Size] = useState(vmin * 0.7);
  const growAnim = useRef(new Animated.Value(0)).current;
  const growAnim2 = useRef(new Animated.Value(0)).current;

  function playHandler() {
    setZIndexBg1(1);
    Animated.timing(growAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      navigate("/play");
      Animated.timing(growAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1000);
  }
  const currentSvgSize = growAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 12],
  });
  function configPlayersHandler() {
    setZIndexBg1(1);
    Animated.timing(growAnim2, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      navigate("/configPlayers");
      Animated.timing(growAnim2, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1000);
  }
  const currentSvg2Size = growAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 20],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.svgWrapper,
          {
            top: -INITIAL_SIZE * 0.2,
            right: -INITIAL_SIZE * 0.5,
            transform: [{ scale: currentSvgSize }],
            width: vmin * 0.7 * 2,
            height: vmin * 0.7 * 2,
            zIndex: zIndexBg1,
          },
        ]}
      >
        <Bg1 width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
      </Animated.View>
      <Animated.View
        style={[
          styles.svgWrapper,
          {
            bottom: -svg2Size * 0.3,
            left: -svg2Size * 0.3,
            transform: [{ scale: currentSvg2Size }],
            width: vmin * 0.7,
            height: vmin * 0.7,
            zIndex: zIndexBg1,
          },
        ]}
      >
        <Bg2 width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
      </Animated.View>

      <View style={styles.main}>
        <View style={{ marginBottom: height * 0.2, marginTop: height * 0.2 }}>
          <Text style={styles.title}>Party Games</Text>
          <TextP style={{ textAlign: "center", marginTop: 10 }}>
            by: brunomsesana
          </TextP>
        </View>
        <TouchableOpacity style={styles.button} onPress={playHandler}>
          <TextP style={{ textAlign: "center" }}>Jogar</TextP>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={configPlayersHandler}>
          <TextP style={{ textAlign: "center" }}>Configurar Jogadores</TextP>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c0d9e3",
    overflow: "hidden",
    fontFamily: "Poppins",
  },
  svgWrapper: {
    position: "absolute",
  },
  main: {
    flex: 1,
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
  title: {
    fontFamily: "Delius",
    fontSize: 72,
    textAlign: "center",
  },
});
