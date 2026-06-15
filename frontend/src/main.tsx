import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);

