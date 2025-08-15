import React, { useState, useContext, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { db } from '../firebase/Firebase';
import { ref, remove } from 'firebase/database';
import { addTransaction, listenTransactions, Transaction as SharedTransaction } from '../utils/transactionUtils';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import ProgressCircle from '../components/ProgressCircle';
import { categoryIcons } from '../utils/transactionUtils';
import AddTransactionModal from '../components/AddTransactionModal';

import { UserContext } from '../App';

interface ToastMessage {
  text: string;
  type: 'success' | 'error';
}

const Toast: React.FC<{ message: ToastMessage; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = message.type === 'success' ? 'bg-pink-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down`}>
      {message.text}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // ...existing code...

  // ...existing code...
  interface Transaction {
    id: string;
    amount: string;
    category: string;
    item: string;
    partner: string;
    desc: string;
    timestamp: number;
    addedBy: {
      name: string;
      uid: string;
    };
  }

  const [transactions, setTransactions] = useState<SharedTransaction[]>([]);
  const coupleId = 'jegan-revathy'; // Replace with dynamic value as needed
  const [settings, setSettings] = useState({ needs: 50, wants: 30, savings: 20, incomeA: '', incomeB: '' });

  const handleDeleteTransaction = async (transactionId: string, addedByUid: string) => {
    // Only allow deletion if the user created the transaction
    if (addedByUid !== user.uid) {
      setToast({ text: 'You can only delete your own transactions', type: 'error' });
      return;
    }
    try {
      const transactionRef = ref(db, `couples/${coupleId}/transactions/${transactionId}`);
      await remove(transactionRef);
      setToast({ text: 'Transaction deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setToast({ text: 'Failed to delete transaction', type: 'error' });
    }
  };

  const handleSaveTransaction = (data: { amount: string; category: string; item: string; partner: string; desc: string }) => {
    addTransaction(coupleId, {
      ...data,
      addedBy: {
        name: user.name,
        uid: user.uid,
      },
      timestamp: Date.now(),
    })
      .then(() => {
        setToast({ text: 'Transaction added successfully', type: 'success' });
      })
      .catch((error) => {
        console.error('Error saving transaction:', error);
        setToast({ text: 'Failed to save transaction', type: 'error' });
      });
  };

  useEffect(() => {
    // Listen for shared transactions
    listenTransactions(coupleId, (txList: SharedTransaction[]) => {
      setTransactions(
        txList
          .map((tx) => ({ ...tx, id: (tx as any).id || tx.timestamp }))
          .reverse()
      );
    });
    // Fetch settings for progress circles
    const settingsRef = ref(db, `users/${user.uid}/settings`);
    import('firebase/database').then(({ get }) => {
      get(settingsRef).then(snapshot => {
        const data = snapshot.val();
        if (data) setSettings(data);
      });
    });
  }, [user.uid]);
  // Calculate totals for progress circles
  const totalIncome = Number(settings.incomeA || 0) + Number(settings.incomeB || 0);
  const needsSpent = transactions.filter(tx => tx.category === 'Needs').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const wantsSpent = transactions.filter(tx => tx.category === 'Wants').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const savingsSpent = transactions.filter(tx => tx.category === 'Savings').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const needsPercent = totalIncome ? Math.round((needsSpent / (totalIncome * (settings.needs / 100))) * 100) : 0;
  const wantsPercent = totalIncome ? Math.round((wantsSpent / (totalIncome * (settings.wants / 100))) * 100) : 0;
  const savingsPercent = totalIncome ? Math.round((savingsSpent / (totalIncome * (settings.savings / 100))) * 100) : 0;

  return (
    <IonPage>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <IonContent className="ion-padding top-12 bg-gray-50 pb-24 pt-8 mt-16">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Good Morning{user?.name ? `, ${user.name}!` : '!'}</h2>
              <p className="text-gray-500 text-sm">Track your finances together</p>
            </div>
            <div className="flex -space-x-2">
              <img src="/Revathy.jpeg" alt="Rev" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="/Jegan.jpg" alt="Jegan" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
          </div>
        </div>
        <div className="space-y-6 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-500">Needs</div>
              <div className="text-2xl font-bold text-red-500">₹{needsSpent.toLocaleString('en-IN')}</div>
              <div className="text-sm text-gray-400">{settings.needs}% of income</div>
            </div>
            <ProgressCircle percent={needsPercent} color="#ef4444" label={`${needsPercent}%`} size={56} />
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-500">Wants</div>
              <div className="text-2xl font-bold text-purple-500">₹{wantsSpent.toLocaleString('en-IN')}</div>
              <div className="text-sm text-gray-400">{settings.wants}% of income</div>
            </div>
            <ProgressCircle percent={wantsPercent} color="#a78bfa" label={`${wantsPercent}%`} size={56} />
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-500">Savings</div>
              <div className="text-2xl font-bold text-yellow-500">₹{savingsSpent.toLocaleString('en-IN')}</div>
              <div className="text-sm text-gray-400">{settings.savings}% of income</div>
            </div>
            <ProgressCircle percent={savingsPercent} color="#eab308" label={`${savingsPercent}%`} size={56} />
          </div>
        </div>
        <div className="mb-24">
          <div className="font-bold text-gray-900 mb-2">Recent Transactions</div>
          <div className="divide-y divide-gray-100 bg-white rounded-xl shadow">
            {transactions.length === 0 ? (
              <div className="text-gray-400 text-center py-6">No transactions yet.</div>
            ) : (
              transactions.map((tx, idx) => {
                const icon = categoryIcons[tx.item] || categoryIcons['Others'];
                const date = tx.timestamp ? new Date(tx.timestamp) : new Date();
                const formattedDate = date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
                return (
                  <div key={idx} className="flex items-center py-3 px-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{tx.item}</div>
                      <div className="text-xs text-gray-500">{tx.category} - {tx.partner}</div>
                      <div className="text-xs text-gray-400">{formattedDate}</div>
                      <div className="text-xs text-gray-500">{tx.desc}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-bold text-pink-500 text-lg">₹{Number(tx.amount).toLocaleString('en-IN')}</div>
                      <button 
                        className="mt-2 text-gray-400 hover:text-red-500" 
                        title="Delete"
                        onClick={() => handleDeleteTransaction(tx.id, tx.addedBy.uid)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
