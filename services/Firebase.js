import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBwBDQtk4PR7s3bKyBCrmNqhKsp3PiveSQ",
    authDomain: "projetopoo-ii.firebaseapp.com",
    projectId: "projetopoo-ii",
    storageBucket: "projetopoo-ii.appspot.com",
    messagingSenderId: "428167303342",
    appId: "1:428167303342:web:7a003166ce7b5fb8921d3f",
    measurementId: "G-X3YSJF9PJN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

isSupported().then(supported => {
  if (supported) {
    const analytics = getAnalytics(app);
  }
});

export { auth, db };
