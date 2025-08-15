import React from 'react';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import { IonModal } from '@ionic/react';

interface Notification {
  id: number;
  text: string;
  read: boolean;
}

const NotificationsModal = ({ isOpen, onClose, notifications, onMarkRead, onClearAll }: {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onClearAll: () => void;
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="!bg-transparent">
      <div className="bg-white rounded-t-2xl shadow-lg p-6 max-w-md mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900">Notifications</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">×</button>
        </div>
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-400 text-center">No notifications</div>
          ) : notifications.map(n => (
            <div key={n.id} className={`flex items-center justify-between p-3 rounded-lg ${n.read ? 'bg-gray-100' : 'bg-pink-50'}`}>
              <span className={`flex-1 text-sm ${n.read ? 'text-gray-400' : 'text-gray-900 font-semibold'}`}>{n.text}</span>
              {!n.read && (
                <button onClick={() => onMarkRead(n.id)} className="ml-2 text-green-500"><FaCheckCircle /></button>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClearAll} className="bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center"><FaTrash className="mr-2" />Clear All</button>
        </div>
      </div>
    </IonModal>
  );
};

export default NotificationsModal;
