import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@metrocoop/shared/stores/authStore';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Selamat datang,</Text>
      <Text style={styles.name}>{user?.namaLengkap || 'Pengguna'}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dashboard</Text>
        <Text style={styles.cardText}>Halaman utama akan segera hadir.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5' },
  greeting: { fontSize: 16, color: '#666' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#666' },
});
