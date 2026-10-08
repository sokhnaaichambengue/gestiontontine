import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

const API = "http://192.168.1.101:8080/api";

type Membre = {
  id: number;
  nom: string;
  telephone: string;
  type: string;
};

export default function DashboardMembre() {

  const { id } = useLocalSearchParams<{ id: string }>();

  const [membre, setMembre] = useState<Membre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkAccess = async () => {

      const role = await AsyncStorage.getItem("role");

      // 🚫 protection accès
      if (role !== "MEMBRE") {
        router.replace("/login");
        return;
      }

      loadMembre();
    };

    const loadMembre = async () => {

      try {
        const res = await fetch(`${API}/membres/${id}`);
        const data = await res.json();

        if (data?.id) {
          setMembre(data);
        } else {
          Alert.alert("Erreur", "Membre introuvable");
        }

      } catch {
        Alert.alert("Erreur réseau");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();

  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!membre) {
    return (
      <View style={styles.center}>
        <Text>Aucune donnée membre</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        👋 Bienvenue {membre.nom}
      </Text>

      <View style={styles.card}>
        <Text style={styles.text}>📱 Téléphone : {membre.telephone}</Text>
        <Text style={styles.text}>💰 Type : {membre.type}</Text>
        <Text style={styles.text}>🆔 ID : {membre.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Actions membre
        </Text>

        <Text>✔️ Voir cotisations</Text>
        <Text>✔️ Historique paiements</Text>
        <Text>✔️ Participer tontine</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6fa"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3
  },

  text: {
    fontSize: 14,
    marginBottom: 5
  }
});