import React, { useState, useContext } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { arrowBack, close } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';
import { UserContext } from '../context/UserContext';
import './PinEntry.css';

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

  const selectedUser = location.state?.user || JSON.parse(sessionStorage.getItem('selectedUser') || 'null');
  const { setUser } = useContext(UserContext);

  // Redirect to onboarding if no user is selected
  React.useEffect(() => {
    if (!selectedUser) {
      history.replace('/dashboard');
    }
  }, [selectedUser, history]);

  const handlePinInput = async (value: string) => {
    if (value === 'clear') {
      setPin('');
      setError('');
    } else if (pin.length < 4) {
      const newPinValue = pin + value;
      setPin(newPinValue);

      if (newPinValue.length === 4) {
        if (selectedUser && ((selectedUser.name === 'Revathy' && newPinValue === '9900') || 
            (selectedUser.name === 'Jegan' && newPinValue === '0099'))) {
          setError('');
          setUser(selectedUser);
          // Store the user in localStorage for persistence
          localStorage.setItem('currentUser', JSON.stringify(selectedUser));
          sessionStorage.removeItem('selectedUser'); // Clean up
          history.replace('/dashboard');
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
          <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 p-4">
            <div className="flex items-center w-full max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-300"
                  onClick={handleBack}
                >
                  <IonIcon icon={arrowBack} className="text-white text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="mt-16 mb-8 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <img 
                  src={selectedUser?.img} 
                  alt={selectedUser?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 bg-clip-text text-transparent">
              {selectedUser?.name}
            </h2>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-gray-700 mb-2">Enter Your PIN</h1>
            <p className="text-gray-500 text-sm">Please enter your 4-digit PIN to continue</p>
          </div>

          {/* PIN Dots */}
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(4)].map((_, index) => (
              <span 
                key={index} 
                className={`w-4 h-4 rounded-full transition-all duration-300 transform
                  ${index < pin.length 
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 scale-110' 
                    : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-6 animate-shake">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Keypad */}
          {!showForgot && (
            <div className="w-full max-w-xs">
              {/* First row: 1 2 3 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-2xl text-2xl font-semibold h-16 
                             hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 
                             transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    onClick={() => handlePinInput(num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              {/* Second row: 4 5 6 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[4, 5, 6].map((num) => (
                  <button
                    key={num}
                    className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-2xl text-2xl font-semibold h-16 
                             hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 
                             transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    onClick={() => handlePinInput(num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              {/* Third row: 7 8 9 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[7, 8, 9].map((num) => (
                  <button
                    key={num}
                    className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-2xl text-2xl font-semibold h-16 
                             hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 
                             transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    onClick={() => handlePinInput(num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              {/* Fourth row: empty 0 clear */}
              <div className="grid grid-cols-3 gap-4">
                <div></div> {/* Empty space */}
                <button
                  className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-2xl text-2xl font-semibold h-16 
                           hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 
                           transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                  onClick={() => handlePinInput('0')}
                >
                  0
                </button>
                <button
                  className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-2xl text-2xl font-semibold h-16 
                           hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-300 
                           transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 text-red-500"
                  onClick={() => handlePinInput('clear')}
                >
                  <IonIcon icon={close} className="text-2xl" />
                </button>
              </div>
            </div>
          )}

          {/* Forgot PIN Link */}
          {!showForgot && (
            <button 
              className="mt-8 text-sm text-gray-500 hover:text-pink-500 transition-colors duration-300 focus:outline-none"
              onClick={() => setShowForgot(true)}
            >
              Forgot your PIN?
            </button>
          )}

          {/* Forgot PIN Modal */}
          {showForgot && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-slideUp">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Reset PIN
                </h2>
                <div className="relative mb-4">
                  <input
                    type="number"
                    maxLength={4}
                    placeholder="Enter new 4-digit PIN"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.slice(0, 4))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 
                             outline-none transition-colors duration-300 text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <button
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 
                             text-white font-semibold hover:opacity-90 transition-opacity duration-300
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={handleChangePin}
                  >
                    Change PIN
                  </button>
                  <button
                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold
                             hover:bg-gray-200 transition-colors duration-300 focus:outline-none"
                    onClick={() => setShowForgot(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PinEntry;
