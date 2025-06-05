import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB31SlqSOA5ltuXlBXT8Xxud_qHUtNOq0Q",
  authDomain: "mxtm-investment-platform.firebaseapp.com",
  projectId: "mxtm-investment-platform",
  storageBucket: "mxtm-investment-platform.firebasestorage.app",
  messagingSenderId: "185739830490",
  appId: "1:185739830490:web:cff0ee8f2c4be5d399b1e3",
  measurementId: "G-L68X7ZMDZ2",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Analytics only on client side
let analytics
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app)
  })
}

export { analytics }
