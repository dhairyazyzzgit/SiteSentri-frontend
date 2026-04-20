import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyANLJeoZAjQMi_oKhytaTO4-eiAnlzQgJQ",
  authDomain: "sitesentri3.firebaseapp.com",
  projectId: "sitesentri3",
  storageBucket: "sitesentri3.firebasestorage.app",
  messagingSenderId: "294238194913",
  appId: "1:294238194913:web:9875a67a19c423a8e6fba0",
  measurementId: "G-FTDS71BLF8"
};
 // PASTE HERE


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;