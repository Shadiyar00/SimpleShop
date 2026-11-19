import { useEffect, useState } from 'react';
import { invalidateProducts } from '../lib/queryClient';

export default function usePwa() {
  const [online, setOnline] = useState(navigator.onLine);
  const [update, setUpdate] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const onConnection = () => setOnline(navigator.onLine);
    const onInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => setInstallPrompt(null);
    window.addEventListener('online', onConnection);
    window.addEventListener('offline', onConnection);
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    const workers = navigator.serviceWorker;
    let cleanupWorker = () => {};

    if (import.meta.env.PROD && workers) {
      let registration;
      let installing;
      let disposed = false;
      let hadController = Boolean(workers.controller);
      const onController = () => {
        if (hadController) window.location.reload();
        else invalidateProducts();
        hadController = true;
      };
      const onState = () => {
        if (registration.waiting && workers.controller) setUpdate(registration.waiting);
      };
      const watch = () => {
        installing?.removeEventListener('statechange', onState);
        installing = registration.installing;
        installing?.addEventListener('statechange', onState);
        onState();
      };
      const checkForUpdate = () => {
        if (document.visibilityState === 'visible' && navigator.onLine) {
          registration?.update().catch(() => {});
        }
      };

      workers.addEventListener('controllerchange', onController);
      document.addEventListener('visibilitychange', checkForUpdate);
      window.addEventListener('online', checkForUpdate);
      const interval = window.setInterval(checkForUpdate, 60_000);

      workers.register('/sw.js', { updateViaCache: 'none' }).then((result) => {
        if (disposed) return;
        registration = result;
        registration.addEventListener('updatefound', watch);
        watch();
      }).catch((error) => console.error('Service worker registration failed.', error));

      cleanupWorker = () => {
        disposed = true;
        window.clearInterval(interval);
        workers.removeEventListener('controllerchange', onController);
        document.removeEventListener('visibilitychange', checkForUpdate);
        window.removeEventListener('online', checkForUpdate);
        registration?.removeEventListener('updatefound', watch);
        installing?.removeEventListener('statechange', onState);
      };
    }
    return () => {
      cleanupWorker();
      window.removeEventListener('online', onConnection);
      window.removeEventListener('offline', onConnection);
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    setInstallPrompt(null);
    try {
      await installPrompt.prompt();
    } catch (error) {
      console.warn('Could not open the install prompt.', error);
    }
  }

  return { online, update, installPrompt, install };
}
