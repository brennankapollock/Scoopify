import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0qRtySDxQh-qn_Yvgpqoqp4V52CO-xSE",
  authDomain: "scoopify-19d4f.firebaseapp.com",
  projectId: "scoopify-19d4f",
  storageBucket: "scoopify-19d4f.appspot.com",
  messagingSenderId: "926385483722",
  appId: "1:926385483722:web:f682e48d318b72e11aa933",
  measurementId: "G-53CYJBZG6W"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);