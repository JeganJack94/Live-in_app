import React, { useState, ReactElement } from 'react';
import { FaHome, FaShoppingCart, FaUtensils, FaBus, FaGift, FaUserFriends, FaBeer, FaHamburger, FaUmbrellaBeach, FaTshirt, FaMoneyBillWave, FaPiggyBank, FaCoins, FaHandHoldingUsd, FaRegStar, FaQuestionCircle } from 'react-icons/fa';
import { IonModal } from '@ionic/react';

export const categoryIcons: Record<string, ReactElement> = {
  'Rent': <FaHome className="text-pink-500 text-lg mr-2" />,
  'Groceries': <FaShoppingCart className="text-pink-500 text-lg mr-2" />,
  'Utilities': <FaUtensils className="text-pink-500 text-lg mr-2" />,
  'Transportation': <FaBus className="text-pink-500 text-lg mr-2" />,
  'To Parents': <FaUserFriends className="text-pink-500 text-lg mr-2" />,
  'Others': <FaQuestionCircle className="text-pink-500 text-lg mr-2" />,
  'Drinks': <FaBeer className="text-purple-500 text-lg mr-2" />,
  'Food': <FaHamburger className="text-purple-500 text-lg mr-2" />,
  'Outings': <FaGift className="text-purple-500 text-lg mr-2" />,
  'Vacation': <FaUmbrellaBeach className="text-purple-500 text-lg mr-2" />,
  'Shopping': <FaTshirt className="text-purple-500 text-lg mr-2" />,
  'Debt': <FaMoneyBillWave className="text-purple-500 text-lg mr-2" />,
  'Emergency Funds': <FaPiggyBank className="text-yellow-500 text-lg mr-2" />,
  'Mutual Funds': <FaCoins className="text-yellow-500 text-lg mr-2" />,
  'Gold/Silver': <FaRegStar className="text-yellow-500 text-lg mr-2" />,
  'Lend': <FaHandHoldingUsd className="text-yellow-500 text-lg mr-2" />,
};

const categoryTabs = [
  {
    label: 'Needs',
    color: 'border-pink-500 text-pink-500',
    items: ['Rent', 'Groceries', 'Utilities', 'Transportation', 'To Parents', 'Others'],
  },
  {
    label: 'Wants',
    color: 'border-purple-500 text-purple-500',
    items: ['Drinks', 'Food', 'Outings', 'Vacation', 'Shopping', 'Debt', 'Others'],
  },
  {
    label: 'Savings',
    color: 'border-yellow-500 text-yellow-500',
    items: ['Emergency Funds', 'Mutual Funds', 'Gold/Silver', 'Lend', 'Others'],
  },
];

const partners = [
  { label: 'Revathy', img: '/Revathy.jpeg', color: 'text-pink-500 border-pink-500' },
  { label: 'Jegan', img: '/Jegan.jpg', color: 'text-red-500 border-red-200' },
];

export type Transaction = {
  amount: string;
  category: string;
  item: string;
  partner: string;
  desc: string;
  timestamp?: number;
};

const AddTransactionModal = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (data: Transaction) => void }) => {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('Needs');
  const [selectedItem, setSelectedItem] = useState('');
  const [partner, setPartner] = useState('Revathy');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    onSave({ amount, category: activeTab, item: selectedItem, partner, desc });
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="!bg-transparent">
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 rounded-t-2xl shadow-lg p-1 w-[400px] mx-auto mt-8">
        <div className="bg-white rounded-t-2xl p-6 w-[400px]">
          <div className="flex items-center mb-4">
            <button onClick={onClose} className="text-gray-400 text-xl mr-2">←</button>
            <h2 className="font-bold text-lg text-gray-900 flex-1 text-center">Add Transaction</h2>
          </div>
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Category</div>
            <div className="flex justify-between mb-4">
              {categoryTabs.map(tab => (
                <button
                  key={tab.label}
                  type="button"
                  className={`flex-1 mx-1 py-4 rounded-xl shadow-lg font-bold border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === tab.label ? tab.color + ' bg-white border-4' : 'border-gray-200 bg-gray-100 text-gray-700'}`}
                  onClick={() => { setActiveTab(tab.label); setSelectedItem(''); }}
                  style={{ minWidth: 0 }}
                >
                  <span className={`block text-lg ${activeTab === tab.label ? tab.color : 'text-gray-700'}`}>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              {categoryTabs.find(tab => tab.label === activeTab)?.items.map(item => (
                <button
                  key={item}
                  type="button"
                  className={`flex items-center px-3 py-3 rounded-xl border font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none ${selectedItem === item ? 'bg-pink-100 border-pink-500 text-pink-700 shadow' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {categoryIcons[item] || <FaQuestionCircle className="text-gray-400 text-lg mr-2" />}
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">Amount</div>
            <input type="number" placeholder="₹ 0.00" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">User</div>
            <div className="flex space-x-4">
              {partners.map(p => (
                <button key={p.label} type="button" onClick={() => setPartner(p.label)} className={`flex flex-col items-center border rounded-lg px-4 py-2 w-1/2 ${partner === p.label ? p.color + ' border-2' : 'border-gray-200'}`}>
                  <img src={p.img} alt={p.label} className="w-10 h-10 rounded-full mb-1" />
                  <span className={`font-semibold ${partner === p.label ? p.color : 'text-gray-700'}`}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-1">Description</div>
            <textarea placeholder="Enter transaction details..." value={desc} onChange={e => setDesc(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full" rows={2} />
          </div>
          <div className="space-y-2">
            <button onClick={handleSave} className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg">Save Transaction</button>
            <button onClick={onClose} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg">Cancel</button>
          </div>
        </div>
      </div>
    </IonModal>
  );
};

export default AddTransactionModal;
