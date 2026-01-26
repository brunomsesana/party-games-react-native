import { Route, useNavigation } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import TextP from "./TextP";

export default function BackButton({
  back,
  tryBack = true,
}: {
  back: Route;
  tryBack?: boolean;
}) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: "#c2c0c0", borderColor: "black" },
      ]}
      onPress={() => {
        if (navigation.canGoBack() && tryBack) {
          navigation.goBack();
        } else {
          navigate(back);
        }
      }}
    >
      <TextP style={{ textAlign: "center" }}>{t("goBack")}</TextP>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
