import React, { useState, useContext } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { arrowBack, close } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';
import { UserContext } from '../App';

interface LocationState {
  user: {
    name: string;
    img: string;
    uid: string;
    pin: string;
  };
}

const PinEntry: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');

  const user = location.state?.user || { name: 'User', img: '', uid: '', pin: '' };
  const { setUser } = useContext(UserContext);

  const handlePinInput = async (value: string) => {
    if (value === 'clear') {
      setPin('');
      setError('');
    } else if (pin.length < 4) {
      const newPinValue = pin + value;
      setPin(newPinValue);

      if (newPinValue.length === 4) {
        // Replace with Firebase Auth logic if using email/password
        // For demo, simulate PIN validation
        if (newPinValue === user.pin) {
          setError('');
          setUser(user); // Set global user context
          history.push('/dashboard');
        } else {
          setError('Invalid PIN. Please try again.');
          setPin('');
        }
      }
    }
  };

  // Change PIN logic (to be implemented with Firebase)
  const handleChangePin = () => {
    if (newPin.length === 4) {
      // Here you would update the PIN in Firebase for user.uid
      alert('PIN changed successfully!');
      setShowForgot(false);
      setNewPin('');
    } else {
      setError('PIN must be 4 digits');
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

          {/* Error Message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Keypad */}
          {!showForgot && (
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
          )}

          {/* Forgot PIN Link */}
          {!showForgot && (
            <p className="text-sm text-accent mt-4 cursor-pointer" onClick={() => setShowForgot(true)}>Forgot your PIN?</p>
          )}

          {/* Forgot PIN Modal */}
          {showForgot && (
            <div className="w-full max-w-xs bg-gray-50 rounded-lg p-4 mt-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-gray-900">Reset PIN</h2>
              <input
                type="number"
                maxLength={4}
                placeholder="Enter new 4-digit PIN"
                value={newPin}
                onChange={e => setNewPin(e.target.value.slice(0, 4))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 mb-2"
              />
              <button
                className="w-full bg-primary text-white py-2 rounded-lg font-bold"
                onClick={handleChangePin}
              >Change PIN</button>
              <button
                className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold"
                onClick={() => setShowForgot(false)}
              >Cancel</button>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PinEntry;
