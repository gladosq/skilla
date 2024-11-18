import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import '@/styles/global.scss';
import '@/styles/font-family.scss';
import '@/styles/libs.scss';
import Providers from '@/providers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App/>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
