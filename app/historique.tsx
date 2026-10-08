import { StyleSheet, Text, View } from "react-native";

export default function Historique() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Historique des Cotisations</Text>
      <Text style={styles.text}>Toutes vos transactions apparaîtront ici.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  text: { fontSize: 16, textAlign: "center" }
});