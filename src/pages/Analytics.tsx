import React, { useEffect, useState } from 'react';
import { listenTransactions, Transaction } from '../utils/transactionUtils';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import AnalyticsBarChart from '../components/AnalyticsBarChart';
import AnalyticsDonutChart from '../components/AnalyticsDonutChart';

const coupleId = 'jegan-revathy';

const Analytics: React.FC = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		listenTransactions(coupleId, (txList) => {
			setTransactions(txList);
		});
	}, []);


		// Grouped bar chart: partner/category breakdown (Needs, Wants, Savings)
		const categories = ['Needs', 'Wants', 'Savings'];
		const partners = Array.from(new Set(transactions.map(tx => tx.partner)));
		const groupedBarData = partners.map(partner => {
			const values = categories.map(cat => {
				const sum = transactions
					.filter(tx => tx.partner === partner && tx.category === cat)
					.reduce((acc, tx) => acc + Number(tx.amount), 0);
				return { category: cat, value: sum };
			});
			return { partner, values };
		});

		// Donut chart: breakdown for all categories/items
		const allCategoryTotals: Record<string, number> = {};
		transactions.forEach(tx => {
			const key = tx.category || tx.item;
			if (!allCategoryTotals[key]) allCategoryTotals[key] = 0;
			allCategoryTotals[key] += Number(tx.amount);
		});
		const donutChartData = Object.entries(allCategoryTotals).map(([label, value], i) => ({ label, value, color: ['#f43f5e', '#fbbf24', '#f59e42', '#a78bfa', '#eab308', '#34d399', '#6366f1', '#f472b6'][i % 8] }));

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
				<h2 className="text-xl font-bold text-gray-900 mb-2 mt-2">Analytics</h2>
				<div className="flex space-x-2 mb-4">
					<button className="bg-pink-500 text-white font-semibold px-4 py-1 rounded-full shadow">Month</button>
					<button className="bg-white text-gray-500 font-semibold px-4 py-1 rounded-full border">Year</button>
				</div>
				<div className="space-y-6">
								<div className="bg-white rounded-xl shadow p-4">
									<div className="font-semibold text-gray-700 mb-2">Partner Spend by Category</div>
									<AnalyticsBarChart groupedData={groupedBarData} categories={categories} />
								</div>
								<div className="bg-white rounded-xl shadow p-4">
									<div className="font-semibold text-gray-700 mb-2">Breakdown by Category/Item</div>
									<AnalyticsDonutChart data={donutChartData} />
								</div>
				</div>
				<BottomTab />
			</IonContent>
		</IonPage>
	);
};

export default Analytics;
