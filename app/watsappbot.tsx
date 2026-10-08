import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API_URL = "http://192.168.1.101:3000/webhook";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function WhatsAppBotScreen() {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // 📩 ENVOI MESSAGE
  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user"
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input,
          from: "app"
        })
      });

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Aucune réponse du serveur",
        sender: "bot"
      };

      setMessages(prev => [...prev, botMsg]);

    } catch {
      // ✅ FIX ESLINT: plus de "err"
      Alert.alert("Erreur", "Impossible de contacter le serveur");

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: "Erreur serveur",
        sender: "bot"
      };

      setMessages(prev => [...prev, errorMsg]);
    }

    setInput("");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>💬 WhatsApp Bot Tontine</Text>

      {/* CHAT */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msg,
              item.sender === "user" ? styles.user : styles.bot
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      {/* INPUT */}
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Écris ton message..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Envoyer
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

// 🎨 STYLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  msg: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%"
  },

  user: {
    backgroundColor: "#22c55e",
    alignSelf: "flex-end"
  },

  bot: {
    backgroundColor: "#334155",
    alignSelf: "flex-start"
  },

  text: {
    color: "white"
  },

  inputContainer: {
    flexDirection: "row",
    marginTop: 10
  },

  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "white",
    padding: 12,
    borderRadius: 10
  },

  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: "center"
  }
});