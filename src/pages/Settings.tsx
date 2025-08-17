import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { realtimeDb } from '../firebase/Firebase';
import { UserContext } from '../context/UserContext';
import { ref, set, get } from 'firebase/database';
import { IonPage, IonContent, IonToast } from '@ionic/react';
import BottomTab from '../components/BottomTab';

const Settings: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [incomeA, setIncomeA] = useState('');
  const [incomeB, setIncomeB] = useState('');
  const [showIncomeA, setShowIncomeA] = useState(false);
  const [showIncomeB, setShowIncomeB] = useState(false);
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const [savings, setSavings] = useState(20);
  const [theme, setTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'warning' | 'danger';
  }>({
    isOpen: false,
    message: '',
    color: 'success'
  });

  // Fetch settings from Firebase on mount
  useEffect(() => {
    if (!user?.uid) return;
    const settingsRef = ref(realtimeDb, `users/${user.uid}/settings`);
    get(settingsRef).then(snapshot => {
      const data = snapshot.val();
      if (data) {
        setIncomeA(data.incomeA || '');
        setIncomeB(data.incomeB || '');
        setNeeds(data.needs ?? 50);
        setWants(data.wants ?? 30);
        setSavings(data.savings ?? 20);
        setTheme(data.theme || 'light');
        setNotificationsEnabled(data.notificationsEnabled ?? true);
      }
    });
  }, [user]);

  const showToast = (message: string, color: 'success' | 'warning' | 'danger' = 'success') => {
    setToast({
      isOpen: true,
      message,
      color
    });
  };

  // Save settings to Firebase
  const saveSettings = async () => {
    if (!user?.uid) return;
    try {
      await set(ref(realtimeDb, `users/${user.uid}/settings`), {
        incomeA,
        incomeB,
        needs,
        wants,
        savings,
        theme,
        notificationsEnabled,
      });
      showToast('Settings saved successfully!');
    } catch (error) {
      showToast('Failed to save settings', 'danger');
    }
  };

  const handleLogout = () => {
    try {
      // Clear user data from context and storage
      setUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('coupleId');
      showToast('Logged out successfully', 'warning');
      setTimeout(() => setRedirect(true), 1000);
    } catch (error) {
      showToast('Failed to logout', 'danger');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    showToast(`Theme changed to ${newTheme} mode`);
  };

  const handleNotificationChange = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    showToast(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding top-10 bg-gray-50 pb-32 pt-8 mt-16">
        <IonToast
          isOpen={toast.isOpen}
          onDidDismiss={() => setToast(prev => ({ ...prev, isOpen: false }))}
          message={toast.message}
          duration={2000}
          position="top"
          color={toast.color}
        />
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-2">Settings</h2>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Income Setup</div>
          <div className="mb-3">
            <div className="text-sm font-semibold text-gray-700 mb-1">Revathy Monthly Income</div>
            <div className="relative flex items-center">
              <input
                type={showIncomeA ? "text" : "password"}
                placeholder="₹ 0.00"
                value={incomeA}
                onChange={e => setIncomeA(e.target.value)}
                className="bg-gray-100 rounded-lg px-3 py-2 w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-2 text-gray-500 hover:text-pink-500"
                onClick={() => setShowIncomeA(v => !v)}
                tabIndex={-1}
              >
                {showIncomeA ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 0118 0c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.125-6.125M6.343 6.343A9.96 9.96 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.221-.403 4.594-1.125M17.657 17.657A9.96 9.96 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.221.403-4.594 1.125M9.88 9.88a3 3 0 104.24 4.24" /></svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Jegan Monthly Income</div>
            <div className="relative flex items-center">
              <input
                type={showIncomeB ? "text" : "password"}
                placeholder="₹ 0.00"
                value={incomeB}
                onChange={e => setIncomeB(e.target.value)}
                className="bg-gray-100 rounded-lg px-3 py-2 w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-2 text-gray-500 hover:text-pink-500"
                onClick={() => setShowIncomeB(v => !v)}
                tabIndex={-1}
              >
                {showIncomeB ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 0118 0c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.125-6.125M6.343 6.343A9.96 9.96 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.221-.403 4.594-1.125M17.657 17.657A9.96 9.96 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.221.403-4.594 1.125M9.88 9.88a3 3 0 104.24 4.24" /></svg>
                )}
              </button>
            </div>
          </div>
          <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 rounded-lg" onClick={saveSettings}>Save Settings</button>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Budget Allocation</div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Needs</span>
              <span className="font-bold text-pink-500">{needs}%</span>
            </div>
            <input type="range" min={0} max={100} value={needs} onChange={e => setNeeds(Number(e.target.value))} className="w-full accent-pink-500" />
            <div className="text-xs text-gray-500 mt-1">{`Limit: ${needs}% of total budget`}</div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Wants</span>
              <span className="font-bold text-purple-500">{wants}%</span>
            </div>
            <input type="range" min={0} max={100} value={wants} onChange={e => setWants(Number(e.target.value))} className="w-full accent-purple-500" />
            <div className="text-xs text-gray-500 mt-1">{`Limit: ${wants}% of total budget`}</div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Savings</span>
              <span className="font-bold text-yellow-500">{savings}%</span>
            </div>
            <input type="range" min={0} max={100} value={savings} onChange={e => setSavings(Number(e.target.value))} className="w-full accent-yellow-500" />
            <div className="text-xs text-gray-500 mt-1">{`Limit: ${savings}% of total budget`}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-gray-900 mb-2">Theme & Notifications</div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-700">Theme</span>
            <select 
              value={theme} 
              onChange={e => handleThemeChange(e.target.value)} 
              className="bg-gray-100 rounded-lg px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Notifications</span>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={e => handleNotificationChange(e.target.checked)} 
                className="accent-pink-500" 
              />
              <span className="ml-2 text-gray-700">{notificationsEnabled ? 'On' : 'Off'}</span>
            </label>
          </div>
        </div>
  <div className="mb-24">
    <button 
      className="w-full bg-red-500 text-white font-bold py-3 rounded-lg mt-4 hover:bg-red-600 transition-colors" 
      onClick={handleLogout}
    >
      Logout
    </button>
    {redirect && <Redirect to="/onboarding" />}
    <div className="text-center text-xs text-gray-400 mt-6">
      © {new Date().getFullYear()} Live-in. All rights reserved.
    </div>
  </div>
  <BottomTab />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
