export const enableDevelopmentMocks = async (): Promise<void> => {
  if (!import.meta.env.DEV) {
    return;
  }

  const { mswBrowserWorker } = await import('./msw-browser-worker');

  await mswBrowserWorker.start({ onUnhandledRequest: 'bypass' });
};
