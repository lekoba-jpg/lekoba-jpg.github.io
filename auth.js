// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAns-4jD1vgmJ9oL-aXyMzwcYCCX-czL8",
  authDomain: "clinic-auth-3ecd0.firebaseapp.com",
  projectId: "clinic-auth-3ecd0",
  storageBucket: "clinic-auth-3ecd0.firebasestorage.app",
  messagingSenderId: "64122335952",
  appId: "1:64122335952:web:6fe7e8eb502743ddbd64d5",
  measurementId: "G-6YVHSBJ8JZ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function registerUser() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Registered!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });

  return false;
}

function loginUser() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });

  return false;
}
