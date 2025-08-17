import { ref, push, serverTimestamp, onValue } from 'firebase/database';
import { realtimeDb } from './Firebase';
import { 
  initializePlatformNotifications, 
  setupPlatformNotificationListeners 
} from './platformNotifications';

interface NotificationData {
  userId: string;
  type: string;
  senderName: string;
  message: string;
  read: boolean;
  timestamp: number;
}

// Initialize notifications based on platform
export const initializeNotifications = async (userId: string) => {
  const token = await initializePlatformNotifications();
  if (token) {
    // Store the FCM token in the user's profile for later use
    const tokenRef = ref(realtimeDb, `users/${userId}/fcmToken`);
    await push(tokenRef, { token, timestamp: serverTimestamp() });
  }
  setupPlatformNotificationListeners();
  return token !== null;
};

// Send chat notification
export const sendChatNotification = async (
  recipientId: string, 
  senderName: string, 
  message: string
) => {
  try {
    // Add notification to Realtime Database
    const notificationsRef = ref(realtimeDb, `notifications/${recipientId}`);
    
    // Store notification in database
    const notificationData = {
      userId: recipientId,
      type: 'chat',
      senderName,
      message,
      read: false,
      timestamp: serverTimestamp()
    };
    
    await push(notificationsRef, notificationData);
  } catch (error) {
    console.error('Error sending chat notification:', error);
    // Don't throw the error to prevent breaking the chat flow
  }
};

// Listen for new notifications
export const listenToNotifications = (userId: string) => {
  const notificationsRef = ref(realtimeDb, `notifications/${userId}`);

  return onValue(notificationsRef, (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.val();
    const notifications = Object.entries(data)
      .sort(([, a], [, b]) => ((b as NotificationData).timestamp || 0) - 
                              ((a as NotificationData).timestamp || 0));

    if (notifications.length === 0) return;

    const [, latestNotification] = notifications[0] as [string, NotificationData];
    const now = Date.now();
    
    // Only process recent notifications (within last 5 seconds)
    if (latestNotification.timestamp && 
        (now - latestNotification.timestamp) < 5000) {
      setupPlatformNotificationListeners();
    }
  });
};
