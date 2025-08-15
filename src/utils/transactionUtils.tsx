
import React from 'react';
import { db } from '../firebase/Firebase';
import { ref, push, onValue } from 'firebase/database';
import { FaHome, FaShoppingCart, FaUtensils, FaBus, FaGift, FaUserFriends, FaBeer, FaHamburger, FaUmbrellaBeach, FaTshirt, FaMoneyBillWave, FaPiggyBank, FaCoins, FaHandHoldingUsd, FaRegStar, FaQuestionCircle } from 'react-icons/fa';

export const categoryIcons: Record<string, React.ReactElement> = {
  'Rent': <FaHome className='text-pink-500 text-lg mr-2' />,
  'Groceries': <FaShoppingCart className='text-pink-500 text-lg mr-2' />,
  'Utilities': <FaUtensils className='text-pink-500 text-lg mr-2' />,
  'Transportation': <FaBus className='text-pink-500 text-lg mr-2' />,
  'To Parents': <FaUserFriends className='text-pink-500 text-lg mr-2' />,
  'Others': <FaQuestionCircle className='text-pink-500 text-lg mr-2' />,
  'Drinks': <FaBeer className='text-purple-500 text-lg mr-2' />,
  'Food': <FaHamburger className='text-purple-500 text-lg mr-2' />,
  'Outings': <FaGift className='text-purple-500 text-lg mr-2' />,
  'Vacation': <FaUmbrellaBeach className='text-purple-500 text-lg mr-2' />,
  'Shopping': <FaTshirt className='text-purple-500 text-lg mr-2' />,
  'Debt': <FaMoneyBillWave className='text-purple-500 text-lg mr-2' />,
  'Emergency Funds': <FaPiggyBank className='text-yellow-500 text-lg mr-2' />,
  'Mutual Funds': <FaCoins className='text-yellow-500 text-lg mr-2' />,
  'Gold/Silver': <FaRegStar className='text-yellow-500 text-lg mr-2' />,
  'Lend': <FaHandHoldingUsd className='text-yellow-500 text-lg mr-2' />,
};

export type Transaction = {
  id: string;
  amount: string;
  category: string;
  item: string;
  partner: string;
  addedBy: {
    uid: string;
    name?: string;
  };
  desc: string;
  timestamp: number;
};

// Add a transaction to RTDB under /couples/{coupleId}/transactions
export const addTransaction = (coupleId: string, transaction: Transaction) => {
  const transactionsRef = ref(db, `couples/${coupleId}/transactions`);
  return push(transactionsRef, {
    ...transaction,
    timestamp: transaction.timestamp || Date.now(),
  });
};

// Listen for transactions in RTDB under /couples/{coupleId}/transactions
export const listenTransactions = (coupleId: string, callback: (transactions: Transaction[]) => void) => {
  const transactionsRef = ref(db, `couples/${coupleId}/transactions`);
  onValue(transactionsRef, (snapshot) => {
    const data = snapshot.val();
    const transactions: Transaction[] = data
      ? Object.entries(data).map(([id, tx]) => ({ ...(tx as Transaction), id }))
      : [];
    callback(transactions);
  });
};
