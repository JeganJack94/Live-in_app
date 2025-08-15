import React from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useHistory } from 'react-router';

const profiles = [
  {
    name: 'Revathy',
    img: '/Revathy.jpeg',
    color: 'text-red-500',
    uid: 'userA-uid',
    pin: '1234',
  },
  {
    name: 'Jegan',
    img: '/Jegan.jpg',
    color: 'text-red-500',
    uid: 'userB-uid',
    pin: '5678',
  },
];

const Onboarding: React.FC = () => {
  const history = useHistory();

  const handleProfileSelect = (index: number) => {
    const selectedUser = profiles[index];
    history.push('/pin-entry', { user: selectedUser });
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-white">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Welcome Back</h1>
            <p className="text-center text-gray-500 mb-8">Choose your profile to continue</p>
            <div className="space-y-4">
              {profiles.map((profile, index) => (
                <button
                  key={profile.name}
                  className="w-full flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 hover:bg-gray-50 transition"
                  onClick={() => handleProfileSelect(index)}
                >
                  <img
                    src={profile.img}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${profile.color}`}>{profile.name}</div>
                    <div className="text-sm text-gray-500">Tap to sign in</div>
                  </div>
                  <IonIcon icon={chevronForward} className="w-5 h-5 text-gray-400 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
