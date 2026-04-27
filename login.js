const USERS_KEY = "swamiFlowersUsers";
const SESSION_KEY = "swamiFlowersSession";

function seedUsers() {
  const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (existingUsers.length > 0) {
    return existingUsers;
  }

  const seededUsers = [
    {
      name: "Demo Customer",
      phone: "9876543210",
      email: "demo@swamiflowers.com",
      password: "demo123",
      role: "customer",
    },
    {
      name: "Store Admin",
      phone: "9767917384",
      email: "admin@swamiflowers.com",
      password: "admin123",
      role: "admin",
    },
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers));
  return seededUsers;
}

function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    }),
  );
}

function showMessage(message) {
  window.alert(message);
}

function switchTab(tabName) {
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  document.querySelectorAll(".auth-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${tabName}Panel`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  seedUsers();

  const session = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (session) {
    window.location.href = "index.html";
    return;
  }

  const tabFromQuery =
    new URLSearchParams(window.location.search).get("mode") || "login";
  switchTab(["login", "signup", "admin"].includes(tabFromQuery) ? tabFromQuery : "login");

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  document
    .getElementById("loginPageForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const users = seedUsers();
      const email = document.getElementById("loginPageEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPagePassword").value;

      const user = users.find(
        (entry) =>
          entry.email.toLowerCase() === email &&
          entry.password === password &&
          entry.role === "customer",
      );

      if (!user) {
        showMessage("Invalid customer login details.");
        return;
      }

      setSession(user);
      window.location.href = "index.html";
    });

  document
    .getElementById("signupPageForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const users = seedUsers();
      const name = document.getElementById("signupPageName").value.trim();
      const phone = document.getElementById("signupPagePhone").value.trim();
      const email = document.getElementById("signupPageEmail").value.trim().toLowerCase();
      const password = document.getElementById("signupPagePassword").value;
      const confirmPassword = document.getElementById("signupPageConfirmPassword").value;

      if (password !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
      }

      if (users.some((user) => user.email.toLowerCase() === email)) {
        showMessage("An account with this email already exists.");
        return;
      }

      const newUser = {
        name,
        phone,
        email,
        password,
        role: "customer",
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setSession(newUser);
      window.location.href = "index.html";
    });

  document
    .getElementById("adminPageForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const users = seedUsers();
      const email = document.getElementById("adminPageEmail").value.trim().toLowerCase();
      const password = document.getElementById("adminPagePassword").value;

      const user = users.find(
        (entry) =>
          entry.email.toLowerCase() === email &&
          entry.password === password &&
          entry.role === "admin",
      );

      if (!user) {
        showMessage("Invalid admin login details.");
        return;
      }

      setSession(user);
      window.location.href = "index.html";
    });
});
