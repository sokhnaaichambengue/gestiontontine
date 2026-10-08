// app/diamra.tsx

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const API_BASE_URL = "http://192.168.1.101:8080";


interface Diamra {

  id: number;
  nature: string;
  dateTirage: string;
  gagnant?: string;

}



interface Participant {

  id: number;
  nom: string;
  telephone: string;
  nature: string;
  montant: number;

}




export default function DiamraScreen() {


  const [diamra, setDiamra] =
    useState<Diamra | null>(null);


  const [participants, setParticipants] =
    useState<Participant[]>([]);


  const [nature, setNature] =
    useState("");


  const [montant, setMontant] =
    useState("");


  const [loading, setLoading] =
    useState(false);






  // Charger le prochain Diamra

  const chargerDiamra = async () => {

    try {

      setLoading(true);


      const response =
        await fetch(
          `${API_BASE_URL}/diamra/prochain`
        );


      if (!response.ok) {

        throw new Error();

      }


      const data: Diamra =
        await response.json();


      setDiamra(data);



    } catch {


      Alert.alert(
        "Erreur",
        "Impossible de charger le Diamra"
      );


    } finally {

      setLoading(false);

    }

  };







  // Charger les participants

  const chargerParticipants = async () => {


    try {


      const response =
        await fetch(
          `${API_BASE_URL}/diamra/participants`
        );



      if (!response.ok) {

        throw new Error();

      }



      const data: Participant[] =
        await response.json();



      setParticipants(data);



    } catch {


      Alert.alert(
        "Erreur",
        "Impossible de charger les participants"
      );


    }


  };








  useEffect(() => {


    chargerDiamra();

    chargerParticipants();


  }, []);









  // Participation

  const participer = async () => {


    if (!nature && !montant) {


      Alert.alert(
        "Erreur",
        "Veuillez saisir une nature ou un montant"
      );


      return;


    }






    try {


      setLoading(true);



      const response =
        await fetch(

          `${API_BASE_URL}/diamra/participer`,

          {

            method: "POST",

            headers: {

              "Content-Type":
              "application/json"

            },


            body: JSON.stringify({

              nature: nature,

              montant:
              Number(montant)

            })

          }

        );





      if (!response.ok) {

        throw new Error();

      }






      Alert.alert(
        "Succès",
        "Participation enregistrée"
      );



      setNature("");

      setMontant("");



      chargerParticipants();





    } catch {


      Alert.alert(
        "Erreur",
        "Impossible d'enregistrer la participation"
      );


    } finally {


      setLoading(false);


    }


  };









  // Tirage automatique

  const lancerTirage = async () => {


    try {


      setLoading(true);



      const response =
        await fetch(

          `${API_BASE_URL}/diamra/tirage`,

          {

            method:"POST"

          }

        );




      if (!response.ok) {

        throw new Error();

      }





      const resultat =
        await response.json();





      Alert.alert(

        "🎉 Résultat",

        `Gagnant : ${resultat.gagnant}
Lot : ${resultat.nature}`

      );




      chargerDiamra();




    } catch {


      Alert.alert(

        "Erreur",

        "Le tirage a échoué"

      );


    } finally {


      setLoading(false);


    }


  };









  const renderParticipant =
  ({item}:{item:Participant}) => (


    <View style={styles.card}>


      <Text style={styles.nom}>

        {item.nom}

      </Text>


      <Text>

        Nature : {item.nature}

      </Text>


      <Text>

        Montant : {item.montant} FCFA

      </Text>


    </View>


  );









  return (


    <View style={styles.container}>


      <Text style={styles.title}>

        Diamra

      </Text>





      {
        loading &&
        <ActivityIndicator size="large"/>
      }






      {
        diamra &&

        <View style={styles.lot}>


          <Text style={styles.subtitle}>

            Prochain Diamra

          </Text>



          <Text>

            🎁 Nature :
            {diamra.nature}

          </Text>



          <Text>

            📅 Date :
            {diamra.dateTirage}

          </Text>





          {
            diamra.gagnant &&

            <Text>

              🏆 Gagnant :
              {diamra.gagnant}

            </Text>

          }


        </View>

      }






      <Text style={styles.subtitle}>

        Participer

      </Text>






      <TextInput

        style={styles.input}

        placeholder="Nature (Savon, huile...)"

        value={nature}

        onChangeText={setNature}

      />






      <TextInput

        style={styles.input}

        placeholder="Montant FCFA"

        keyboardType="numeric"

        value={montant}

        onChangeText={setMontant}

      />







      <TouchableOpacity

        style={styles.button}

        onPress={participer}

      >

        <Text style={styles.buttonText}>

          Participer

        </Text>


      </TouchableOpacity>







      <Text style={styles.subtitle}>

        Participants

      </Text>







      <FlatList

        data={participants}

        keyExtractor={
          item=>item.id.toString()
        }

        renderItem={renderParticipant}

      />







      <TouchableOpacity

        style={styles.tirage}

        onPress={lancerTirage}

      >

        <Text style={styles.buttonText}>

          🎲 Lancer le tirage

        </Text>


      </TouchableOpacity>





    </View>


  );


}









const styles = StyleSheet.create({


container:{

flex:1,

padding:20,

backgroundColor:"#fff"

},



title:{

fontSize:26,

fontWeight:"bold",

marginBottom:15

},



subtitle:{

fontSize:18,

fontWeight:"bold",

marginVertical:10

},



lot:{

backgroundColor:"#eee",

padding:15,

borderRadius:10

},



input:{

borderWidth:1,

borderColor:"#ccc",

padding:12,

borderRadius:8,

marginBottom:10

},



button:{

backgroundColor:"green",

padding:15,

borderRadius:10,

alignItems:"center"

},



tirage:{

backgroundColor:"purple",

padding:15,

borderRadius:10,

alignItems:"center",

marginTop:15

},



buttonText:{

color:"#fff",

fontWeight:"bold"

},



card:{

backgroundColor:"#f2f2f2",

padding:12,

borderRadius:8,

marginBottom:8

},



nom:{

fontSize:17,

fontWeight:"bold"

}


});