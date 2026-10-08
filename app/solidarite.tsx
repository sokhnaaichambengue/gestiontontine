import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Picker } from "@react-native-picker/picker";

interface Membre {
  id: string;
  nom: string;
  telephone: string;
}

// 🔥 BACKEND
const API_URL = "http://192.168.1.101:8080";

export default function Solidarite() {

  const [message, setMessage] = useState<string>("");
  const [numeroAdmin, setNumeroAdmin] = useState<string>("");
  const [montant, setMontant] = useState<string>("");

  const [membres, setMembres] = useState<Membre[]>([]);
  const [selectedMembreId, setSelectedMembreId] = useState<string>("");

  // =========================
  // CHARGER MEMBRES BDD
  // =========================
  useEffect(() => {
    const chargerMembres = async () => {
      try {
        const res = await fetch(`${API_URL}/membres`);

        if (!res.ok) {
          throw new Error("Erreur API");
        }

        const data: Membre[] = await res.json();
        setMembres(data);

      } catch {
        Alert.alert("Erreur", "Impossible de charger les membres");
      }
    };

    chargerMembres();
  }, []);

  // =========================
  // SMS
  // =========================
  const envoyerSMS = () => {
    if (!message || !numeroAdmin || !montant) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    const texte = `Montant: ${montant} FCFA\nMessage: ${message}`;
    Linking.openURL(`sms:${numeroAdmin}?body=${encodeURIComponent(texte)}`);
  };

  // =========================
  // WHATSAPP
  // =========================
  const envoyerWhatsApp = () => {
    if (!message || !numeroAdmin || !montant) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    const texte = `Montant: ${montant} FCFA\nMessage: ${message}`;
    const numeroWhats = numeroAdmin.replace("+", "").replace(/\s/g, "");

    Linking.openURL(
      `https://wa.me/${numeroWhats}?text=${encodeURIComponent(texte)}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solidarité</Text>

      {/* MEMBRES BDD */}
      <Picker
        selectedValue={selectedMembreId}
        onValueChange={(value) => setSelectedMembreId(value)}
      >
        <Picker.Item label="Sélectionner un membre" value="" />

        {membres.map((m) => (
          <Picker.Item
            key={m.id}
            label={m.nom}
            value={m.id}
          />
        ))}
      </Picker>

      {/* ADMIN */}
      <TextInput
        style={styles.input}
        placeholder="Numéro de l'admin (+221...)"
        value={numeroAdmin}
        onChangeText={setNumeroAdmin}
        keyboardType="phone-pad"
      />

      {/* MESSAGE */}
      <TextInput
        style={[styles.input, { minHeight: 100 }]}
        placeholder="Écrivez votre message de solidarité"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* MONTANT */}
      <TextInput
        style={styles.input}
        placeholder="Montant (FCFA)"
        value={montant}
        onChangeText={setMontant}
        keyboardType="numeric"
      />

      {/* BUTTON SMS */}
      <TouchableOpacity style={styles.buttonSMS} onPress={envoyerSMS}>
        <Text style={styles.buttonText}>Envoyer par SMS</Text>
      </TouchableOpacity>

      {/* BUTTON WHATSAPP */}
      <TouchableOpacity
        style={styles.buttonWhatsApp}
        onPress={envoyerWhatsApp}
      >
        <Text style={styles.buttonText}>Envoyer par WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================
// STYLE
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },

  buttonSMS: {
    backgroundColor: "#2E86C1",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },

  buttonWhatsApp: {
    backgroundColor: "#25D366",
    padding: 15,
    borderRadius: 8
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }
});