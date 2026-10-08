import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function DashboardMembre() {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("role");
      router.replace("/login");
    } catch {
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  return (
    <LinearGradient
      colors={["#ff6ec4", "#7873f5"]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>

        {/* 🔵 SIDEBAR */}
        <View style={styles.sidebar}>
          <Text style={styles.logo}>NATT</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>🚪 Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* ⚪ CONTENU */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >

          <Text style={styles.header}>
            Tableau de bord membre
          </Text>

          <Text style={styles.subtitle}>
            Gérez vos épargnes et paiements facilement
          </Text>

          <View style={styles.cardsContainer}>

            {/* 🔵 ÉPARGNE */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/epargne")}
            >
              <Text style={styles.cardIcon}>💰</Text>

              <Text style={styles.cardTitle}>
                Épargne
              </Text>

              <Text style={styles.cardDesc}>
                Consultez vos épargnes et cotisations
              </Text>
            </TouchableOpacity>

            {/* 🟣 COTISATION */}
          

            {/* 🟢 HISTORIQUE */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/historique")}
            >
              <Text style={styles.cardIcon}>📜</Text>

              <Text style={styles.cardTitle}>
                Historique
              </Text>

              <Text style={styles.cardDesc}>
                Consultez vos transactions et paiements
              </Text>
            </TouchableOpacity>

            {/* 🟠 PAIEMENT */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/amende")}
            >
              <Text style={styles.cardIcon}>💳</Text>

              <Text style={styles.cardTitle}>
                Paiement
              </Text>

              <Text style={styles.cardDesc}>
                Payez avec Wave ou Orange Money
              </Text>
            </TouchableOpacity>

            {/* 🔴 RÉCLAMATION */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/reclamation")}
            >
              <Text style={styles.cardIcon}>⚠️</Text>

              <Text style={styles.cardTitle}>
                Réclamation
              </Text>

              <Text style={styles.cardDesc}>
                Envoyez une réclamation ou un problème
              </Text>
            </TouchableOpacity>
                        {/* 🟡 MES VERSEMENTS */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/membreversement")}
            >
              <Text style={styles.cardIcon}>📊</Text>

              <Text style={styles.cardTitle}>
                Mes versements
              </Text>

              <Text style={styles.cardDesc}>
                Consultez vos cotisations, vos paiements et votre reste à payer
              </Text>
            </TouchableOpacity>
            

          </View>

        </ScrollView>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },

  sidebar: {
    width: width * 0.32,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: "space-between"
  },

  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center"
  },

  content: {
    width: width * 0.68,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222"
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20
  },

  cardsContainer: {
    gap: 15
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6
  },

  cardIcon: {
    fontSize: 26,
    marginBottom: 8
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5
  },

  cardDesc: {
    fontSize: 12,
    color: "#777"
  },

  logoutButton: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5
  },

  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700"
  }
});