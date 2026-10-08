import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Membre {
  id: string;
  nom: string;
  telephone: string;
}

// 🔥 BACKEND
const API_URL = "http://192.168.1.101:8080";

export default function CotisationScreen() {

  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedMembreId, setSelectedMembreId] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [montant, setMontant] = useState<string>('');

  const [dateLimite, setDateLimite] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const [estEnRetard, setEstEnRetard] = useState<boolean>(false);
  const [amende, setAmende] = useState<string>('');

  // =========================
  // CHARGER MEMBRES
  // =========================
  useEffect(() => {
    const chargerMembres = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/membres`);
        const data = await response.json();

        setMembres(data);
      } catch {
        Alert.alert("Erreur", "Impossible de charger les membres");
      } finally {
        setLoading(false);
      }
    };

    chargerMembres();
  }, []);

  // =========================
  // SELECT MEMBRE
  // =========================
  const handleMembreChange = (id: string) => {
    setSelectedMembreId(id);

    const membre = membres.find(m => m.id === id);
    setTelephone(membre ? membre.telephone : '');
  };

  // =========================
  // DATE CHANGE
  // =========================
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateLimite;
    setShowDatePicker(Platform.OS === 'ios');
    setDateLimite(currentDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setEstEnRetard(currentDate < today);

    if (currentDate >= today) {
      setAmende('');
    }
  };

  // =========================
  // ENREGISTRER COTISATION
  // =========================
  const enregistrerCotisation = async () => {
    if (!selectedMembreId || !montant) {
      Alert.alert("Erreur", "Remplis tous les champs");
      return;
    }

    try {
      const payload = {
        membreId: selectedMembreId,
        montant,
        dateLimite,
        amende: estEnRetard ? amende : "0"
      };

      await fetch(`${API_URL}/cotisations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      Alert.alert("Succès", "Cotisation enregistrée !");
    } catch {
      Alert.alert("Erreur", "Échec enregistrement");
    }
  };

  // =========================
  // NOTIFICATIONS
  // =========================
  const envoyerNotification = (type: 'SMS' | 'WhatsApp') => {

    const membre = membres.find(m => m.id === selectedMembreId);

    if (!membre || !montant) {
      Alert.alert("Erreur", "Sélectionne un membre et un montant");
      return;
    }

    let message =
      `Bonjour ${membre.nom}\n` +
      `Montant: ${montant} FCFA\n` +
      `Date limite: ${dateLimite.toLocaleDateString()}\n`;

    if (estEnRetard && amende) {
      message += `Amende: ${amende} FCFA\n`;
    }

    Alert.alert(`Envoi ${type}`, message);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Gestion Cotisation</Text>

      {/* MEMBRES */}
      <Text>Membre</Text>
      <Picker
        selectedValue={selectedMembreId}
        onValueChange={handleMembreChange}
      >
        <Picker.Item label="Sélectionner" value="" />
        {membres.map(m => (
          <Picker.Item key={m.id} label={m.nom} value={m.id} />
        ))}
      </Picker>

      {/* TELEPHONE */}
      <Text>Téléphone</Text>
      <TextInput value={telephone} editable={false} style={styles.input} />

      {/* MONTANT */}
      <Text>Montant</Text>
      <TextInput
        value={montant}
        onChangeText={setMontant}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* DATE */}
      <Text>Date limite</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.date}>
          {dateLimite.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateLimite}
          mode="date"
          onChange={onDateChange}
        />
      )}

      {/* RETARD */}
      {estEnRetard && (
        <View style={styles.warning}>
          <Text>⚠️ Retard détecté</Text>

          <TextInput
            placeholder="Amende"
            value={amende}
            onChangeText={setAmende}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      )}

      {/* ENREGISTRER */}
      <TouchableOpacity style={styles.btn} onPress={enregistrerCotisation}>
        <Text style={styles.btnText}>Enregistrer</Text>
      </TouchableOpacity>

      {/* NOTIFICATIONS */}
      <Text style={styles.subtitle}>Notifications</Text>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.sms}
          onPress={() => envoyerNotification('SMS')}
        >
          <Text style={styles.btnText}>SMS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whatsapp}
          onPress={() => envoyerNotification('WhatsApp')}
        >
          <Text style={styles.btnText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  },

  date: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc'
  },

  warning: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    marginTop: 10
  },

  btn: {
    backgroundColor: '#2563EB',
    padding: 15,
    marginTop: 20,
    alignItems: 'center'
  },

  btnText: { color: '#fff', fontWeight: 'bold' },

  sms: {
    backgroundColor: '#059669',
    padding: 15,
    flex: 1,
    marginRight: 5,
    alignItems: 'center'
  },

  whatsapp: {
    backgroundColor: '#16A34A',
    padding: 15,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center'
  },

  subtitle: {
    marginTop: 20,
    fontWeight: 'bold'
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});