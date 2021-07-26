import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbgakJJzjnoedjTPYeUoVhzBMMypZqeLs",
    authDomain: "kw-housingg.firebaseapp.com",
    projectId: "kw-housingg",
    storageBucket: "kw-housingg.appspot.com",
    messagingSenderId: "1051412657733",
    appId: "1:1051412657733:web:1bf8fc444a0ea6ba31552c",
    measurementId: "G-7N2WY977ZS"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage(); 
const provider = new firebase.auth.GoogleAuthProvider();
  
export { auth, provider, storage};
export default db;