import React, { useState, useContext, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import ChatMessage from '../components/ChatMessage';
import { UserContext } from '../context/UserContext';
import { sendMessage, listenToMessages, ChatMessage as IChatMessage } from '../utils/chatUtils';



const chatRoomId = 'userA-userB';

const Chat: React.FC = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    // Listen to messages in the static chat room
    const unsubscribe = listenToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    contentRef.current?.scrollToBottom(500);
  };

  const handleSend = async () => {
    if (input.trim() && user) {
      try {
        await sendMessage(chatRoomId, input.trim(), user);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <IonPage>
      <IonContent ref={contentRef} className="ion-padding top-10 bg-gray-50" scrollEvents={true}>
        <div className="flex flex-col h-full max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm">
            <div className="font-bold text-lg text-gray-900">Chat</div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-green-500">Online</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <IonSpinner name="dots" />
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  timestamp={msg.timestamp}
                  senderId={msg.senderId}
                  senderName={msg.senderName}
                  currentUserId={user?.uid || ''}
                />
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="sticky bottom-20 bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-pink-600 transition-colors"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <BottomTab />
      </IonContent>
    </IonPage>
  );
};

export default Chat;
