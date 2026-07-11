import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { initApiClient } from '@metrocoop/shared/api/client';
import { initAuthStore } from '@metrocoop/shared/stores/authStore';
import { mobileStorage } from './src/storageAdapter';
import AppNavigator from './src/navigation/AppNavigator';

function getApiBase(): string {
  const fromProcess = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE) || '';
  if (fromProcess) return fromProcess;
  const extra = (Constants.expoConfig as any)?.extra || (Constants.manifest2 as any)?.extra || (Constants.manifest as any)?.extra;
  return (extra?.EXPO_PUBLIC_API_BASE as string) || '';
}

const API_BASE = getApiBase();
initApiClient(mobileStorage, API_BASE);
initAuthStore(mobileStorage);

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
