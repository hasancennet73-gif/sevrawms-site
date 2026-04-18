import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSiUoo5d8LomGdCkVmd76E9gG1NstCXFk",
  authDomain: "sevrawms.firebaseapp.com",
  projectId: "sevrawms",
  storageBucket: "sevrawms.firebasestorage.app",
  messagingSenderId: "828095391902",
  appId: "1:828095391902:web:6b358646d69059901ef38f",
  measurementId: "G-1YP4WHJWBP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
