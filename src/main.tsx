import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApplicationProviders } from '@/app';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationProviders />
  </StrictMode>,
);
