import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOoKSNUyIrkAn0ls_V3ADorSXfT_EqIws",
  authDomain: "projectnova-1da7e.firebaseapp.com",
  projectId: "projectnova-1da7e",
  storageBucket: "projectnova-1da7e.firebasestorage.app",
  messagingSenderId: "210473988801",
  appId: "1:210473988801:web:f577ff0508268ac53e9a40",
  measurementId: "G-V4763DHVME",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const githubProvider = new GithubAuthProvider();

export default app;