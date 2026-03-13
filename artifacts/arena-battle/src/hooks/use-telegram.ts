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
          const { initData } = retrieveLaunchParams();
          if (initData?.user) {
            setUser({
              id: initData.user.id,
              firstName: initData.user.firstName,
              lastName: initData.user.lastName,
              username: initData.user.username,
              photoUrl: initData.user.photoUrl,
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
