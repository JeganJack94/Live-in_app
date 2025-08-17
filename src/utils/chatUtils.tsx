import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { db } from '../firebase/Firebase';

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: number;
  senderId: string;
  senderName: string;
}

export const sendMessage = async (chatRoomId: string, message: string, user: { uid: string; name: string }) => {
  const chatRef = ref(db, `chats/${chatRoomId}/messages`);
  await push(chatRef, {
    message,
    timestamp: serverTimestamp(),
    senderId: user.uid,
    senderName: user.name
  });
};

export const listenToMessages = (chatRoomId: string, callback: (messages: ChatMessage[]) => void) => {
  const chatRef = ref(db, `chats/${chatRoomId}/messages`);
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
