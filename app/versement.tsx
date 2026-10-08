// app/versement.tsx

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


interface Membre {

  id: number;

  nom: string;

  telephone: string;

  montantCotisation: number;

  totalVerse: number;

}



export default function Versement() {


  const [membres, setMembres] = useState<Membre[]>([]);

  const [selectedMembre, setSelectedMembre] =
    useState<Membre | null>(null);

  const [montant, setMontant] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(false);



  // Charger les membres

  const chargerMembres = async () => {

    try {

      setLoading(true);


      const response = await fetch(
        `${API_BASE_URL}/membres`
      );


      if (!response.ok) {

        throw new Error(
          "Erreur chargement membres"
        );

      }


      const data: Membre[] =
        await response.json();


      setMembres(data);


    } catch (error: any) {


      Alert.alert(
        "Erreur",
        error.message ||
        "Impossible de charger les membres"
      );


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    chargerMembres();

  }, []);





  // Ajouter versement

  const enregistrerVersement = async () => {


    if (!selectedMembre) {

      Alert.alert(
        "Attention",
        "Veuillez sélectionner un membre"
      );

      return;

    }



    const montantVerse =
      Number(montant);



    if (
      isNaN(montantVerse)
      ||
      montantVerse <= 0
    ) {

      Alert.alert(
        "Erreur",
        "Montant invalide"
      );

      return;

    }



    const reste =
      selectedMembre.montantCotisation
      -
      selectedMembre.totalVerse;



    if (montantVerse > reste) {


      Alert.alert(
        "Erreur",
        "Le montant dépasse le reste à payer"
      );


      return;

    }




    try {


      setLoading(true);



      const response =
        await fetch(

          `${API_BASE_URL}/cotisations`,

          {

            method:"POST",

            headers:{

              "Content-Type":
              "application/json"

            },


            body:JSON.stringify({

              membreId:
              selectedMembre.id,


              montant:
              montantVerse,


              dateVersement:
              new Date()
              .toISOString()


            })


          }

        );




      if (!response.ok) {


        throw new Error(
          "Erreur enregistrement"
        );


      }





      Alert.alert(
        "Succès",
        "Versement enregistré avec succès"
      );



      setMontant("");

      setSelectedMembre(null);


      chargerMembres();



    } catch(error:any) {


      Alert.alert(

        "Erreur",

        error.message ||
        "Impossible d'enregistrer"

      );


    } finally {


      setLoading(false);


    }


  };






  const afficherMembre =
  ({item}:{item:Membre}) => (


    <TouchableOpacity

      style={

        [

          styles.card,

          selectedMembre?.id === item.id

          ?

          styles.selected

          :

          null

        ]

      }


      onPress={()=>
        setSelectedMembre(item)
      }


    >


      <Text style={styles.nom}>

        {item.nom}

      </Text>



      <Text>

        Téléphone :
        {item.telephone}

      </Text>



      <Text>

        Cotisation :
        {item.montantCotisation}
        FCFA

      </Text>




      <Text>

        Total versé :
        {item.totalVerse}
        FCFA

      </Text>




      <Text>

        Reste :

        {
          item.montantCotisation
          -
          item.totalVerse
        }

        FCFA

      </Text>



    </TouchableOpacity>


  );







  return (

    <View style={styles.container}>


      <Text style={styles.title}>

        Versement tontine

      </Text>




      {

        loading &&

        <ActivityIndicator
          size="large"
        />

      }





      <FlatList

        data={membres}

        keyExtractor={
          (item)=>
          item.id.toString()
        }

        renderItem={afficherMembre}

      />






      {

        selectedMembre &&

        <View style={styles.form}>


          <Text style={styles.subtitle}>

            Membre :

            {selectedMembre.nom}

          </Text>




          <TextInput

            style={styles.input}

            placeholder="Montant du versement"

            keyboardType="numeric"

            value={montant}

            onChangeText={setMontant}

          />





          <TouchableOpacity

            style={styles.button}

            onPress={enregistrerVersement}

          >


            <Text style={styles.buttonText}>

              Enregistrer le versement

            </Text>


          </TouchableOpacity>




        </View>


      }





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

fontSize:24,

fontWeight:"bold",

marginBottom:15

},


card:{

padding:15,

backgroundColor:"#f2f2f2",

borderRadius:10,

marginBottom:10

},


selected:{

borderWidth:2,

borderColor:"green"

},


nom:{

fontSize:18,

fontWeight:"bold"

},


form:{

marginTop:15

},


subtitle:{

fontSize:17,

marginBottom:10

},


input:{

borderWidth:1,

borderColor:"#ccc",

borderRadius:8,

padding:12,

marginBottom:10

},


button:{

backgroundColor:"#008000",

padding:15,

borderRadius:10,

alignItems:"center"

},


buttonText:{

color:"#fff",

fontWeight:"bold"

}


});