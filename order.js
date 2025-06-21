// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAns-4jD1vgmJ9oL-aXyMzwcYCCX-czL8",
  authDomain: "clinic-auth-3ecd0.firebaseapp.com",
  projectId: "clinic-auth-3ecd0",
  storageBucket: "clinic-auth-3ecd0.firebasestorage.app",
  messagingSenderId: "64122335952",
  appId: "1:64122335952:web:6fe7e8eb502743ddbd64d5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function loadMedicines() {
  const dropdown = document.getElementById("medication-dropdown");
  db.collection("inventory").get().then(snapshot => {
    dropdown.innerHTML = "<option disabled selected>Select medication</option>";
    snapshot.forEach(doc => {
      const med = doc.data();
      dropdown.innerHTML += `<option value="${doc.id}">${med.name} (Qty: ${med.quantity})</option>`;
    });
  });
}

function placeOrder() {
  const qty = parseInt(document.getElementById("order-qty").value);
  const address = document.getElementById("delivery-address").value;
  const medId = document.getElementById("medication-dropdown").value;
  const status = document.getElementById("order-status");

  if (!qty || !address || !medId) {
    status.textContent = "Please fill all fields.";
    return;
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection("orders").add({
        userId: user.uid,
        medId,
        quantity: qty,
        address,
        orderedAt: new Date(),
        status: "Pending"
      }).then(() => {
        status.textContent = "✅ Order placed successfully!";
      }).catch(err => {
        status.textContent = "❌ Error placing order: " + err.message;
      });
    } else {
      status.textContent = "Please log in first.";
    }
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    loadMedicines();
  } else {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
});
