import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function TextP(props : any){
    const [fontsLoaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'Delius': require('../assets/fonts/Delius-Regular.ttf')
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
    return <Text {...props} style={[props.style, {fontFamily: "Poppins"}]}>{props.children}</Text>
}