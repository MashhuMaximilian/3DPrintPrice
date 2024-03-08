// firebaseStorage.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7NLYPpWUyiPFeLc1J0UMtOxJW5XDGvqU",
  authDomain: "dprintprice.firebaseapp.com",
  projectId: "dprintprice",
  storageBucket: "dprintprice.appspot.com",
  messagingSenderId: "54492454428",
  appId: "1:54492454428:web:57317b9a79032de8af09d9",
  measurementId: "G-4PHMNP7V33"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;