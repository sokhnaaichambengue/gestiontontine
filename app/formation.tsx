import { StyleSheet, Text, View } from "react-native";

export default function Formation() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Formation Utilisateurs</Text>
      <Text style={styles.text}>Ici, vous pourrez visionner la vidéo de formation.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  text: { fontSize: 16, textAlign: "center" }
  
});