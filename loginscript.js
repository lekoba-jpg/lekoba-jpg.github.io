let users = [
  { username: "doctor1", password: "doc123", role: "doctor" },
  { username: "pharma1", password: "pharma123", role: "pharmacist" },
  { username: "cust1", password: "cust123", role: "customer" }
];
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const msg = document.getElementById("message");

  const user = users.find(u => u.username === username && u.password === password && u.role === role);

  if (user) {
    msg.style.color = "green";
    msg.textContent = "✅ Login successful! Redirecting...";
    sessionStorage.setItem("role", role);

    setTimeout(() => {
      if (role === "customer") {
        window.location.href = "customer.html";
      } else {
        window.location.href = "staff.html";
      }
    }, 1000);
  } else {
    msg.style.color = "red";
    msg.textContent = "❌ Incorrect credentials or role. Try again.";
  }
}

function registerUser() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const role = document.getElementById("reg-role").value;
  const msg = document.getElementById("reg-message");

  if (!username || !password || !role) {
    msg.style.color = "red";
    msg.textContent = "❌ All fields must be filled. Please try again.";
    return;
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    msg.style.color = "red";
    msg.textContent = "❌ Username already taken. Choose another.";
    return;
  }

  users.push({ username, password, role });
  msg.style.color = "green";
  msg.textContent = "✅ Registration successful! Redirecting to login...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}
