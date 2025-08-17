import { ref, push, onValue, serverTimestamp, remove, get } from 'firebase/database';
import { realtimeDb } from '../firebase/Firebase';

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: number;
  senderId: string;
  senderName: string;
}

export const sendMessage = async (chatRoomId: string, message: string, user: { uid: string; name: string }) => {
  const chatRef = ref(realtimeDb, `chats/${chatRoomId}/messages`);
  await push(chatRef, {
    message,
    timestamp: serverTimestamp(),
    senderId: user.uid,
    senderName: user.name
  });
};

export const listenToMessages = (chatRoomId: string, callback: (messages: ChatMessage[]) => void) => {
  const chatRef = ref(realtimeDb, `chats/${chatRoomId}/messages`);
  return onValue(chatRef, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      messages.push({
        id: childSnapshot.key || '',
        ...message,
      });
    });
    callback(messages.sort((a, b) => a.timestamp - b.timestamp));
  });
};

export const clearChat = async (chatRoomId: string) => {
  if (!chatRoomId) {
    throw new Error('Chat room ID is required');
  }

  try {
    // First verify the ref exists
    const chatRef = ref(realtimeDb, `chats/${chatRoomId}/messages`);
    
    // Remove the messages
    await remove(chatRef);
    
    // Verify deletion
    const verifyRef = ref(realtimeDb, `chats/${chatRoomId}/messages`);
    const snapshot = await get(verifyRef);
    
    if (snapshot.exists()) {
      throw new Error('Failed to clear messages');
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing chat:', error);
    throw error;
  }
};
