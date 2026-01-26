import BackButton from "@/components/BackButton";
import TextP from "@/components/TextP";
import { useNavigation } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Games() {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
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
  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: currentOpacity, flex: 1 }}>
        <TextP
          style={{
            fontSize: 30,
            color: "white",
            textAlign: "center",
            top: 150,
          }}
        >
          {t("games")}:
        </TextP>
        <View style={styles.main}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigate("/games/undercover");
            }}
          >
            <TextP style={{ textAlign: "center" }}>{t("undercover")}</TextP>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { opacity: 0.5 }]}
            disabled={true}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("sleepingCity")} ({t("comingSoon")})
            </TextP>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { opacity: 0.5 }]}
            disabled={true}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("classified")} ({t("comingSoon")})
            </TextP>
          </TouchableOpacity>
          <BackButton back="/" tryBack={false} />
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
});
