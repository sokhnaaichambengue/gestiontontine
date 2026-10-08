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

export default function Dashboard() {

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Déconnexion",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("user");
              await AsyncStorage.removeItem("role");
              router.replace("/login");
            } catch {
              Alert.alert("Erreur", "Impossible de se déconnecter");
            }
          },
          style: "destructive"
        }
      ]
    );
  };


  return (
    <LinearGradient
      colors={["#ff6ec4", "#7873f5"]}
      style={{ flex: 1 }}
    >

      <View style={styles.container}>


        {/* 🔵 SIDEBAR */}
        <View style={styles.sidebar}>

          <Text style={styles.logo}>
            NATT
          </Text>


          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >

            <Text style={styles.logoutText}>
              🚪 Déconnexion
            </Text>

          </TouchableOpacity>


        </View>





        {/* ⚪ CONTENU */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >


          <Text style={styles.header}>
            Tableau de bord administrateur
          </Text>


          <Text style={styles.subtitle}>
            Gérez vos tontines, tirages et actions de solidarité
          </Text>





          <View style={styles.cardsContainer}>



            {/* 💼 CREER TONTINE */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/tontines")}
            >

              <Text style={styles.cardIcon}>
                💼
              </Text>


              <Text style={styles.cardTitle}>
                Créer une tontine
              </Text>


              <Text style={styles.cardDesc}>
                Lancez une nouvelle tontine facilement
              </Text>


            </TouchableOpacity>







            {/* 📦 COTISATION */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/cotisation")}
            >

              <Text style={styles.cardIcon}>
                📦
              </Text>


              <Text style={styles.cardTitle}>
                Cotisation
              </Text>


              <Text style={styles.cardDesc}>
                Effectuez vos cotisations mensuelles
              </Text>


            </TouchableOpacity>







            {/* 💰 VERSEMENT */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/versement")}
            >

              <Text style={styles.cardIcon}>
                💰
              </Text>


              <Text style={styles.cardTitle}>
                Versement
              </Text>


              <Text style={styles.cardDesc}>
                Gérez les versements des membres
              </Text>


            </TouchableOpacity>








            {/* 🎁 DIAMRA */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/diamra")}
            >

              <Text style={styles.cardIcon}>
                🎁
              </Text>


              <Text style={styles.cardTitle}>
                Diamra
              </Text>


              <Text style={styles.cardDesc}>
                Définissez les lots et effectuez le tirage Diamra
              </Text>


            </TouchableOpacity>








            {/* 🎯 TIRAGE */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/tirage")}
            >

              <Text style={styles.cardIcon}>
                🎯
              </Text>


              <Text style={styles.cardTitle}>
                Tirage
              </Text>


              <Text style={styles.cardDesc}>
                Effectuez un tirage automatique
              </Text>


            </TouchableOpacity>








            {/* 🤝 SOLIDARITE */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/solidarite")}
            >

              <Text style={styles.cardIcon}>
                🤝
              </Text>


              <Text style={styles.cardTitle}>
                Solidarité
              </Text>


              <Text style={styles.cardDesc}>
                Gérez les aides et demandes
              </Text>


            </TouchableOpacity>








            {/* 📱 WHATSAPP BOT */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/watsappbot")}
            >

              <Text style={styles.cardIcon}>
                🎯
              </Text>


              <Text style={styles.cardTitle}>
                WhatsApp Bot
              </Text>


              <Text style={styles.cardDesc}>
                Programmez des messages automatiques pour vos membres
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
    flexDirection: "column",
    justifyContent: "space-between"
  },


  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center"
  },


  menuItem: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12
  },


  menu: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500"
  },


  content: {
    width: width * 0.68,
    padding:20,
    backgroundColor:"rgba(255,255,255,0.97)",
    borderTopLeftRadius:25,
    borderBottomLeftRadius:25
  },


  header:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:8,
    color:"#222"
  },


  subtitle:{
    fontSize:13,
    color:"#666",
    marginBottom:20
  },


  cardsContainer:{
    gap:15
  },


  card:{
    backgroundColor:"#fff",
    padding:18,
    borderRadius:15,
    marginBottom:15,
    elevation:4,
    shadowColor:"#000",
    shadowOpacity:0.08,
    shadowRadius:6
  },


  cardIcon:{
    fontSize:26,
    marginBottom:8
  },


  cardTitle:{
    fontSize:16,
    fontWeight:"600",
    marginBottom:5
  },


  cardDesc:{
    fontSize:12,
    color:"#777"
  },


  logoutButton:{
    backgroundColor:"rgba(255,59,48,0.8)",
    paddingVertical:12,
    paddingHorizontal:10,
    borderRadius:12,
    alignItems:"center"
  },


  logoutText:{
    color:"#fff",
    fontSize:15,
    fontWeight:"600"
  }

});