import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Tambah ini

const queryClient = new QueryClient(); // Tambah ini

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Bungkus di sini */}
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);