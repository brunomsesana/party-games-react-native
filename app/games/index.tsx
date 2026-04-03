import BackButton from "@/components/BackButton";
import TextP from "@/components/TextP";
import { PlayerContext } from "@/contexts/PlayersContext";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds, useForeground } from "react-native-google-mobile-ads";

export default function Games() {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { isAdFree } = useContext(PlayerContext);
  const bannerRef = useRef<BannerAd>(null);
  const { t } = useTranslation();
  const router = useRouter();
  useForeground(() => {
    if (!isAdFree && bannerRef.current) {
      bannerRef.current.load();
    }
  });
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
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
              router.push("/games/undercover");
            }}
          >
            <TextP style={{ textAlign: "center" }}>{t("undercover")}</TextP>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/games/sleepingCity");
            }}
          >
            <TextP style={{ textAlign: "center" }}>
              {t("sleepingCity")}
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
      {!isAdFree &&
        <BannerAd ref={bannerRef} unitId={__DEV__ ? TestIds.ADAPTIVE_BANNER : "ca-app-pub-3794910185024045/9261852580"} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />}
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
