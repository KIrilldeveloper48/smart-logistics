import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/configure-mobx';
import { ApplicationProviders } from '@/app';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationProviders />
  </StrictMode>,
);
