import { initAuthStore } from '@metrocoop/shared/stores/authStore';
import { WebStorageAdapter } from '@metrocoop/shared/api/storage';

const webStorage = new WebStorageAdapter();
initAuthStore(webStorage);

export { api, setToken, getToken, login } from '@metrocoop/shared/api/client';
export type { WebStorageAdapter } from '@metrocoop/shared/api/storage';
