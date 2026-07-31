import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/configure-mobx';
import { ApplicationProviders } from '@/app';
import './index.css';

const renderApplication = (): void => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ApplicationProviders />
    </StrictMode>,
  );
};

const bootstrapApplication = async (): Promise<void> => {
  if (import.meta.env.DEV) {
    const { enableDevelopmentMocks } = await import('@/app/msw');

    await enableDevelopmentMocks();
  }

  renderApplication();
};

void bootstrapApplication();
