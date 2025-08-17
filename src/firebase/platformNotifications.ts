/// <reference lib="webworker" />

import { Capacitor } from '@capacitor/core';
import { 
  PushNotifications,
  ActionPerformed,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from './Firebase';

// Your web app's VAPID key from Firebase Console
const VAPID_KEY = 'BCbn6g3hdOULRqcy2TGrvBqIN7jnS03J-pyA0etLygpSYQX4YSUE9MUkMpthqci6cczqS0zZNWV5B-3JMFYEgNo';

export const initializePlatformNotifications = async (): Promise<string | null> => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Request permission and register for Android
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();

        // Return the FCM token when available
        return new Promise((resolve) => {
          PushNotifications.addListener('registration', (token: Token) => {
            resolve(token.value);
          });

          PushNotifications.addListener('registrationError', (err) => {
            console.error('Registration error: ', err.error);
            resolve(null);
          });
        });
      }
    } else {
      // Web browser notifications
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return null;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        // Get FCM token for web
        const messaging = getMessaging(app);
        return await getToken(messaging, { vapidKey: VAPID_KEY });
      }
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
  return null;
};

export const setupPlatformNotificationListeners = () => {
  if (Capacitor.isNativePlatform()) {
    // Setup Android notification listeners
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // Handle notification when app is in foreground
        console.log('Push notification received: ', notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // Handle notification when user taps on it
        console.log('Push notification action performed: ', notification);
      }
    );
  } else {
    // Web browser notification handling stays the same
    if (Notification.permission === 'granted') {
      navigator.serviceWorker?.ready.then(registration => {
        registration.addEventListener('push', (event: Event) => {
          // Type guard for push events
          if (event instanceof PushEvent && event.data) {
            try {
              const payload = event.data.json();
              if (payload && payload.title) {
                registration.showNotification(payload.title, {
                  body: payload.body || '',
                  icon: '/favicon.ico',
                  badge: '/favicon.ico'
                });
              }
            } catch (error) {
              console.error('Error processing push notification:', error);
            }
          }
        });
      });
    }
  }
};
