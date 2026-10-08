import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API = "http://192.168.1.101:8080";

type Membre = {
  id: number;
  nom: string;
  telephone: string;
  code: string;
};

export default function Tirage() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [gagnantAuto, setGagnantAuto] = useState<Membre | null>(null);
  const [gagnantManuel, setGagnantManuel] = useState<number | null>(null);
  const [montantSaisi, setMontantSaisi] = useState<string>("");
  const [versementEnCours, setVersementEnCours] = useState<boolean>(false);

  useEffect(() => {
    fetchMembres();
  }, []);

  const fetchMembres = async () => {
    try {
      const res = await fetch(`${API}/membres`);
      const data = await res.json();
      setMembres(data);
    } catch {
      // 🔥 CORRECTION : catch sans variable pour éviter l'erreur
      Alert.alert("Erreur", "Impossible de charger les membres");
    }
  };

  const handleAuto = () => {
    if (membres.length === 0) {
      Alert.alert("Erreur", "Aucun membre");
      return;
    }

    const random = Math.floor(Math.random() * membres.length);
    const winner = membres[random];

    setGagnantAuto(winner);

    Alert.alert(
      "Gagnant automatique 🎉",
      `${winner.nom} a été tiré automatiquement`
    );
  };

  const handleManual = () => {
    if (!gagnantManuel) {
      Alert.alert("Erreur", "Choisissez un gagnant");
      return;
    }

    const winner = membres.find((m) => m.id === gagnantManuel);

    if (!winner) {
      Alert.alert("Erreur", "Membre introuvable");
      return;
    }

    Alert.alert(
      "Gagnant manuel 🎉",
      `${winner.nom} a été choisi manuellement`
    );
  };

  const gagnantActuel: Membre | null = gagnantAuto 
    ? gagnantAuto 
    : (gagnantManuel ? membres.find((m) => m.id === gagnantManuel) ?? null : null);

  const handleVersement = async () => {
    if (!gagnantActuel) {
      Alert.alert("Erreur", "Veuillez d'abord sélectionner un gagnant");
      return;
    }

    const montant = parseFloat(montantSaisi);

    if (isNaN(montant) || montant <= 0) {
      Alert.alert("Erreur", "Veuillez saisir un montant valide supérieur à 0");
      return;
    }

    setVersementEnCours(true);

    try {
      const response = await fetch(`${API}/versements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membre_id: gagnantActuel.id,
          montant: montant,
          motif: "Gain de tirage",
        }),
      });

      if (response.ok) {
        Alert.alert(
          "Succès 🎉",
          `Versement de ${montant} FCFA effectué à ${gagnantActuel.nom} !`
        );
        setMontantSaisi("");
      } else {
        Alert.alert("Erreur", "Le serveur a refusé le versement");
      }
    } catch {
      // 🔥 CORRECTION : catch sans variable pour éviter l'erreur
      Alert.alert("Erreur réseau", "Impossible de contacter le serveur pour le versement");
    } finally {
      setVersementEnCours(false);
    }
  };

  return (
    <LinearGradient
      colors={["#ff6ec4", "#7873f5"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎯 Gestion des tirages</Text>

        {/* TIRAGE AUTO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tirage automatique</Text>
          <TouchableOpacity style={styles.button} onPress={handleAuto}>
            <Text style={styles.buttonText}>Lancer le tirage</Text>
          </TouchableOpacity>

          {gagnantAuto && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                Gagnant : {gagnantAuto.nom}
              </Text>
              <Text style={styles.resultPhone}>
                {gagnantAuto.telephone}
              </Text>
            </View>
          )}
        </View>

        {/* TIRAGE MANUEL */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tirage manuel</Text>
          <FlatList
            data={membres}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.memberRow,
                  gagnantManuel === item.id && styles.selectedRow,
                ]}
                onPress={() => setGagnantManuel(item.id)}
              >
                <View style={styles.checkbox}>
                  {gagnantManuel === item.id && (
                    <View style={styles.checked} />
                  )}
                </View>
                <View>
                  <Text style={styles.memberName}>{item.nom}</Text>
                  <Text style={styles.memberPhone}>
                    {item.telephone}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.button} onPress={handleManual}>
            <Text style={styles.buttonText}>Valider gagnant</Text>
          </TouchableOpacity>
        </View>

        {/* VERSEMENT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Versement du gain 💰</Text>

          {gagnantActuel ? (
            <View style={styles.winnerCard}>
              <Text style={styles.winnerLabel}>Gagnant sélectionné :</Text>
              <Text style={styles.winnerName}>{gagnantActuel.nom}</Text>
              <Text style={styles.winnerPhone}>{gagnantActuel.telephone}</Text>
            </View>
          ) : (
            <Text style={styles.noWinnerText}>
              Aucun gagnant sélectionné pour le moment.
            </Text>
          )}

          <Text style={styles.amountLabel}>Montant à verser :</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 15000"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={montantSaisi}
              onChangeText={setMontantSaisi}
              editable={!!gagnantActuel && !versementEnCours}
            />
            <Text style={styles.currencyText}>FCFA</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              styles.payButton,
              (!gagnantActuel || !montantSaisi.trim() || versementEnCours) && styles.buttonDisabled
            ]}
            onPress={handleVersement}
            disabled={!gagnantActuel || !montantSaisi.trim() || versementEnCours}
          >
            <Text style={styles.buttonText}>
              {versementEnCours ? "Versement en cours..." : "Valider le versement"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#7873f5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  resultBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultPhone: {
    color: "#666",
    marginTop: 5,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedRow: {
    borderColor: "#7873f5",
    backgroundColor: "#f3f2ff",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7873f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  checked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7873f5",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  memberPhone: {
    color: "#777",
    marginTop: 2,
  },
  winnerCard: {
    backgroundColor: "#f3f2ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#7873f5",
  },
  winnerLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7873f5",
  },
  winnerPhone: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  noWinnerText: {
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  amountLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  payButton: {
    backgroundColor: "#ff6ec4",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
});