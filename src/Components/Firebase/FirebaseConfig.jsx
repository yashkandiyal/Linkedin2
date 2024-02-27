import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuMzpf9XmGVIi3t91rXvzCLqvVer0bWsM",
  authDomain: "linkedin-clone-831a1.firebaseapp.com",
  projectId: "linkedin-clone-831a1",
  storageBucket: "linkedin-clone-831a1.appspot.com",
  messagingSenderId: "137022567650",
  appId: "1:137022567650:web:55a24dafe891293e011abb",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
