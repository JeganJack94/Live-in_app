import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PinEntry from './pages/PinEntry';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import BottomTab from './components/BottomTab';
import { FaMoon, FaBell, FaHeart } from 'react-icons/fa';
import NotificationsModal from './components/NotificationsModal';

setupIonicReact();



import React, { useState } from 'react';

const TopHeader: React.FC = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Electricity bill paid', read: false },
    { id: 2, text: 'Groceries split request', read: false },
    { id: 3, text: 'Monthly report ready', read: true },
  ]);

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-200 z-20 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 animate-gradient">
      <div className="flex items-center">
        <span className="mr-2">
          <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full animate-bounce">
            <FaHeart className="text-pink-500 text-2xl" />
          </span>
        </span>
        <span className="font-extrabold text-xl text-white drop-shadow-lg tracking-wide animate-fade-in">Live-in</span>
      </div>
      <div className="flex items-center space-x-3">
        <button className="text-xl text-white opacity-80 hover:opacity-100 transition duration-300"><FaMoon /></button>
        <button className="relative text-xl text-white opacity-80 hover:opacity-100 transition duration-300" onClick={() => setShowNotif(true)}>
          <FaBell />
          {notifications.some(n => !n.read) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          )}
        </button>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-7 h-7 rounded-full border-2 border-white shadow-lg transition-transform duration-300 hover:scale-110" />
      </div>
      <NotificationsModal
        isOpen={showNotif}
        onClose={() => setShowNotif(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onClearAll={handleClearAll}
      />
      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 4s ease infinite;
        }
        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <TopHeader />
  <div className="pb-24 pt-6">
        <IonRouterOutlet>
          <Route exact path="/onboarding">
            <Onboarding />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/analytics">
            <Analytics />
          </Route>
          <Route exact path="/transactions">
            <Transactions />
          </Route>
          <Route exact path="/categories">
            <Categories />
          </Route>
          <Route exact path="/chat">
            <Chat />
          </Route>
          <Route exact path="/reports">
            <Reports />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/pin-entry">
            <PinEntry />
          </Route>
          <Route exact path="/">
            <Redirect to="/onboarding" />
          </Route>
        </IonRouterOutlet>
      </div>
      <BottomTab />
    </IonReactRouter>
  </IonApp>
);

export default App;
