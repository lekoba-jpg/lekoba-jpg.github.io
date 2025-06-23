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

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const list = document.getElementById("orders-list");

  db.collection("orders").where("userId", "==", user.uid).orderBy("orderedAt", "desc").get()
    .then(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = "<p>No orders found.</p>";
        return;
      }

      list.innerHTML = "";
      snapshot.forEach(async doc => {
        const data = doc.data();

        // Optional: get medicine name from inventory
        let medName = "Unknown";
        const medDoc = await db.collection("inventory").doc(data.medId).get();
        if (medDoc.exists) {
          medName = medDoc.data().name;
        }

        const div = document.createElement("div");
        div.innerHTML = `
          <strong>${medName}</strong><br>
          Quantity: ${data.quantity}<br>
          Status: <b>${data.status}</b><br>
          Delivery: ${data.address}<br>
          Ordered at: ${new Date(data.orderedAt.toDate()).toLocaleString()}
          <hr>
        `;
        list.appendChild(div);
      });
    });
});
