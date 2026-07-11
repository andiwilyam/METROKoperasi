import * as SecureStore from 'expo-secure-store';
import { StorageAdapter } from '@metrocoop/shared/api/storage';

export class MobileStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    return SecureStore.getItem(key);
  }
  setItem(key: string, value: string): void {
    SecureStore.setItem(key, value);
  }
  removeItem(key: string): void {
    SecureStore.deleteItemAsync(key);
  }
}

export const mobileStorage = new MobileStorageAdapter();
