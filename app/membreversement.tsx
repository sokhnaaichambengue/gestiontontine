// app/membre-versement.tsx

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";


const API_BASE_URL = "http://192.168.1.101:8080";



interface Versement {

  nom: string;

  telephone: string;

  montantTotal: number;

  totalVerse: number;

  reste: number;

  statut: string;

}




export default function MembreVersement(){


  const [versement,setVersement] =
    useState<Versement | null>(null);


  const [loading,setLoading] =
    useState(true);





  // Récupérer les informations du membre connecté

  const chargerVersement = async()=>{


    try{


      setLoading(true);



      const response =
        await fetch(
          `${API_BASE_URL}/membre/versement`
        );



      if(!response.ok){

        throw new Error();

      }




      const data:Versement =
        await response.json();



      setVersement(data);



    }catch{


      Alert.alert(
        "Erreur",
        "Impossible de charger vos versements"
      );



    }finally{


      setLoading(false);


    }


  };






  useEffect(()=>{


    chargerVersement();


  },[]);







  if(loading){


    return (

      <View style={styles.center}>

        <ActivityIndicator size="large"/>

      </View>

    );


  }







  if(!versement){


    return (

      <View style={styles.center}>

        <Text>
          Aucun versement trouvé
        </Text>

      </View>

    );


  }







  return (


    <View style={styles.container}>


      <Text style={styles.title}>

        Mes versements

      </Text>





      <View style={styles.card}>


        <Text style={styles.nom}>

          {versement.nom}

        </Text>



        <Text>

          Téléphone :
          {versement.telephone}

        </Text>



      </View>







      <View style={styles.card}>


        <Text>

          💰 Montant à payer

        </Text>


        <Text style={styles.value}>

          {versement.montantTotal} FCFA

        </Text>



      </View>







      <View style={styles.card}>


        <Text>

          ✅ Déjà versé

        </Text>


        <Text style={styles.value}>

          {versement.totalVerse} FCFA

        </Text>



      </View>







      <View style={styles.card}>


        <Text>

          📌 Reste à payer

        </Text>


        <Text style={styles.value}>

          {versement.reste} FCFA

        </Text>



      </View>








      <View style={styles.card}>


        <Text>

          Statut

        </Text>


        <Text

          style={[

            styles.status,

            versement.statut === "Payé"

            ?

            styles.paye

            :

            versement.statut === "Retard"

            ?

            styles.retard

            :

            styles.attente

          ]}

        >

          {versement.statut}


        </Text>



      </View>







    </View>


  );


}







const styles = StyleSheet.create({



container:{

flex:1,

padding:20,

backgroundColor:"#fff"

},



center:{

flex:1,

justifyContent:"center",

alignItems:"center"

},



title:{

fontSize:24,

fontWeight:"bold",

marginBottom:20

},




card:{

backgroundColor:"#f1f1f1",

padding:15,

borderRadius:10,

marginBottom:12

},




nom:{

fontSize:20,

fontWeight:"bold"

},




value:{

fontSize:18,

fontWeight:"bold",

marginTop:5

},




status:{

fontSize:18,

fontWeight:"bold",

marginTop:5

},




paye:{

color:"green"

},




attente:{

color:"orange"

},




retard:{

color:"red"

}



});