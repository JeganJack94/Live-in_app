import React from 'react';

interface ChatMessageProps {
  message: string;
  time: string;
  isUser?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, time, isUser }) => {
  return (
    <div className={`flex flex-col items-${isUser ? 'end' : 'start'} mb-2`}>
      <div className={`${isUser ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl px-4 py-2 max-w-xs text-sm font-medium`}>
        {message}
      </div>
      <span className={`text-xs mt-1 ${isUser ? 'text-pink-400' : 'text-gray-400'}`}>{time}</span>
    </div>
  );
};

export default ChatMessage;
