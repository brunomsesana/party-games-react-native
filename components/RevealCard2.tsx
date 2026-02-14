import React from "react";
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

export default function RevealCard2({
  text,
  children,
}: {
  text: string,
  children: React.ReactNode;
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
      if (translateY.value < -300) {
        translateY.value = withSpring(-SCREEN_HEIGHT + 60);
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

  return (
    <View style={styles.container}>
      <View style={styles.secretContent}>{children}</View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.cover, animatedStyle]}>
          <Animated.View style={textStyle}>
            <TextP style={styles.coverText}>{text}</TextP>
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
    justifyContent: "center",
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
