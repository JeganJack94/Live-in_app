import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { arrowBack, close } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';

interface LocationState {
  user: {
    name: string;
    img: string;
  };
}

const PinEntry: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [pin, setPin] = useState<string>('');

  const user = location.state?.user || { name: 'User', img: '' };

  const handlePinInput = (value: string) => {
    if (value === 'clear') {
      setPin('');
    } else if (pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin);

      if (newPin.length === 4) {
        // Simulate PIN validation
        if (newPin === '1234') {
          history.push('/dashboard');
        } else {
          alert('Invalid PIN. Please try again.');
          setPin('');
        }
      }
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
          {/* Header Section */}
          <div className="flex items-center w-full max-w-md mb-6">
            <IonIcon icon={arrowBack} className="text-gray-700 text-2xl cursor-pointer" onClick={handleBack} />
            <div className="flex items-center ml-4">
              <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <p className="ml-2 text-lg font-semibold text-primary">{user.name}</p>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Your PIN</h1>
            <p className="text-gray-600 text-base">Please enter your 4-digit PIN to continue</p>
          </div>

          {/* PIN Dots */}
          <div className="flex gap-2 mb-6">
            {[...Array(4)].map((_, index) => (
              <span key={index} className={`w-3 h-3 rounded-full ${index < pin.length ? 'bg-gray-900' : 'bg-gray-300'}`}></span>
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
            {[...Array(10)].map((_, index) => (
              <button
                key={index}
                className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg text-lg font-bold h-14 hover:bg-gray-200"
                onClick={() => handlePinInput(index.toString())}
              >
                {index}
              </button>
            ))}
            <button
              className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg text-lg font-bold h-14 text-accent hover:bg-gray-200"
              onClick={() => handlePinInput('clear')}
            >
              <IonIcon icon={close} />
            </button>
          </div>

          {/* Forgot PIN Link */}
          <p className="text-sm text-accent mt-4 cursor-pointer">Forgot your PIN?</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PinEntry;
