import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyCu1SGOO8AuECKoE7Cp3EB1eMe9x0Gl_qA",
  authDomain: "live-in-dd521.firebaseapp.com",
  databaseURL: "https://live-in-dd521-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "live-in-dd521",
  storageBucket: "live-in-dd521.appspot.com",
  messagingSenderId: "532598159874",
  appId: "1:532598159874:web:570eae5d894134ce33051b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const realtimeDb = getDatabase(app);

