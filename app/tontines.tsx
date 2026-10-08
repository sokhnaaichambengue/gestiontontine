import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API = "http://192.168.1.101:8080/membre";

export default function Tontines() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [type, setType] = useState("epargne");
  const [role, setRole] = useState("");
  const [loadingRole, setLoadingRole] = useState(true);

  const router = useRouter();

  // =========================
  // LOAD ROLE
  // =========================
  useEffect(() => {
    const loadRole = async () => {
      const r = await AsyncStorage.getItem("role");
      setRole(r || "");
      setLoadingRole(false);
    };

    loadRole();
  }, []);

  // =========================
  // CREATE TONTINE (ADMIN)
  // =========================
  const create = async () => {
    if (!nom || !telephone) {
      Alert.alert("Erreur", "Remplissez tous les champs");
      return;
    }

    try {
      const res = await fetch(`${API}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom,
          telephone,
          type
        })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data?.message || "Création échouée");
        return;
      }

      const code = data.code;

      const message = `Bonjour ${nom}
Vous êtes ajouté à la tontine.
Votre code est : ${code}`;

      const smsUrl = `sms:${telephone}?body=${encodeURIComponent(message)}`;

      await Linking.openURL(smsUrl);

      Alert.alert("Succès", "Code généré avec succès");

    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Serveur inaccessible");
    }
  };

  // =========================
  // LOADING ROLE SCREEN
  // =========================
  if (loadingRole) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#7873f5" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#ff6ec4", "#7873f5"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          width: "90%",
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 20
        }}
      >

        {/* ================= ADMIN ================= */}
        {role === "ADMIN" && (
          <>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
              Créer une tontine
            </Text>

            <TextInput
              placeholder="Nom"
              value={nom}
              onChangeText={setNom}
              style={{
                borderWidth: 1,
                padding: 12,
                borderRadius: 10,
                marginBottom: 10
              }}
            />

            <TextInput
              placeholder="Téléphone"
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
              style={{
                borderWidth: 1,
                padding: 12,
                borderRadius: 10,
                marginBottom: 10
              }}
            />

            {/* TYPE */}
            <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
              Type de tontine
            </Text>

            <TouchableOpacity onPress={() => setType("epargne")}>
              <Text style={{ marginBottom: 5 }}>
                {type === "epargne" ? "✔ " : ""} Épargne
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType("cotisation")}>
              <Text style={{ marginBottom: 20 }}>
                {type === "cotisation" ? "✔ " : ""} Cotisation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={create}
              style={{
                backgroundColor: "#7873f5",
                padding: 15,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                Générer le code
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ================= MEMBRE ================= */}
        {role === "MEMBRE" && (
          <>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
              Rejoindre une tontine
            </Text>

            <Text style={{ marginBottom: 20 }}>
              Vous devez entrer votre code pour continuer
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/code")}
              style={{
                backgroundColor: "#7873f5",
                padding: 15,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                Entrer le code
              </Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </LinearGradient>
  );
}