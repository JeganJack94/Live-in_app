import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonSpinner,
  IonIcon,
  IonModal,
  IonToast,
  IonButton
} from '@ionic/react';
import { 
  sendOutline,
  trashOutline,
  chevronBackOutline
} from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { UserContext } from '../context/UserContext';
import { 
  sendMessage, 
  listenToMessages, 
  clearChat 
} from '../utils/chatUtils';
import { 
  subscribeToUserStatus, 
  updateTypingStatus, 
  subscribeToTypingStatus
} from '../firebase/NotificationService';

// Initialize keyboard plugin for native platforms
if (Capacitor.isNativePlatform()) {
  Keyboard.setAccessoryBarVisible({ isVisible: false });
  Keyboard.setResizeMode({ mode: KeyboardResize.Body });
}
import { 
  sendChatNotification,
  initializeNotifications 
} from '../firebase/chatNotifications';

import './Chat.css';

interface Message {
  id: string;
  message: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  isRead?: boolean;
}

const getChatRoomId = (userId: string, partnerId: string) => {
  // Sort IDs to ensure consistent chat room ID regardless of who initiates
  const sortedIds = [userId, partnerId].sort();
  return `${sortedIds[0]}-${sortedIds[1]}`;
};

const Chat: React.FC = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get partner's info
  const partner = user?.uid === 'userA-uid' 
    ? { name: 'Jegan', img: '/Jegan.jpg', id: 'userB-uid' }
    : { name: 'Revathy', img: '/Revathy.jpeg', id: 'userA-uid' };
    
  // Generate chat room ID
  const chatRoomId = user?.uid && partner.id ? getChatRoomId(user.uid, partner.id) : '';

  useEffect(() => {
    if (!user?.uid || !chatRoomId) return;

    // Initialize notifications for both web and mobile platforms
    initializeNotifications(user.uid);

    // Get partner's ID
    const partnerId = user.uid === 'userA-uid' ? 'userB-uid' : 'userA-uid';

    // Listen to messages in the chat room
    const messageUnsubscribe = listenToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
    });

    // Subscribe to partner's online status
    const onlineUnsubscribe = subscribeToUserStatus(partnerId, (isOnline) => {
      setIsPartnerOnline(isOnline);
    });

    // Subscribe to partner's typing status
    const typingUnsubscribe = subscribeToTypingStatus(user.uid, partnerId, (isTyping) => {
      setIsPartnerTyping(isTyping);
    });

    return () => {
      messageUnsubscribe();
      onlineUnsubscribe();
      typingUnsubscribe();
    };

    // Note: The notification unsubscribe is handled in the requestNotificationPermission().then() callback
  }, [user?.uid, chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    contentRef.current?.scrollToBottom(500);
  };

  const handleSend = async () => {
    if (input.trim() && user) {
      try {
        // Send message
        await sendMessage(chatRoomId, input.trim(), user);
        
        // Send notification only if there's a valid message and user
        if (partner?.id) {
          await sendChatNotification(partner.id, user.name || '', input.trim());
        }
        
        // Clear typing status
        if (partner?.id) {
          await updateTypingStatus(user.uid, partner.id, false);
        }
        
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (user) {
      const partnerId = user.uid === 'userA-uid' ? 'userB-uid' : 'userA-uid';
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set typing status to true
      updateTypingStatus(user.uid, partnerId, true);

      // Set timeout to clear typing status
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(user.uid, partnerId, false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClearChat = async () => {
    if (!chatRoomId) {
      console.error('No chat room ID available');
      setShowConfirmClear(false);
      return;
    }

    try {
      await clearChat(chatRoomId);
      setMessages([]); // Clear messages locally
      setShowConfirmClear(false);
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error clearing chat:', error);
      setShowConfirmClear(false);
      setShowErrorToast(true);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <IonModal
        isOpen={showConfirmClear}
        onDidDismiss={() => setShowConfirmClear(false)}
      >
        <div className="p-6 bg-white rounded-lg shadow-xl max-w-sm mx-auto mt-20">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <IonIcon icon={trashOutline} className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Chat History</h3>
            <p className="text-gray-600">Are you sure you want to clear all chat messages? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <IonButton 
              fill="outline" 
              color="medium"
              onClick={() => setShowConfirmClear(false)}
            >
              Cancel
            </IonButton>
            <IonButton 
              color="danger"
              onClick={handleClearChat}
            >
              Delete
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Success Toast */}
      <IonToast
        isOpen={showSuccessToast}
        onDidDismiss={() => setShowSuccessToast(false)}
        message="Chat history has been cleared successfully"
        duration={2000}
        color="success"
        position="top"
      />

      <IonPage className="chat-page">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <button 
              onClick={() => window.history.back()}
              className="p-2 text-white hover:bg-white/10 rounded-full mr-2"
            >
              <IonIcon icon={chevronBackOutline} className="w-6 h-6" />
            </button>
            <div className="relative">
              <img 
                src={partner.img} 
                alt={partner.name} 
                className="profile-image"
              />
              <span 
                className={`online-indicator ${isPartnerOnline ? 'online' : 'offline'}`}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{partner.name}</h2>
              <span className="text-xs opacity-90">
                {isPartnerOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <button 
              onClick={() => setShowConfirmClear(true)}
              className="clear-chat-button ml-auto"
              title="Clear chat history"
            >
              <IonIcon icon={trashOutline} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <IonContent ref={contentRef} scrollEvents={true}>
          <div className="message-container">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <IonSpinner name="dots" />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className="message-bubble-wrapper">
                    <div 
                      className={`message-bubble ${
                        msg.senderId === user?.uid ? 'sender-message' : 'receiver-message'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isPartnerTyping && (
                  <div className="typing-indicator">
                    {partner.name} is typing...
                  </div>
                )}
              </>
            )}
          </div>
        </IonContent>

        {/* Input Container */}
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              if (Capacitor.isNativePlatform()) {
                Keyboard.addListener('keyboardWillShow', () => {
                  contentRef.current?.scrollToBottom(300);
                });
              }
            }}
            onBlur={() => {
              if (Capacitor.isNativePlatform()) {
                Keyboard.removeAllListeners();
              }
            }}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button 
            onClick={handleSend}
            className="send-button"
            disabled={!input.trim()}
          >
            <IonIcon icon={sendOutline} />
          </button>
        </div>

        {/* Confirm Clear Modal */}
        <IonModal
          isOpen={showConfirmClear}
          onDidDismiss={() => setShowConfirmClear(false)}
          className="confirm-modal"
        >
          <div className="modal-content">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <IonIcon icon={trashOutline} className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Chat History</h3>
              <p className="text-gray-600">Are you sure you want to clear all chat messages? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <IonButton 
                fill="outline" 
                color="medium"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </IonButton>
              <IonButton 
                color="danger"
                onClick={handleClearChat}
              >
                Delete
              </IonButton>
            </div>
          </div>
        </IonModal>

        {/* Success Toast */}
        <IonToast
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message="Chat history has been cleared successfully"
          duration={2000}
          color="success"
          position="top"
        />

        {/* Error Toast */}
        <IonToast
          isOpen={showErrorToast}
          onDidDismiss={() => setShowErrorToast(false)}
          message="Could not clear the chat history. Please check your connection and try again."
          duration={3000}
          color="danger"
          position="top"
          buttons={[
            {
              text: 'Dismiss',
              role: 'cancel',
            }
          ]}
        />
      </IonPage>
                  {isPartnerTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2 text-xs text-gray-500 animate-pulse">
                        {partner.name} is typing...
                      </div>
                    </div>
                  )}
                </>
              )}
 

export default Chat;
