import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API = "http://192.168.1.101:8080";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const login = async () => {
    if (!phone) {
      Alert.alert("Erreur", "Numéro de téléphone requis");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data?.role) {
        Alert.alert("Erreur", data?.message || "Connexion échouée");
        return;
      }

      // Sauvegarde role
      await AsyncStorage.setItem("role", data.role);

      // =========================
      // ADMIN
      // =========================
      if (data.role === "ADMIN") {
        await AsyncStorage.setItem("user", JSON.stringify(data));
        router.replace("/dashboard");
        return;
      }

      // =========================
      // MEMBRE
      // =========================
      if (data.role === "MEMBRE") {
        await AsyncStorage.setItem("membre", JSON.stringify(data));

        if (data.memberId) {
          await AsyncStorage.setItem("memberId", String(data.memberId));
        }

        // aller vers code
        router.replace("/code");
        return;
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Serveur inaccessible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ff6ec4", "#7873f5"]} style={styles.left}>
        <Text style={styles.logo}>NATT</Text>
        <Text style={styles.subtitle}>Gestion des tontines</Text>
      </LinearGradient>

      <View style={styles.right}>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Numéro de téléphone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={login} style={styles.button}>
          <LinearGradient
            colors={["#ff6ec4", "#7873f5"]}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Connexion</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  left: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  subtitle: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center"
  },
  right: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  button: {
    marginTop: 10
  },
  buttonGradient: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});