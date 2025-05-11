// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDc8gQZyLxVnEcXbjtOvQ-xOenaO2U6sdM",
  authDomain: "gccmembership-1d1ee.firebaseapp.com",
  projectId: "gccmembership-1d1ee",
  storageBucket: "gccmembership-1d1ee.firebasestorage.app",
  messagingSenderId: "473904651089",
  appId: "1:473904651089:web:1e93c7e168defd93dd1170",
  measurementId: "G-S9VK2P6N6L"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
