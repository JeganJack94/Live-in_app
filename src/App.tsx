import React, { useState } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Components
import AppHeader from './components/AppHeader';

// Pages
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PinEntry from './pages/PinEntry';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';

// Components
import BottomTab from './components/BottomTab';

// Icons
// Context
import { UserContext } from './context/UserContext';

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
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const usersDB = {
  'userA-uid': {
    name: 'Revathy',
    img: '/Revathy.jpeg',
    uid: 'userA-uid',
    pin: '9900'
  },
  'userB-uid': {
    name: 'Jegan',
    img: '/Jegan.jpg',
    uid: 'userB-uid',
    pin: '0099'
  }
};

interface AppRoutesProps {
  user: User | null;
  darkMode: boolean;
  showNotif: boolean;
  notifications: Array<{ id: number; text: string; read: boolean; }>;
  onToggleDarkMode: () => void;
  onNotifClick: () => void;
  onNotifClose: () => void;
  onMarkRead: (id: number) => void;
  onClearAll: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ 
  user, 
  showNotif, 
  notifications,
  onToggleDarkMode,
  onNotifClick,
  onNotifClose,
  onMarkRead,
  onClearAll
}) => {
  const location = useLocation();
  const hideNav = ['/onboarding', '/pin-entry', '/chat'].includes(location.pathname);

  if (!user && location.pathname !== '/pin-entry' && location.pathname !== '/onboarding') {
    return <Redirect to="/onboarding" />;
  }

  return (
    <>
      {!hideNav && (
        <AppHeader
          user={user}
          showNotif={showNotif}
          notifications={notifications}
          onToggleDarkMode={onToggleDarkMode}
          onNotifClick={onNotifClick}
          onNotifClose={onNotifClose}
          onMarkRead={onMarkRead}
          onClearAll={onClearAll}
        />
      )}
      <div className={location.pathname === '/chat' ? '' : hideNav ? '' : 'pb-24 pt-6'}>
        <IonRouterOutlet>
          <Route exact path="/onboarding">
            <Onboarding />
          </Route>
          <Route exact path="/pin-entry">
            <PinEntry />
          </Route>
          <Route exact path="/dashboard">
            {user ? <Dashboard /> : <Redirect to="/onboarding" />}
          </Route>
          <Route exact path="/reports">
            {user ? <Reports /> : <Redirect to="/onboarding" />}
          </Route>
          <Route exact path="/settings">
            {user ? <Settings /> : <Redirect to="/onboarding" />}
          </Route>
          <Route exact path="/analytics">
            {user ? <Analytics /> : <Redirect to="/onboarding" />}
          </Route>
          <Route exact path="/chat">
            {user ? <Chat /> : <Redirect to="/onboarding" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/onboarding" />
          </Route>
        </IonRouterOutlet>
      </div>
      {!hideNav && <BottomTab />}
    </>
  );
};

interface User {
  name: string;
  img: string;
  uid: string;
  pin: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [coupleId, setCoupleId] = useState<string | null>(() => {
    const savedCoupleId = localStorage.getItem('coupleId');
    return savedCoupleId ? JSON.parse(savedCoupleId) : null;
  });

  const [darkMode, setDarkMode] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Electricity bill paid', read: false },
    { id: 2, text: 'Groceries split request', read: false },
    { id: 3, text: 'Monthly report ready', read: true },
  ]);

  // Persist user data whenever it changes
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // Persist coupleId whenever it changes
  React.useEffect(() => {
    if (coupleId) {
      localStorage.setItem('coupleId', JSON.stringify(coupleId));
    } else {
      localStorage.removeItem('coupleId');
    }
  }, [coupleId]);

  const handleSetUser = (newUser: User | null) => {
    if (newUser) {
      setUser(newUser);
      const coupleUsers = ['userA-uid', 'userB-uid'].sort();
      const newCoupleId = coupleUsers.join('-');
      setCoupleId(newCoupleId);
    } else {
      setUser(null);
      setCoupleId(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('coupleId');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <UserContext.Provider value={{ 
          user: user ? { ...user, coupleId: coupleId || undefined } : null, 
          setUser: handleSetUser,
          coupleId,
          setCoupleId
        }}>
          <AppRoutes 
            user={user}
            darkMode={darkMode}
            showNotif={showNotif}
            notifications={notifications}
            onToggleDarkMode={toggleDarkMode}
            onNotifClick={() => setShowNotif(true)}
            onNotifClose={() => setShowNotif(false)}
            onMarkRead={handleMarkRead}
            onClearAll={handleClearAll}
          />
        </UserContext.Provider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
