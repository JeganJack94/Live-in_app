import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';
import AnalyticsBarChart from '../components/AnalyticsBarChart';
import AnalyticsDonutChart from '../components/AnalyticsDonutChart';

const Analytics: React.FC = () => {
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
						<div className="font-semibold text-gray-700 mb-2">Partner Spending Comparison</div>
						<AnalyticsBarChart />
					</div>
					<div className="bg-white rounded-xl shadow p-4">
						<div className="font-semibold text-gray-700 mb-2">Category Breakdown</div>
						<AnalyticsDonutChart />
					</div>
				</div>
				<BottomTab />
			</IonContent>
		</IonPage>
	);
};

export default Analytics;
