import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import React, {
    useEffect,
    useState
} from "react";

import {
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Accueil() {

  const [role, setRole] =
    useState("");

  useEffect(() => {

    const load = async () => {

      const r =
        await AsyncStorage.getItem("role");

      if(r) {

        setRole(r);

      }

    };

    load();

  }, []);

  return (

    <View
      style={{
        flex:1,
        justifyContent:"center",
        padding:20
      }}
    >

      {
        role === "ADMIN" && (

          <TouchableOpacity
            onPress={() =>
              router.push("/dashboard")
            }
            style={{
              backgroundColor:"#7873f5",
              padding:15,
              borderRadius:10,
              marginBottom:20
            }}
          >

            <Text
              style={{
                color:"#fff",
                textAlign:"center",
                fontWeight:"bold"
              }}
            >
              Créer une tontine
            </Text>

          </TouchableOpacity>

        )
      }

      <Text
        style={{
          marginBottom: 20,
          color: "#333",
          fontSize: 14
        }}
      >
        Appuyez sur Joindre une tontine pour entrer le code envoyé par l&apos;admin.
      </Text>
      <TouchableOpacity
        onPress={() =>
          router.push("/entrercode")
        }
        style={{
          backgroundColor:"#ff6ec4",
          padding:15,
          borderRadius:10
        }}
      >

        <Text
          style={{
            color:"#fff",
            textAlign:"center",
            fontWeight:"bold"
          }}
        >
          Joindre une tontine
        </Text>

      </TouchableOpacity>

    </View>

  );
}