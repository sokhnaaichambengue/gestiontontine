import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AuthEntry() {

  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Bienvenue
      </Text>

      {/* 🔵 ADMIN */}
      <TouchableOpacity
        style={styles.adminBtn}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.btnText}>
          Connexion Admin
        </Text>
      </TouchableOpacity>

      {/* 🟣 MEMBRE */}
      <TouchableOpacity
        style={styles.memberBtn}
        onPress={() => router.push("/entrercode")}
      >
        <Text style={styles.btnText}>
          Entrer Code Membre
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40
  },
  adminBtn: {
    backgroundColor: "#7873f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  memberBtn: {
    backgroundColor: "#ff6ec4",
    padding: 15,
    borderRadius: 10
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});