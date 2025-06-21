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

function addMedicine() {
  const name = document.getElementById("med-name").value;
  const qty = parseInt(document.getElementById("med-qty").value);
  const expiry = document.getElementById("med-expiry").value;

  if (!name || !qty || !expiry) {
    alert("Please fill all fields.");
    return;
  }

  db.collection("inventory").add({
    name,
    quantity: qty,
    expiry: new Date(expiry)
  }).then(() => {
    alert("Medicine added!");
    loadInventory();
  });
}

function loadInventory() {
  const list = document.getElementById("inventory-list");
  list.innerHTML = "Loading...";

  db.collection("inventory").get().then(snapshot => {
    if (snapshot.empty) {
      list.innerHTML = "<p>No stock available.</p>";
      return;
    }

    list.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const daysLeft = Math.ceil((new Date(data.expiry.toDate()) - new Date()) / (1000 * 60 * 60 * 24));
      const isLow = data.quantity < 10;
      const isExpiring = daysLeft < 7;

      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${data.name}</strong><br>
        Quantity: ${data.quantity} ${isLow ? "⚠️ Low Stock" : ""}<br>
        Expiry: ${new Date(data.expiry.toDate()).toDateString()} ${isExpiring ? "⚠️ Expiring Soon" : ""}
        <hr>
      `;
      list.appendChild(div);
    });
  });
}

auth.onAuthStateChanged(async user => {
  if (!user) {
    alert("Please log in.");
    window.location.href = "login.html";
    return;
  }

  const doc = await db.collection("users").doc(user.uid).get();
  const data = doc.data();

  if (data.role !== "pharmacist" && data.role !== "admin") {
    alert("Access denied.");
    window.location.href = "index.html";
  } else {
    loadPrescriptions(); // or loadInventory(), etc.
  }
});
