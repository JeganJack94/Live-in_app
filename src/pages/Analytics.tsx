import React, { useEffect, useState, useContext } from 'react';
import { listenTransactions, Transaction } from '../utils/transactionUtils';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import AnalyticsBarChart from '../components/AnalyticsBarChart';
import AnalyticsDonutChart from '../components/AnalyticsDonutChart';
import { UserContext } from '../context/UserContext';

const Analytics: React.FC = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
	const [totalSpend, setTotalSpend] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [comparisonData, setComparisonData] = useState({
		previousPeriod: 0,
		currentPeriod: 0,
		percentageChange: 0
	});
	const { user, coupleId } = useContext(UserContext);

	useEffect(() => {
		if (!user?.uid || !coupleId) return;

		// Use the stable coupleId for consistency
		const stableCoupleId = ['userA-uid', 'userB-uid'].sort().join('-');
		
		const unsubscribe = listenTransactions(stableCoupleId, (txList) => {
			// Filter transactions based on timeframe
			const now = new Date();
			const filtered = txList
				.filter(tx => {
					if (!tx.timestamp || !tx.amount || !tx.partner || !tx.category) {
						console.log('Filtered out transaction due to missing data:', tx);
						return false;
					}
					
					const txDate = new Date(tx.timestamp);
					if (timeframe === 'month') {
						return txDate.getMonth() === now.getMonth() && 
							   txDate.getFullYear() === now.getFullYear();
					}
					return txDate.getFullYear() === now.getFullYear();
				});

			console.log('Filtered transactions:', filtered);

			console.log('Filtered Transactions:', filtered); // Debug log
			setTransactions(filtered);
		});

		// Cleanup subscription on unmount
		return () => {
			if (unsubscribe) unsubscribe();
		};
	}, [timeframe, user?.uid, coupleId]);

	useEffect(() => {
		// Calculate total spend and comparison data
		const total = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
		setTotalSpend(total);

		// Calculate previous period comparison
		const now = new Date();
		const currentPeriodTx = transactions;
		const previousPeriodTx = transactions.filter(tx => {
			const txDate = new Date(tx.timestamp);
			if (timeframe === 'month') {
				// Previous month
				return txDate.getMonth() === (now.getMonth() - 1) && 
					   txDate.getFullYear() === now.getFullYear();
			}
			// Previous year
			return txDate.getFullYear() === now.getFullYear() - 1;
		});

		const currentSum = currentPeriodTx.reduce((sum, tx) => sum + Number(tx.amount), 0);
		const previousSum = previousPeriodTx.reduce((sum, tx) => sum + Number(tx.amount), 0);
		const percentageChange = previousSum === 0 ? 100 : 
			((currentSum - previousSum) / previousSum) * 100;

		setComparisonData({
			currentPeriod: currentSum,
			previousPeriod: previousSum,
			percentageChange
		});
	}, [transactions, timeframe]);

	// Define categories and their colors
	const categories = ['Needs', 'Wants', 'Savings'] as string[];
	type Category = typeof categories[number];

	// Use fixed partners from the user database
	const partners = ['Revathy', 'Jegan'];
	
	// Partner spending breakdown
	const groupedBarData = partners.map(partner => {
		const values = categories.map(category => {
			const partnerTransactions = transactions.filter(tx => {
				console.log(`Checking tx:`, {
					partner: tx.partner,
					category: tx.category,
					amount: tx.amount,
					matches: tx.partner === partner && tx.category === category
				});
				return tx.partner === partner && tx.category === category;
			});
			
			const sum = partnerTransactions.reduce((acc, tx) => {
				const amount = Number(tx.amount);
				return acc + (isNaN(amount) ? 0 : amount);
			}, 0);
			
			console.log(`Sum for ${partner} - ${category}:`, sum);
			return { category, value: sum };
		});
		return { partner, values };
	});

	console.log('Grouped Bar Data:', JSON.stringify(groupedBarData, null, 2));

	console.log('Bar Chart Data:', groupedBarData); // Debug log

	// Category breakdown for donut chart
	const categoryColors: Record<Category, string> = {
		'Needs': '#f43f5e',
		'Wants': '#a78bfa',
		'Savings': '#34d399'
	};

	const donutChartData = categories.map(category => {
		const value = transactions
			.filter(tx => tx.category === category && tx.amount)
			.reduce((sum, tx) => sum + Number(tx.amount), 0);

		return {
			label: category,
			value,
			color: categoryColors[category]
		};
	}).filter(item => item.value > 0); // Only show categories with values

	console.log('Donut Chart Data:', donutChartData); // Debug log

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	};

	return (
		<IonPage>
			<IonContent className="ion-padding bg-gray-50 pb-24">
				{/* Header Section */}
				<div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 -mx-4 px-4 pt-12 pb-6 mb-6 text-white">
					<h2 className="text-2xl font-bold mb-4">Analytics</h2>
					
					{/* Time Period Selector */}
					<div className="bg-white/20 rounded-lg p-1 mb-6 inline-block">
						<button 
							onClick={() => setTimeframe('month')}
							className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
								timeframe === 'month' ? 'bg-white text-violet-600' : 'text-white'
							}`}
						>
							Month
						</button>
						<button 
							onClick={() => setTimeframe('year')}
							className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
								timeframe === 'year' ? 'bg-white text-violet-600' : 'text-white'
							}`}
						>
							Year
						</button>
					</div>

					{/* Metrics Grid */}
					<div className="grid grid-cols-2 gap-4 mt-4">
						{/* Total Spend */}
						<div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
							<p className="text-sm opacity-90">Total {timeframe === 'month' ? 'Monthly' : 'Yearly'} Spend</p>
							<p className="text-2xl font-bold mt-1">{formatCurrency(totalSpend)}</p>
							<div className={`text-sm mt-2 flex items-center ${
								comparisonData.percentageChange > 0 ? 'text-red-200' : 'text-green-200'
							}`}>
								<span className="mr-1">
									{comparisonData.percentageChange > 0 ? '↑' : '↓'}
								</span>
								{Math.abs(comparisonData.percentageChange).toFixed(1)}% vs last {timeframe}
							</div>
						</div>

						{/* Average Daily Spend */}
						<div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
							<p className="text-sm opacity-90">Average Daily Spend</p>
							<p className="text-2xl font-bold mt-1">
								{formatCurrency(totalSpend / (timeframe === 'month' ? 30 : 365))}
							</p>
							<p className="text-sm mt-2 opacity-75">
								Based on {timeframe === 'month' ? '30 days' : '365 days'}
							</p>
						</div>
					</div>
				</div>

				{/* Charts Section */}
				<div className="space-y-4">
					{/* Partner Spending */}
					<div className="bg-white rounded-xl shadow-sm p-4">
						<div className="flex justify-between items-center mb-3">
							<div>
								<h3 className="font-semibold text-gray-800 text-sm">Partner Spending</h3>
								<p className="text-xs text-gray-500">
									{timeframe === 'month' ? 'This Month' : 'This Year'}
								</p>
							</div>
							<div className="flex items-center space-x-1.5">
								{categories.map(cat => (
									<button
										key={cat}
										onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
										className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
											selectedCategory === cat 
												? 'bg-violet-100 text-violet-700' 
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
										}`}
									>
										{cat}
									</button>
								))}
							</div>
						</div>
						<div className="bg-white/50 rounded-lg shadow-sm">
							<AnalyticsBarChart 
								groupedData={groupedBarData} 
								categories={selectedCategory ? [selectedCategory] : categories} 
							/>
						</div>
					</div>

					{/* Category Breakdown */}
					<div className="bg-white rounded-xl shadow-sm p-4">
						<div className="flex justify-between items-center mb-3">
							<div>
								<h3 className="font-semibold text-gray-800 text-sm">Category Breakdown</h3>
								<p className="text-xs text-gray-500">All Categories</p>
							</div>
							<div className="text-xs text-violet-600 font-medium">
								{donutChartData.length} Categories
							</div>
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="relative h-[160px] bg-gray-50/80 rounded-lg p-3">
								<AnalyticsDonutChart data={donutChartData} />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
										<div className="text-xl font-bold text-gray-800">
											{formatCurrency(totalSpend)}
										</div>
										<div className="text-xs text-gray-500">Total Spend</div>
									</div>
								</div>
							</div>
							<div className="space-y-2 max-h-[160px] overflow-y-auto bg-gray-50/80 rounded-lg p-3">
								{donutChartData.map(({ label, value, color }) => (
									<div 
										key={label} 
										className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
										onClick={() => setSelectedCategory(selectedCategory === label ? null : label)}
									>
										<div className="flex items-center">
											<div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
											<div>
												<span className="text-xs font-medium text-gray-800">{label}</span>
												<div className="text-xs text-gray-500">
													{((value / totalSpend) * 100).toFixed(1)}%
												</div>
											</div>
										</div>
										<span className="text-xs font-medium text-gray-900">{formatCurrency(value)}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<BottomTab />
			</IonContent>
		</IonPage>
	);
};

export default Analytics;
