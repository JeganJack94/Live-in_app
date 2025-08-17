import React from 'react';

interface ChatMessageProps {
  message: string;
  timestamp: number;
  senderId: string;
  senderName: string;
  currentUserId: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, timestamp, senderId, senderName, currentUserId }) => {
  const isUser = senderId === currentUserId;
  const time = new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-2`}>
      {!isUser && <span className="text-xs text-gray-500 ml-2 mb-1">{senderName}</span>}
      <div className={`${isUser ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2 max-w-xs text-sm font-medium`}>
        {message}
      </div>
      <span className={`text-xs mt-1 ${isUser ? 'text-pink-400' : 'text-gray-400'}`}>{time}</span>
    </div>
  );
};

export default ChatMessage;
