// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOycMjuIcngN_tYUhXdUDj7qFLqqSQSMA",
  authDomain: "web-survey-project.firebaseapp.com",
  projectId: "web-survey-project",
  storageBucket: "web-survey-project.appspot.com",
  messagingSenderId: "539224553403",
  appId: "1:539224553403:web:58b8aa349f86361678b69e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };