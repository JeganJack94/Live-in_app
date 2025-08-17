import { getMessaging, getToken, isSupported, Messaging } from 'firebase/messaging';
import { 
  ref, 
  set,  
  onValue, 
  serverTimestamp,
  push,
  update
} from 'firebase/database';
import { app, realtimeDb } from './Firebase';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Your web app's VAPID key from Firebase Console
const VAPID_KEY = 'BCbn6g3hdOULRqcy2TGrvBqIN7jnS03J-pyA0etLygpSYQX4YSUE9MUkMpthqci6cczqS0zZNWV5B-3JMFYEgNo';

// Initialize messaging if supported
let messaging: Messaging | null = null;
isSupported().then(isSupported => {
  if (isSupported) {
    messaging = getMessaging(app);
  }
});

// Helper function to store notification token
const storeNotificationToken = async (userId: string, fcmToken: string) => {
  try {
    await set(ref(realtimeDb, `users/${userId}/notifications`), {
      fcmToken,
      lastUpdated: serverTimestamp(),
      device: {
        platform: Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web',
        lastActive: serverTimestamp()
      }
    });
  } catch (error) {
    console.error('Error storing notification token:', error);
  }
};

export const initializeNotifications = async (userId: string) => {
  try {
    let token = null;

    if (Capacitor.isNativePlatform()) {
      // Request permission and register for push notifications on native platforms
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();

        // Add listeners for push notifications
        PushNotifications.addListener('registration', (tokenData) => {
          token = tokenData.value;
          // Store the token in the database
          storeNotificationToken(userId, token);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed:', notification);
        });
      }
    } else {
      // Web platform notification handling
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return null;
      }

      const isMessagingSupported = await isSupported();
      if (!isMessagingSupported) {
        console.log('Firebase Cloud Messaging is not supported in this browser');
        return null;
      }

      if (!messaging) {
        messaging = getMessaging(app);
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        token = await getToken(messaging, {
          vapidKey: VAPID_KEY
        });
        
        await storeNotificationToken(userId, token);
      }
    }

    return token;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};

export const sendChatNotification = async (recipientUserId: string, senderName: string, message: string) => {
  try {
    // Store notification in RTDB
    const notificationsRef = ref(realtimeDb, `notifications/${recipientUserId}`);
    const newNotificationRef = push(notificationsRef);
    
    await update(newNotificationRef, {
      title: senderName,
      body: message,
      type: 'chat',
      read: false,
      timestamp: serverTimestamp()
    });

    // Get recipient's token and trigger cloud function for push notification
    const recipientRef = ref(realtimeDb, `users/${recipientUserId}/notifications`);
    onValue(recipientRef, (snap) => {
      const data = snap.val();
      if (data?.fcmToken) {
        console.log('FCM token available for push notification');
      }
    }, { onlyOnce: true });
  } catch (error) {
    console.error('Error sending chat notification:', error);
  }
};

export const subscribeToUserStatus = (userId: string, callback: (isOnline: boolean) => void) => {
  const userStatusDatabaseRef = ref(realtimeDb, `status/${userId}`);
  
  const unsubscribe = onValue(userStatusDatabaseRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data?.state === 'online');
    } else {
      callback(false);
    }
  });

  return unsubscribe;
};

export const updateTypingStatus = async (userId: string, partnerId: string, isTyping: boolean) => {
  try {
    await set(ref(realtimeDb, `chats/${userId}_${partnerId}/typing`), {
      isTyping,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating typing status:', error);
  }
};

export const subscribeToTypingStatus = (userId: string, partnerId: string, callback: (isTyping: boolean) => void) => {
  const typingRef = ref(realtimeDb, `chats/${userId}_${partnerId}/typing`);
  
  const unsubscribe = onValue(typingRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data?.isTyping || false);
    } else {
      callback(false);
    }
  });

  return unsubscribe;
};
