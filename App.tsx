import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmf8UXcyu57kyyb5yQGZ0b6FC6fwPFL5o",
  authDomain: "ecoapp-cbbbe.firebaseapp.com",
  projectId: "ecoapp-cbbbe",
  storageBucket: "ecoapp-cbbbe.firebasestorage.app",
  messagingSenderId: "653922869455",
  appId: "1:653922869455:web:46d4e4529c6258919ed7ba",
  measurementId: "G-RWZCTYXDJK"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // If Firebase is already initialized
}

const db = firebase.firestore();

const App: React.FC = () => {
  const [activity, setActivity] = useState<string>('');
  const [emissions, setEmissions] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);

  const logActivity = async () => {
    // Example: Calculate emissions (simplified)
    const emissionsValue = parseFloat(activity) * 0.2; // 0.2 kg CO2 per unit
    setEmissions(emissionsValue);

    // Save to Firestore
    const user = firebase.auth().currentUser;
    if (user) {
      await db.collection('users').doc(user.uid).collection('activities').add({
        activity: activity,
        emissions: emissionsValue,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Update points (1 point per kg CO2 saved)
      const newPoints = points + Math.round(emissionsValue);
      setPoints(newPoints);
      await db.collection('users').doc(user.uid).update({ points: newPoints });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eco Gamified App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter activity (e.g., km driven)"
        value={activity}
        onChangeText={setActivity}
        keyboardType="numeric"
      />
      <Button title="Log Activity" onPress={logActivity} />
      <Text style={styles.result}>Estimated Emissions: {emissions.toFixed(2)} kg CO2</Text>
      <Text style={styles.result}>Your Points: {points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;