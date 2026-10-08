import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from 'react-native-calendars';

/**
 * 🔹 TYPES
 */
type Membre = {
  id: number;
  nom: string;
};

type Epargne = {
  id: number;
  membre: Membre;
  type: "ENTREE" | "SORTIE";
  montant: number;
  description?: string;
  date: string;
};

/**
 * 🔹 API
 */
const API = "http://192.168.1.101:8080/api"; // Change selon ton backend

export default function EpargneScreen() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [selectedMembre, setSelectedMembre] = useState<Membre | null>(null);
  const [data, setData] = useState<Epargne[]>([]);
  const [solde, setSolde] = useState(0);
  const [montant, setMontant] = useState("");
  const [type, setType] = useState<"ENTREE" | "SORTIE">("ENTREE");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // date YYYY-MM-DD
  const [loading, setLoading] = useState(false);

  /**
   * 📥 Charger tous les membres
   */
  const loadMembres = async () => {
    try {
      const res = await fetch(`${API}/membre`);
      if (!res.ok) throw new Error("Erreur chargement membres");
      const json = await res.json();
      setMembres(json);
      if (json.length > 0) setSelectedMembre(json[0]);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les membres");
    }
  };

  /**
   * 📥 Charger transactions et solde du membre
   */
  const loadData = async (membreId: number) => {
    try {
      const res1 = await fetch(`${API}/epargne/membre/${membreId}`);
      const res2 = await fetch(`${API}/epargne/solde/${membreId}`);

      if (!res1.ok || !res2.ok) throw new Error("Erreur chargement epargne");

      setData(await res1.json());
      setSolde(await res2.json());
    } catch {
      Alert.alert("Erreur", "Impossible de charger les transactions");
    }
  };

  useEffect(() => {
    loadMembres();
  }, []);

  useEffect(() => {
    if (selectedMembre) loadData(selectedMembre.id);
  }, [selectedMembre]);

  /**
   * ➕ Ajouter transaction
   */
  const addTransaction = async () => {
    if (!selectedMembre || !montant) return;

    setLoading(true);

    try {
      await fetch(`${API}/epargne`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membre: { id: selectedMembre.id },
          type,
          montant: Number(montant),
          date,
          description: "Ajout mobile"
        })
      });

      setMontant("");
      loadData(selectedMembre.id);

    } catch {
      Alert.alert("Erreur", "Impossible d'ajouter la transaction");
    }

    setLoading(false);
  };

  /**
   * 🎨 UI
   */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Gestion Épargne</Text>

      {/* 🔹 Choisir Membre */}
      <View style={styles.membreBox}>
        {membres.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.membreBtn,
              selectedMembre?.id === m.id && styles.membreBtnSelected
            ]}
            onPress={() => setSelectedMembre(m)}
          >
            <Text style={{ color: selectedMembre?.id === m.id ? "#fff" : "#000" }}>{m.nom}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Solde */}
      {selectedMembre && (
        <Text style={styles.solde}>Solde: {solde} FCFA</Text>
      )}

      {/* 🔹 Montant */}
      <TextInput
        placeholder="Montant"
        value={montant}
        onChangeText={setMontant}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* 🔹 Type */}
      <View style={{ flexDirection: "row", marginVertical: 5 }}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: type === "ENTREE" ? "green" : "#ccc" }]}
          onPress={() => setType("ENTREE")}
        >
          <Text style={styles.btnText}>Entrée</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: type === "SORTIE" ? "red" : "#ccc" }]}
          onPress={() => setType("SORTIE")}
        >
          <Text style={styles.btnText}>Sortie</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Date calendrier */}
      <Calendar
        onDayPress={(day) => setDate(day.dateString)}
        markedDates={{ [date]: { selected: true, selectedColor: "#3498db" } }}
      />

      {/* 🔹 Ajouter */}
      <TouchableOpacity style={styles.addBtn} onPress={addTransaction}>
        <Text style={styles.btnText}>{loading ? "Ajout..." : "Ajouter"}</Text>
      </TouchableOpacity>

      {/* 🔹 Liste */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.date} - {item.montant} FCFA - {item.type === "ENTREE" ? "🟢" : "🔴"}</Text>
            <Text style={{ fontSize: 12 }}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f4f6f7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  membreBox: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  membreBtn: { padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, margin: 3 },
  membreBtnSelected: { backgroundColor: "#3498db" },
  solde: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, backgroundColor: "#fff", marginVertical: 5 },
  btn: { flex: 1, padding: 10, margin: 3, alignItems: "center", borderRadius: 5 },
  btnText: { color: "#fff", fontWeight: "bold" },
  addBtn: { backgroundColor: "#3498db", padding: 12, marginVertical: 10, alignItems: "center", borderRadius: 6 },
  card: { padding: 10, backgroundColor: "#fff", marginVertical: 5, borderRadius: 6 },
});