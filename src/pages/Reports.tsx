import React, { useState, useContext, useEffect } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { UserContext } from '../context/UserContext';
import BottomTab from '../components/BottomTab';
import { listenTransactions, Transaction, categoryIcons } from '../utils/transactionUtils';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports: React.FC = () => {
  const { user } = useContext(UserContext);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [partner, setPartner] = useState('All Partners');
  const [category, setCategory] = useState('All Categories');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const coupleId = 'userA-uid-userB-uid'; // Same as in Dashboard

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Category", "Item", "Partner", "Amount (₹)"];
    const tableRows = filteredTransactions.map(tx => [
      format(tx.timestamp, 'dd/MM/yyyy'),
      tx.category,
      tx.item,
      tx.partner,
      Number(tx.amount).toLocaleString('en-IN')
    ]);

    doc.setFontSize(20);
    doc.text('Transaction Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Date Range: ${dateFrom || 'All'} to ${dateTo || 'All'}`, 14, 25);
    doc.text(`Total Amount: ₹${totalAmount.toLocaleString('en-IN')}`, 14, 30);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 8 }
    });

    doc.save('transaction-report.pdf');
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = listenTransactions(coupleId, (txList) => {
        setTransactions(txList.reverse()); // Newest first
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, coupleId]);

  const filteredTransactions = transactions.filter(tx => {
    const fromDate = dateFrom ? new Date(dateFrom).getTime() : 0;
    const toDate = dateTo ? new Date(dateTo).getTime() : Infinity;
    const txDate = tx.timestamp;

    const matchesDate = txDate >= fromDate && txDate <= toDate;
    const matchesPartner = partner === 'All Partners' || tx.partner === partner;
    const matchesCategory = category === 'All Categories' || tx.category === category;

    return matchesDate && matchesPartner && matchesCategory;
  });

  // Calculate summaries
  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const categorySummary = Object.entries(
    filteredTransactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  // Paginate transactions
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <IonPage>
      <IonContent className="ion-padding top-10 bg-gray-50 pb-24">
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-2">Reports</h2>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Filters</div>
          <div className="mb-3">
            <div className="text-sm font-semibold text-gray-700 mb-1">Date Range</div>
            <div className="flex space-x-2">
              <input 
                type="date" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)} 
                className="bg-gray-100 rounded-lg px-3 py-2 w-1/2" 
              />
              <input 
                type="date" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)} 
                className="bg-gray-100 rounded-lg px-3 py-2 w-1/2" 
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="text-sm font-semibold text-gray-700 mb-1">Partner</div>
            <select 
              value={partner} 
              onChange={e => setPartner(e.target.value)} 
              className="bg-gray-100 rounded-lg px-3 py-2 w-full"
            >
              <option>All Partners</option>
              <option>Revathy</option>
              <option>Jegan</option>
            </select>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Category</div>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="bg-gray-100 rounded-lg px-3 py-2 w-full"
            >
              <option>All Categories</option>
              {Object.keys(categoryIcons).map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-gray-900">Transaction Summary</div>
            <button 
              onClick={generatePDF}
              className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export PDF
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Transactions</span>
              <span className="font-bold text-gray-900">{filteredTransactions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Amount</span>
              <span className="font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">By Category</div>
              <div className="space-y-2">
                {categorySummary.map(([cat, amount]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {categoryIcons[cat]}
                      <span className="text-gray-700">{cat}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Transactions</div>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <IonSpinner name="dots" />
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{categoryIcons[tx.category]}</div>
                    <div>
                      <div className="font-medium">{tx.item}</div>
                      <div className="text-sm text-gray-500">
                        {format(tx.timestamp, 'MMM d, yyyy')} • {tx.partner}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ₹{Number(tx.amount).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <BottomTab />
      </IonContent>
    </IonPage>
  );
};

export default Reports;
