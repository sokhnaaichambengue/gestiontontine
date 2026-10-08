import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { useEffect } from "react";

import {
  ActivityIndicator,
  View
} from "react-native";

export default function Index() {

  useEffect(() => {

    const check = async () => {

      const role =
        await AsyncStorage.getItem("role");

      if(role === "ADMIN") {

        router.replace("/dashboard");
        return;

      }

      if(role === "MEMBRE") {

        router.replace("/dashboardmembre");
        return;

      }

      router.replace("/login");

    };

    check();

  }, []);

  return (

    <View
      style={{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
      }}
    >

      <ActivityIndicator size="large" />

    </View>

  );
}