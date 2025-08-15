import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';

const Reports: React.FC = () => {
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');
	const [partner, setPartner] = useState('All Partners');
	const [category, setCategory] = useState('All Categories');

	return (
		<IonPage>
			<IonContent className="ion-padding bg-gray-50 pb-24">
				<div className="flex items-center justify-between mb-2">
					<div className="font-bold text-lg text-gray-900">Live-in</div>
					<div className="flex items-center space-x-3">
						<button className="text-xl text-gray-400"><i className="fas fa-bell"></i></button>
						<img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-7 h-7 rounded-full border-2 border-white" />
					</div>
				</div>
				<h2 className="text-xl font-bold text-gray-900 mb-4 mt-2">Reports</h2>
				<div className="bg-white rounded-xl shadow p-4 mb-4">
					<div className="font-bold text-gray-900 mb-2">Filters</div>
					<div className="mb-3">
						<div className="text-sm font-semibold text-gray-700 mb-1">Date Range</div>
						<div className="flex space-x-2">
							<input type="text" placeholder="dd/mm/yyyy" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-1/2" />
							<input type="text" placeholder="dd/mm/yyyy" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-1/2" />
						</div>
					</div>
					<div className="mb-3">
						<div className="text-sm font-semibold text-gray-700 mb-1">Partner</div>
						<select value={partner} onChange={e => setPartner(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full">
							<option>All Partners</option>
							<option>Sarah</option>
							<option>Marcus</option>
						</select>
					</div>
					<div>
						<div className="text-sm font-semibold text-gray-700 mb-1">Category</div>
						<select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full">
							<option>All Categories</option>
							<option>Food</option>
							<option>Groceries</option>
							<option>Other</option>
						</select>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow p-4 mb-4">
					<div className="font-bold text-gray-900 mb-2">Export Options</div>
					<div className="flex space-x-4">
						<button className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg flex items-center justify-center"><i className="fas fa-file-pdf mr-2"></i>Export PDF</button>
						<button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center"><i className="fas fa-file-csv mr-2"></i>Export CSV</button>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow p-4 mb-4">
					<div className="font-bold text-gray-900 mb-2">Transaction Summary</div>
					<div className="flex items-center justify-between">
						<span className="text-gray-700">Total Transactions</span>
						<span className="font-bold text-gray-900">247</span>
					</div>
				</div>
				<BottomTab />
			</IonContent>
		</IonPage>
	);
};

export default Reports;
