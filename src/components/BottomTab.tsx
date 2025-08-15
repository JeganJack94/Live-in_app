import React from 'react';
import { IonIcon } from '@ionic/react';
import { homeOutline, pieChartOutline, documentTextOutline, settingsOutline, chatboxOutline } from 'ionicons/icons';
import { useLocation, Link } from 'react-router-dom';

const BottomTab: React.FC = () => {
  const location = useLocation();
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between items-center px-4 py-2 z-10">
      <Link to="/dashboard" className={`flex flex-col items-center ${location.pathname === '/dashboard' ? 'text-pink-500' : 'text-gray-400'}`}> 
        <IonIcon icon={homeOutline} className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/analytics" className={`flex flex-col items-center ${location.pathname === '/analytics' ? 'text-pink-500 border-b-2 border-pink-500 pb-1' : 'text-gray-400'}`}> 
        <IonIcon icon={pieChartOutline} className="w-6 h-6" />
        <span className="text-xs mt-1">Analytics</span>
      </Link>
      <Link to="/chat" className="relative flex flex-col items-center">
        <span className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg ${location.pathname === '/chat' ? 'ring-2 ring-pink-500' : ''}`}>
          <div className={`bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${location.pathname === '/chat' ? 'shadow-lg' : ''}`}>
            <IonIcon icon={chatboxOutline} className="w-7 h-7 text-white" />
          </div>
        </span>
      </Link>
      <Link to="/reports" className={`flex flex-col items-center ${location.pathname === '/reports' ? 'text-pink-500' : 'text-gray-400'}`}> 
        <IonIcon icon={documentTextOutline} className="w-6 h-6" />
        <span className="text-xs mt-1">Reports</span>
      </Link>
      <Link to="/settings" className={`flex flex-col items-center ${location.pathname === '/settings' ? 'text-pink-500' : 'text-gray-400'}`}> 
        <IonIcon icon={settingsOutline} className="w-6 h-6" />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  );
};

export default BottomTab;
