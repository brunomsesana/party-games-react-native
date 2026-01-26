import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import TextP from "./TextP";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RevealCard({
  children,
  players,
  turn,
  pressed,
  setPressed,
}: {
  children: React.ReactNode;
  players: string[];
  turn: number;
  pressed: boolean;
  setPressed: (pressed: boolean) => void;
}) {
  const translateY = useSharedValue(0);
  const context = useSharedValue(0);
  const { t } = useTranslation();

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.min(0, context.value + event.translationY);
    })
    .onEnd(() => {
      if (translateY.value < -150) {
        translateY.value = withSpring(-300);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-100, 0],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  useEffect(() => {
    translateY.value = withSpring(0);
    setPressed(false);
  }, [pressed]);

  return (
    <View style={styles.container}>
      {/* O que está EMBAIXO (a palavra secreta) */}
      <View style={styles.secretContent}>{children}</View>

      {/* A CAPA que arrasta */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.cover, animatedStyle]}>
          <Animated.View style={textStyle}>
            <TextP style={styles.coverText}>{players[turn]}</TextP>
            <TextP style={styles.subText}>{t("dragUp")}</TextP>
          </Animated.View>
          <View style={styles.handle} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  secretContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#c0d9e3",
    paddingBottom: 100,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#594294",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  coverText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 10,
    textAlign: "center",
  },
  handle: {
    width: 40,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    position: "absolute",
    bottom: 20,
  },
});
