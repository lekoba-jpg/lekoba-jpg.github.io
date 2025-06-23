// Initialize Firebase (reuse the same config)
const firebaseConfig = {
  apiKey: "AIzaSyBAns-4jD1vgmJ9oL-aXyMzwcYCCX-czL8",
  authDomain: "clinic-auth-3ecd0.firebaseapp.com",
  projectId: "clinic-auth-3ecd0",
  storageBucket: "clinic-auth-3ecd0.firebasestorage.app",
  messagingSenderId: "64122335952",
  appId: "1:64122335952:web:6fe7e8eb502743ddbd64d5"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();

// Upload function
function uploadPrescription() {
  const fileInput = document.getElementById('file-upload');
  const file = fileInput.files[0];
  const status = document.getElementById('status');

  if (!file) {
    status.textContent = "Please select a file first.";
    return;
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      const storageRef = storage.ref(`prescriptions/${user.uid}/${file.name}`);
      storageRef.put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(downloadURL => {
          return db.collection("prescriptions").add({
            userId: user.uid,
            fileName: file.name,
            uploadedAt: new Date(),
            fileURL: downloadURL
          });
        })
        .then(() => {
          status.textContent = "Prescription uploaded successfully.";
        })
        .catch(err => {
          status.textContent = "Upload failed: " + err.message;
        });
    } else {
      status.textContent = "Please log in first.";
    }
  });
}
