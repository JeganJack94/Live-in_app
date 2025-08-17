import React from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import './Onboarding.css';

const profiles = [
  {
    name: 'Revathy',
    img: '/Revathy.jpeg',
    color: 'text-red-500',
    uid: 'userA-uid',
    pin: '9900',
  },
  {
    name: 'Jegan',
    img: '/Jegan.jpg',
    color: 'text-red-500',
    uid: 'userB-uid',
    pin: '0099',
  },
];
const Onboarding: React.FC = () => {
  const handleProfileSelect = (index: number) => {
    const selectedUser = profiles[index];
    // Store the selected user data in session storage temporarily
    sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser));
    // Use standard navigation
    window.location.href = '/pin-entry';
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="min-h-screen flex flex-col items-center justify-center gradient-animate">
          <div className="w-full max-w-md p-6">
            {/* Logo and App Name */}
            <div className="flex flex-col items-center mb-12 fade-in-up">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 rounded-2xl shadow-xl p-0.5 mb-6 hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <img src="/favicon.svg" alt="Live-in App" className="w-16 h-16" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 mb-2">
                Live-in App
              </h1>
              <p className="text-gray-600 text-center font-medium mb-2">Welcome to your shared finance journey</p>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Track expenses, split bills, and manage your finances together with ease
              </p>
            </div>

            {/* Profile Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 scale-in">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center fade-in-up">Choose Your Profile</h2>
              <p className="text-center text-gray-500 mb-6 fade-in-up">Select your account to continue</p>
              <div className="space-y-3">
                {profiles.map((profile, index) => (
                <button
                  key={profile.name}
                  className="w-full flex items-center bg-white border-2 border-gray-100 rounded-xl px-4 py-4 hover:border-pink-200 hover:bg-pink-50 transition-all duration-300 group"
                  onClick={() => handleProfileSelect(index)}
                >
                  <div className="relative">
                    <img
                      src={profile.img}
                      alt={profile.name}
                      className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-offset-2 ring-pink-300 group-hover:ring-pink-400 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-100 group-hover:bg-pink-100 rounded-full flex items-center justify-center border-2 border-white transition-colors duration-300">
                      <IonIcon icon={chevronForward} className="w-3 h-3 text-gray-500 group-hover:text-pink-500" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                      {profile.name}
                    </div>
                    <div className="text-sm text-gray-500 group-hover:text-pink-400 transition-colors duration-300">
                      Tap to sign in
                    </div>
                  </div>
                </button>
              ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Live-in App. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
