import React, { useState } from 'react';
import { FaMoon, FaBell } from 'react-icons/fa';
import NotificationsModal from '../components/NotificationsModal';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import ProgressCircle from '../components/ProgressCircle';
import AddTransactionModal from '../components/AddTransactionModal';

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Electricity bill paid', read: false },
    { id: 2, text: 'Groceries split request', read: false },
    { id: 3, text: 'Monthly report ready', read: true },
  ]);

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSaveTransaction = (data: { amount: string; category: string; partner: string; desc: string }) => {
    // TODO: Save transaction logic here
    // You can update state or send to backend
    console.log('Saved transaction:', data);
  };

  return (
    <IonPage>
  <IonContent className="ion-padding bg-gray-50 pb-24 pt-8">
  <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-lg text-gray-900">Live-in</div>
          <div className="flex items-center space-x-3">
            <button className="text-xl text-gray-400"><FaMoon /></button>
            <button className="relative text-xl text-gray-400" onClick={() => setShowNotif(true)}>
              <FaBell />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-7 h-7 rounded-full border-2 border-white" />
          </div>
        </div>
        <NotificationsModal
          isOpen={showNotif}
          onClose={() => setShowNotif(false)}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onClearAll={handleClearAll}
        />
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Good Morning!</h2>
              <p className="text-gray-500 text-sm">Track your finances together</p>
            </div>
            <div className="flex -space-x-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Marcus" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
          </div>
        </div>
  <div className="space-y-6 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-500">Needs</div>
              <div className="text-2xl font-bold text-red-500">₹2,450</div>
              <div className="text-sm text-gray-400">50% of income</div>
            </div>
            <ProgressCircle percent={75} color="#ef4444" label="75%" size={56} />
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-500">Wants</div>
              <div className="text-2xl font-bold text-purple-500">₹1,470</div>
              <div className="text-sm text-gray-400">30% of income</div>
            </div>
            <ProgressCircle percent={60} color="#a78bfa" label="60%" size={56} />
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-500">Savings</div>
              <div className="text-2xl font-bold text-yellow-500">₹980</div>
              <div className="text-sm text-gray-400">20% of income</div>
            </div>
            <ProgressCircle percent={85} color="#eab308" label="85%" size={56} />
          </div>
        </div>
        <div className="mb-24">
          <div className="font-bold text-gray-900 mb-2">Recent Transactions</div>
          <div className="space-y-3">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-3">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah" className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">₹45.00</div>
                <div className="text-xs text-gray-500">Groceries<br />Today</div>
              </div>
            </div>
            <div className="flex items-center bg-white rounded-lg shadow-sm p-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <span className="font-bold text-gray-500">₹</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">₹120.00</div>
                <div className="text-xs text-gray-500">Other<br />Today</div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="fixed bottom-24 right-6 bg-pink-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl z-20"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
        <AddTransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTransaction}
        />
        <BottomTab />
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
