firebase.initializeApp({
  apiKey: "AIzaSyBAns-4jD1vgmJ9oL-aXyMzwcYCCX-czL8",
  authDomain: "clinic-auth-3ecd0.firebaseapp.com",
  projectId: "clinic-auth-3ecd0"
});

const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(async user => {
  if (!user) {
    alert("Login required.");
    window.location.href = "login.html";
    return;
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  const role = userDoc.data()?.role;
  if (role !== "pharmacist" && role !== "admin") {
    alert("Unauthorized.");
    window.location.href = "index.html";
    return;
  }

  loadOrders();
});

function loadOrders() {
  const list = document.getElementById("order-list");
  db.collection("orders").get().then(snapshot => {
    list.innerHTML = "";
    snapshot.forEach(async doc => {
      const order = doc.data();
      const medDoc = await db.collection("inventory").doc(order.medId).get();
      const medName = medDoc.exists ? medDoc.data().name : "Unknown";

      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${medName}</strong> - Qty: ${order.quantity}<br>
        Address: ${order.address}<br>
        Status: <b>${order.status}</b><br>
        <button onclick="updateStatus('${doc.id}', 'Approved')">✅ Approve</button>
        <button onclick="updateStatus('${doc.id}', 'Delivered')">📦 Deliver</button>
        <button onclick="updateStatus('${doc.id}', 'Rejected')">❌ Reject</button>
        <hr>
      `;
      list.appendChild(div);
    });
  });
}

function updateStatus(orderId, newStatus) {
  db.collection("orders").doc(orderId).update({ status: newStatus })
    .then(() => {
      alert("Order updated to: " + newStatus);
      loadOrders();
    });
}
