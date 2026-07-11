import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '@metrocoop/shared/stores/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.infoCard}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{user?.namaLengkap || '-'}</Text>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user?.username || '-'}</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role || '-'}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 24 },
  label: { fontSize: 12, color: '#666', marginTop: 12, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500' },
  logoutButton: { backgroundColor: '#dc2626', padding: 16, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
