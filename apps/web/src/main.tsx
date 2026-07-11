import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { WebStorageAdapter } from '@metrocoop/shared/api/storage';
import { initAuthStore } from '@metrocoop/shared/stores/authStore';
import App from './App.tsx';
import './index.css';

initAuthStore(new WebStorageAdapter());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
