import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import BottomTab from '../components/BottomTab';

const Settings: React.FC = () => {
  const [incomeA, setIncomeA] = useState('');
  const [incomeB, setIncomeB] = useState('');
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const [savings, setSavings] = useState(20);

  return (
    <IonPage>
      <IonContent className="ion-padding bg-gray-50 pb-24">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-lg text-gray-900">Live-in</div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-2">Settings</h2>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Income Setup</div>
          <div className="mb-3">
            <div className="text-sm font-semibold text-gray-700 mb-1">Partner A Monthly Income</div>
            <input type="number" placeholder="$0.00" value={incomeA} onChange={e => setIncomeA(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Partner B Monthly Income</div>
            <input type="number" placeholder="$0.00" value={incomeB} onChange={e => setIncomeB(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 w-full" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Budget Allocation</div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Needs</span>
              <span className="font-bold text-pink-500">{needs}%</span>
            </div>
            <input type="range" min={0} max={100} value={needs} onChange={e => setNeeds(Number(e.target.value))} className="w-full accent-pink-500" />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Wants</span>
              <span className="font-bold text-purple-500">{wants}%</span>
            </div>
            <input type="range" min={0} max={100} value={wants} onChange={e => setWants(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Savings</span>
              <span className="font-bold text-yellow-500">{savings}%</span>
            </div>
            <input type="range" min={0} max={100} value={savings} onChange={e => setSavings(Number(e.target.value))} className="w-full accent-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Theme Preview</div>
          {/* Add theme preview UI here if needed */}
        </div>
        <BottomTab />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
