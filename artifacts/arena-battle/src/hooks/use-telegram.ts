import { useEffect, useState } from 'react';
import { init, retrieveLaunchParams, isTMA } from '@telegram-apps/sdk';

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isTMAEnv, setIsTMAEnv] = useState(false);

  useEffect(() => {
    const checkEnvAndInit = async () => {
      try {
        const isTMAEnvironment = await isTMA();
        setIsTMAEnv(isTMAEnvironment);

        if (isTMAEnvironment) {
          init();
          const launchParams = retrieveLaunchParams();
          const initData = (launchParams as any)?.initData;
          if (initData?.user) {
            const u = initData.user;
            setUser({
              id: u.id,
              firstName: u.first_name ?? u.firstName ?? '',
              lastName: u.last_name ?? u.lastName,
              username: u.username,
              photoUrl: u.photo_url ?? u.photoUrl,
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize Telegram SDK:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkEnvAndInit();
  }, []);

  return { isReady, user, isTMA: isTMAEnv };
}
