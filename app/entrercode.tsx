import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API = "http://192.168.1.101:8080";

export default function Code() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const verifyCode = async () => {
    if (!code) {
      Alert.alert("Erreur", "Veuillez entrer le code");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (!data.success) {
        Alert.alert("Erreur", data.message || "Code invalide");
        return;
      }

      await AsyncStorage.setItem("membre", JSON.stringify(data));

      router.replace("/dashboardmembre");

    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Serveur inaccessible");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrer votre code</Text>

      <TextInput
        placeholder="Code membre"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />

      <TouchableOpacity onPress={verifyCode} style={styles.button}>
        <Text style={styles.btn}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10
  },
  button: {
    marginTop: 20,
    backgroundColor: "#7873f5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  btn: {
    color: "white",
    fontWeight: "bold"
  }
});