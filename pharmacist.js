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

// Load prescriptions
function loadPrescriptions() {
  const list = document.getElementById('prescription-list');
  db.collection("prescriptions").get().then(snapshot => {
    if (snapshot.empty) {
      list.innerHTML = "<p>No prescriptions found.</p>";
      return;
    }

    list.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.style.marginBottom = "20px";

      card.innerHTML = `
        <p><strong>User:</strong> ${data.userId}</p>
        <p><strong>File:</strong> <a href="${data.fileURL}" target="_blank">${data.fileName}</a></p>
        <p><strong>Date:</strong> ${new Date(data.uploadedAt.toDate()).toLocaleString()}</p>
        <p><strong>Status:</strong> ${data.status || "Pending"}</p>
        <button onclick="updateStatus('${doc.id}', 'Approved')">✅ Approve</button>
        <button onclick="updateStatus('${doc.id}', 'Rejected')">❌ Reject</button>
        <hr />
      `;

      list.appendChild(card);
    });
  });
}

function updateStatus(docId, newStatus) {
  db.collection("prescriptions").doc(docId).update({
    status: newStatus
  }).then(() => {
    alert("Status updated to " + newStatus);
    loadPrescriptions(); // reload UI
  });
}

// Start
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

