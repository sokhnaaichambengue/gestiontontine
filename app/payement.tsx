import React, { useState } from "react";
import {
  Alert,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function PaymentScreen() {

  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("ORANGE");
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    if (!amount || !phone) {
      Alert.alert("Erreur", "Remplis tous les champs");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.101:8080/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(amount),
          phone,
          method
        })
      });

      const data = await res.json();

      if (data.payment_url) {
        Linking.openURL(data.payment_url);
      }

    } catch (err) {
      // ✔️ on utilise bien l'erreur maintenant
      console.log("Erreur paiement :", err);
      Alert.alert("Erreur", "Paiement impossible");
    }

    setLoading(false);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#0f172a",
      justifyContent: "center",
      padding: 20
    }}>

      <Text style={{
        fontSize: 26,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 30
      }}>
        💰 Paiement Tontine
      </Text>

      <TextInput
        placeholder="Montant (FCFA)"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{
          backgroundColor: "#1e293b",
          padding: 15,
          borderRadius: 12,
          color: "white",
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#334155"
        }}
      />

      <TextInput
        placeholder="Numéro téléphone"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={{
          backgroundColor: "#1e293b",
          padding: 15,
          borderRadius: 12,
          color: "white",
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#334155"
        }}
      />

      <Text style={{
        color: "#cbd5e1",
        marginBottom: 10,
        fontWeight: "600"
      }}>
        Méthode de paiement
      </Text>

      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25
      }}>

        <TouchableOpacity
          onPress={() => setMethod("ORANGE")}
          style={{
            flex: 1,
            padding: 15,
            marginHorizontal: 5,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: method === "ORANGE" ? "#f97316" : "#1e293b",
            borderWidth: 1,
            borderColor: method === "ORANGE" ? "#f97316" : "#334155"
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            🟠 Orange Money
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMethod("WAVE")}
          style={{
            flex: 1,
            padding: 15,
            marginHorizontal: 5,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: method === "WAVE" ? "#3b82f6" : "#1e293b",
            borderWidth: 1,
            borderColor: method === "WAVE" ? "#3b82f6" : "#334155"
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            🔵 Wave
          </Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        onPress={pay}
        style={{
          backgroundColor: "#22c55e",
          padding: 16,
          borderRadius: 12,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "Traitement..." : "Payer maintenant"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}