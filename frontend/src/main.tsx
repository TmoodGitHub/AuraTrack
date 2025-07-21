import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import './index.css';
import App from './App.tsx';
import client from './graphql/apolloClient.ts';

import { AuthProvider } from './context/AuthContext.tsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <>
            <Toaster position='top-right' />
            <App />
          </>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
