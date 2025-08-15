import React, { useState } from 'react';
import { IonModal } from '@ionic/react';

const categories = [
  { label: 'Needs', color: 'border-pink-500 text-pink-500' },
  { label: 'Wants', color: 'border-purple-500 text-purple-500' },
  { label: 'Savings', color: 'border-yellow-500 text-yellow-500' },
];

const partners = [
  { label: 'Partner A', img: 'https://randomuser.me/api/portraits/women/44.jpg', color: 'text-pink-500 border-pink-500' },
  { label: 'Partner B', img: 'https://randomuser.me/api/portraits/men/43.jpg', color: 'text-gray-500 border-gray-200' },
];

const AddTransactionModal = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (data: any) => void }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Needs');
  const [partner, setPartner] = useState('Partner A');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    onSave({ amount, category, partner, desc });
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="!bg-transparent">
      <div className="bg-white rounded-t-2xl shadow-lg p-6 max-w-md mx-auto mt-8">
        <div className="flex items-center mb-4">
          <button onClick={onClose} className="text-gray-400 text-xl mr-2">←</button>
          <h2 className="font-bold text-lg text-gray-900 flex-1 text-center">Add Transaction</h2>
        </div>
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Amount</div>
          <input type="number" placeholder="$ 0.00" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full" />
        </div>
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Category</div>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat.label} className={`flex items-center cursor-pointer ${category === cat.label ? cat.color + ' border-2' : 'border-gray-200'} border rounded-lg px-3 py-2 transition-all`}> 
                <input type="radio" name="category" value={cat.label} checked={category === cat.label} onChange={() => setCategory(cat.label)} className="form-radio mr-2 accent-pink-500" />
                <span className={`font-semibold ${category === cat.label ? cat.color : 'text-gray-700'}`}>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Partner</div>
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
    </IonModal>
  );
};

export default AddTransactionModal;
