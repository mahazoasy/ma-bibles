import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page introuvable</Text>
      <Link href="/(tabs)/home" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef7e8' },
  title: { fontSize: 24, marginBottom: 20, color: '#8b5a2b' },
  button: { backgroundColor: '#8b5a2b', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16 },
});
