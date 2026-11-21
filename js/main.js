// ========== GLOBAL VARIABLES ==========
let tutors = [];
let users = [];
let currentUser = null;
let currentTutor = null;
let currentBookingTutor = null;
let selectedRating = 0;
let bookings = [];

// ========== INITIALIZE DATA ==========
function initData() {
  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  } else {
    users = [
      {
        id: 1,
        name: "Admin User",
        email: "admin@tutor.com",
        password: "admin123",
        type: "admin",
        joined: "2026",
        phone: "",
        location: "",
        profilePic: null,
      },
      {
        id: 2,
        name: "Test Student",
        email: "student@test.com",
        password: "student123",
        type: "student",
        joined: "2026",
        phone: "01712345678",
        location: "Dhanmondi",
        profilePic: null,
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (localStorage.getItem("tutors")) {
    tutors = JSON.parse(localStorage.getItem("tutors"));
  } else {
    tutors = [
      {
        id: 1,
        name: "Dr. Abdur Rahman",
        email: "rahman@tutor.com",
        password: "tutor123",
        type: "tutor",
        phone: "01711111111",
        subject: "Math",
        baseRate: 3500,
        perDayRate: 600,
        location: "Dhanmondi",
        qualification: "PhD in Mathematics, DU",
        experience: 12,
        bio: "Award-winning mathematician.",
        avatar: "👨‍🏫",
        rating: 4.9,
        totalRatings: 128,
        reviews: [],
        profilePic: null,
      },
      {
        id: 2,
        name: "Prof. Fatema Begum",
        email: "fatema@tutor.com",
        password: "tutor123",
        type: "tutor",
        phone: "01822222222",
        subject: "English",
        baseRate: 4000,
        perDayRate: 700,
        location: "Gulshan",
        qualification: "PhD in English, Oxford",
        experience: 15,
        bio: "Oxford-educated professor.",
        avatar: "👩‍🏫",
        rating: 4.95,
        totalRatings: 245,
        reviews: [],
        profilePic: null,
      },
      {
        id: 3,
        name: "Dr. Hasan Mahmud",
        email: "hasan@tutor.com",
        password: "tutor123",
        type: "tutor",
        phone: "01933333333",
        subject: "Physics",
        baseRate: 3800,
        perDayRate: 650,
        location: "Uttara",
        qualification: "M.Sc in Physics, BUET",
        experience: 10,
        bio: "Physics expert.",
        avatar: "👨‍🔬",
        rating: 4.7,
        totalRatings: 89,
        reviews: [],
        profilePic: null,
      },
    ];
    localStorage.setItem("tutors", JSON.stringify(tutors));
  }

  if (localStorage.getItem("bookings")) {
    bookings = JSON.parse(localStorage.getItem("bookings"));
  } else {
    bookings = [];
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }

  updateStats();
}

function updateStats() {
  const totalTutorsSpan = document.getElementById("totalTutors");
  const totalStudentsSpan = document.getElementById("totalStudents");
  if (totalTutorsSpan) totalTutorsSpan.textContent = tutors.length;
  if (totalStudentsSpan)
    totalStudentsSpan.textContent = users.filter(
      (u) => u.type === "student",
    ).length;
}

// ========== UTILITY FUNCTIONS ==========
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

function getStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) stars += i <= rating ? "★" : "☆";
  return stars;
}

// ========== MODAL HELPERS ==========
function showModal(id) {
  if (document.getElementById(id))
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
  if (document.getElementById(id))
    document.getElementById(id).style.display = "none";
}
function switchModal(id) {
  closeAllModals();
  showModal(id);
}
function closeAllModals() {
  document
    .querySelectorAll(".modal")
    .forEach((m) => (m.style.display = "none"));
}

// ========== NAVIGATION ==========
function showHome() {
  if (document.getElementById("homeSection"))
    document.getElementById("homeSection").style.display = "flex";
  if (document.getElementById("tutorsSection"))
    document.getElementById("tutorsSection").style.display = "none";
  if (document.getElementById("profileSection"))
    document.getElementById("profileSection").style.display = "none";
  if (document.getElementById("becomeTutorSection"))
    document.getElementById("becomeTutorSection").style.display = "none";
  if (document.getElementById("searchSubject"))
    document.getElementById("searchSubject").value = "";
  if (document.getElementById("searchLocation"))
    document.getElementById("searchLocation").value = "";
}

function showTutors() {
  if (document.getElementById("homeSection"))
    document.getElementById("homeSection").style.display = "none";
  if (document.getElementById("tutorsSection"))
    document.getElementById("tutorsSection").style.display = "block";
  if (document.getElementById("profileSection"))
    document.getElementById("profileSection").style.display = "none";
  if (document.getElementById("becomeTutorSection"))
    document.getElementById("becomeTutorSection").style.display = "none";
  displayTutors(tutors);
}

function showProfile() {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Please login first");
    showModal("loginModal");
    return;
  }
  if (document.getElementById("homeSection"))
    document.getElementById("homeSection").style.display = "none";
  if (document.getElementById("tutorsSection"))
    document.getElementById("tutorsSection").style.display = "none";
  if (document.getElementById("profileSection"))
    document.getElementById("profileSection").style.display = "block";
  if (document.getElementById("becomeTutorSection"))
    document.getElementById("becomeTutorSection").style.display = "none";
  loadProfileData();
}

function showBecomeTutor() {
  if (document.getElementById("homeSection"))
    document.getElementById("homeSection").style.display = "none";
  if (document.getElementById("tutorsSection"))
    document.getElementById("tutorsSection").style.display = "none";
  if (document.getElementById("profileSection"))
    document.getElementById("profileSection").style.display = "none";
  if (document.getElementById("becomeTutorSection"))
    document.getElementById("becomeTutorSection").style.display = "block";
}

// ========== PROFILE FUNCTIONS ==========
function getProfilePictureHtml(user) {
  if (user && user.profilePic) {
    return `<img src="${user.profilePic}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">`;
  } else {
    return `<div style="width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #C6A43F, #a8882e); display:flex; align-items:center; justify-content:center; font-size:3rem;">👤</div>`;
  }
}

function loadProfileData() {
  if (!currentUser) return;

  if (currentUser.type === "tutor") {
    const tutor = tutors.find((t) => t.email === currentUser.email);
    document.getElementById("profileContent").innerHTML = `
            <div style="text-align:center;">
                ${getProfilePictureHtml(currentUser)}
                <h3>${currentUser.name}</h3>
                <p>${currentUser.email}</p>
                <p><strong>Phone:</strong> ${currentUser.phone || "Not set"}</p>
                <p><strong>Location:</strong> ${currentUser.location || "Not set"}</p>
                <p><strong>Subject:</strong> ${tutor?.subject || "Not set"}</p>
                <p><strong>Rating:</strong> ${getStars(tutor?.rating || 0)} (${tutor?.totalRatings || 0} reviews)</p>
                <button class="btn-edit-profile" onclick="openEditProfileModal()">Edit Profile</button>
                <button class="btn-profile" onclick="logout()" style="margin-top:1rem;">Logout</button>
            </div>
            <div style="margin-top:2rem;">
                <h3>My Students</h3>
                <div id="myStudentsList"></div>
            </div>
        `;
    const myBookings = bookings.filter(
      (b) => b.tutorEmail === currentUser.email,
    );
    const studentsList = document.getElementById("myStudentsList");
    if (studentsList) {
      if (myBookings.length === 0)
        studentsList.innerHTML = "<p>No students yet.</p>";
      else
        studentsList.innerHTML = myBookings
          .map(
            (b) =>
              `<div style="background:#f5f5f5; padding:1rem; margin:0.5rem 0; border-radius:10px;"><strong>${b.studentName}</strong> - ${b.subject}<br>${b.days} days/week | ৳${b.total}/month</div>`,
          )
          .join("");
    }
  } else {
    let userBookings = bookings.filter(
      (b) => b.studentEmail === currentUser.email,
    );
    document.getElementById("profileContent").innerHTML = `
            <div style="text-align:center;">
                ${getProfilePictureHtml(currentUser)}
                <h3>${currentUser.name}</h3>
                <p>${currentUser.email}</p>
                <p><strong>Phone:</strong> ${currentUser.phone || "Not set"}</p>
                <p><strong>Location:</strong> ${currentUser.location || "Not set"}</p>
                <button class="btn-edit-profile" onclick="openEditProfileModal()">Edit Profile</button>
                <button class="btn-profile" onclick="logout()" style="margin-top:1rem;">Logout</button>
            </div>
            <div style="margin-top:2rem;">
                <h3>My Bookings (${userBookings.length})</h3>
                ${
                  userBookings.length === 0
                    ? "<p>No bookings yet.</p>"
                    : userBookings
                        .map(
                          (b) =>
                            `<div style="background:#f5f5f5; padding:1rem; margin:0.5rem 0; border-radius:10px;"><strong>${b.tutor}</strong> - ${b.subject}<br>${b.days} days/week | ৳${b.total}/month</div>`,
                        )
                        .join("")
                }
            </div>
        `;
  }
}

function previewProfilePicture(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("profilePicPreview");
      if (preview)
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    };
    reader.readAsDataURL(file);
  }
}

function openEditProfileModal() {
  if (document.getElementById("editName"))
    document.getElementById("editName").value = currentUser.name;
  if (document.getElementById("editEmail"))
    document.getElementById("editEmail").value = currentUser.email;
  if (document.getElementById("editPhone"))
    document.getElementById("editPhone").value = currentUser.phone || "";
  if (document.getElementById("editLocation"))
    document.getElementById("editLocation").value = currentUser.location || "";
  showModal("editProfileModal");
}

function saveProfileChanges() {
  if (!currentUser) return;
  if (document.getElementById("editName"))
    currentUser.name = document.getElementById("editName").value;
  if (document.getElementById("editEmail"))
    currentUser.email = document.getElementById("editEmail").value;
  if (document.getElementById("editPhone"))
    currentUser.phone = document.getElementById("editPhone").value;
  if (document.getElementById("editLocation"))
    currentUser.location = document.getElementById("editLocation").value;

  const fileInput = document.getElementById("profilePicUpload");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      currentUser.profilePic = e.target.result;
      finalizeSave();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    finalizeSave();
  }
}

function finalizeSave() {
  const userIndex = users.findIndex((u) => u.email === currentUser.email);
  if (userIndex !== -1) users[userIndex] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  if (currentUser.type === "tutor") {
    const tutorIndex = tutors.findIndex((t) => t.email === currentUser.email);
    if (tutorIndex !== -1) {
      tutors[tutorIndex].name = currentUser.name;
      tutors[tutorIndex].phone = currentUser.phone;
      tutors[tutorIndex].location = currentUser.location;
      localStorage.setItem("tutors", JSON.stringify(tutors));
    }
  }
  showToast("Profile updated!");
  closeModal("editProfileModal");
  loadProfileData();
}

// ========== BECOME A TUTOR ==========
function applyAsTutor() {
  if (!document.getElementById("applyName")) return;
  const name = document.getElementById("applyName").value;
  const email = document.getElementById("applyEmail").value;
  const password = document.getElementById("applyPassword").value;
  const phone = document.getElementById("applyPhone").value;
  const subject = document.getElementById("applySubject").value;
  const rate = parseInt(document.getElementById("applyRate").value);
  const location = document.getElementById("applyLocation").value;
  const qualification = document.getElementById("applyQualification").value;
  const bio = document.getElementById("applyBio").value;

  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !subject ||
    !rate ||
    !location ||
    !qualification ||
    !bio
  ) {
    showToast("Please fill all fields");
    return;
  }
  if (users.find((u) => u.email === email)) {
    showToast("Email already exists");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    type: "tutor",
    joined: new Date().getFullYear().toString(),
    phone,
    location,
    profilePic: null,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  const newTutor = {
    id: Date.now(),
    name,
    email,
    password,
    type: "tutor",
    phone,
    subject,
    baseRate: rate,
    perDayRate: Math.round(rate / 7),
    location,
    qualification,
    experience: 1,
    bio,
    avatar: "👨‍🏫",
    rating: 0,
    totalRatings: 0,
    reviews: [],
    profilePic: null,
  };
  tutors.push(newTutor);
  localStorage.setItem("tutors", JSON.stringify(tutors));

  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  showToast("Application submitted! You are now a tutor.");
  showProfile();
}

// ========== TUTOR DISPLAY ==========
function displayTutors(tutorsArray) {
  const container = document.getElementById("tutorsList");
  if (!container) return;
  if (!tutorsArray || tutorsArray.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; padding:2rem;">No tutors found.</p>';
    return;
  }

  container.innerHTML = tutorsArray
    .map(
      (t) => `
        <div class="tutor-card">
            <div class="tutor-header">
                <div style="width:80px; height:80px; border-radius:50%; margin:0 auto 1rem; overflow:hidden;">
                    ${t.profilePic ? `<img src="${t.profilePic}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:3rem;">${t.avatar}</span>`}
                </div>
                <h3>${t.name}</h3><p>${t.subject} Specialist</p>
            </div>
            <div class="tutor-body">
                <div class="tutor-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${t.location}</p>
                    <p><i class="fas fa-graduation-cap"></i> ${t.qualification}</p>
                    <p><i class="fas fa-calendar-alt"></i> ৳${t.baseRate}/month</p>
                </div>
                <div class="tutor-rating"><span class="stars">${getStars(t.rating)}</span> <span>(${t.totalRatings})</span></div>
                <div class="tutor-actions">
                    <button class="btn-profile" onclick="viewTutor(${t.id})">View Profile</button>
                    <button class="btn-book" onclick="openBooking(${t.id})">Book Now</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// 🛠️ FIXED: Search Function
function searchTutors() {
  if (!document.getElementById("searchSubject")) return;

  const subjectInput = document
    .getElementById("searchSubject")
    .value.trim()
    .toLowerCase();
  const locationInput = document
    .getElementById("searchLocation")
    .value.trim()
    .toLowerCase();

  let filtered = tutors.filter((t) => {
    const matchSubject =
      subjectInput === "" || t.subject.toLowerCase().includes(subjectInput);
    const matchLocation =
      locationInput === "" || t.location.toLowerCase().includes(locationInput);
    return matchSubject && matchLocation;
  });

  displayTutors(filtered);

  // Change view WITHOUT resetting the array
  if (document.getElementById("homeSection"))
    document.getElementById("homeSection").style.display = "none";
  if (document.getElementById("tutorsSection"))
    document.getElementById("tutorsSection").style.display = "block";
  if (document.getElementById("profileSection"))
    document.getElementById("profileSection").style.display = "none";
  if (document.getElementById("becomeTutorSection"))
    document.getElementById("becomeTutorSection").style.display = "none";
}

// 🛠️ FIXED: Filter by quick buttons
function filterSubject(subject) {
  if (document.getElementById("searchSubject"))
    document.getElementById("searchSubject").value = subject;

  const filtered = tutors.filter(
    (t) => t.subject.toLowerCase() === subject.toLowerCase(),
  );
  displayTutors(filtered);

  // Change view WITHOUT resetting the array
  if (document.getElementById("homeSection"))
    document.getElementById("homeSection").style.display = "none";
  if (document.getElementById("tutorsSection"))
    document.getElementById("tutorsSection").style.display = "block";
  if (document.getElementById("profileSection"))
    document.getElementById("profileSection").style.display = "none";
  if (document.getElementById("becomeTutorSection"))
    document.getElementById("becomeTutorSection").style.display = "none";
}

// 🛠️ FIXED: Filter by dropdown
function filterBySubject() {
  if (!document.getElementById("filterSubject")) return;
  const subject = document.getElementById("filterSubject").value;

  if (subject === "") {
    displayTutors(tutors);
  } else {
    const filtered = tutors.filter(
      (t) => t.subject.toLowerCase() === subject.toLowerCase(),
    );
    displayTutors(filtered);
  }
}

function sortTutors() {
  if (!document.getElementById("sortBy")) return;
  const sortBy = document.getElementById("sortBy").value;
  let sorted = [...tutors];
  if (sortBy === "rating-high") sorted.sort((a, b) => b.rating - a.rating);
  else if (sortBy === "price-low")
    sorted.sort((a, b) => a.baseRate - b.baseRate);
  else if (sortBy === "price-high")
    sorted.sort((a, b) => b.baseRate - a.baseRate);
  displayTutors(sorted);
}

function viewTutor(id) {
  const t = tutors.find((t) => t.id === id);
  if (!t) return;
  document.getElementById("tutorDetails").innerHTML = `
        <div style="text-align:center;">
            <div style="width:100px; height:100px; border-radius:50%; margin:0 auto 1rem; overflow:hidden;">
                ${t.profilePic ? `<img src="${t.profilePic}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:4rem;">${t.avatar}</span>`}
            </div>
            <h2>${t.name}</h2><p class="gold">${t.subject} Specialist</p>
            <div class="stars">${getStars(t.rating)} (${t.totalRatings} reviews)</div>
            <div style="margin:1rem 0; text-align:left;">
                <p><strong>📍 Location:</strong> ${t.location}</p>
                <p><strong>🎓 Qualification:</strong> ${t.qualification}</p>
                <p><strong>💰 Monthly:</strong> ৳${t.baseRate}</p>
            </div>
            <button class="modal-btn" onclick="openBooking(${t.id});closeModal('tutorModal')">Book Now</button>
        </div>
    `;
  showModal("tutorModal");
}

function openBooking(id) {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Please login first");
    showModal("loginModal");
    return;
  }
  const t = tutors.find((t) => t.id === id);
  if (!t) return;
  currentBookingTutor = t;
  document.getElementById("bookingInfo").innerHTML =
    `<h3>${t.name}</h3><p>${t.subject}</p>`;
  updateBookingPrice();
  showModal("bookingModal");
}

function updateBookingPrice() {
  if (!currentBookingTutor) return;
  const days = parseInt(document.getElementById("bookingDays").value);
  const total =
    currentBookingTutor.baseRate + (days - 4) * currentBookingTutor.perDayRate;
  document.getElementById("priceBreakdown").innerHTML =
    `Total: ৳${total}/month`;
}

function confirmBooking() {
  if (!currentBookingTutor || !currentUser) return;
  const days = parseInt(document.getElementById("bookingDays").value);
  const total =
    currentBookingTutor.baseRate + (days - 4) * currentBookingTutor.perDayRate;
  bookings.push({
    id: Date.now(),
    tutor: currentBookingTutor.name,
    tutorEmail: currentBookingTutor.email,
    subject: currentBookingTutor.subject,
    days,
    total,
    date: new Date().toLocaleDateString(),
    studentName: currentUser.name,
    studentEmail: currentUser.email,
  });
  localStorage.setItem("bookings", JSON.stringify(bookings));
  showToast(`Booked ${currentBookingTutor.name} for ৳${total}/month`);
  closeModal("bookingModal");
}

function setRating(r) {
  selectedRating = r;
  document.querySelectorAll(".stars-input span").forEach((s, i) => {
    if (i < r) s.classList.add("active");
    else s.classList.remove("active");
  });
}

function submitRating() {
  if (!selectedRating) {
    showToast("Select a rating");
    return;
  }
  closeModal("ratingModal");
  showToast("Thanks for rating!");
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  initData();
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
});

// ========== CHATBOT FUNCTIONS ==========
function toggleChat() {
  const win = document.getElementById("chat-window");
  if (win) {
    win.style.display = win.style.display === "none" ? "flex" : "none";
  }
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (!message) return;

  const messagesDiv = document.getElementById("chat-messages");

  // Add user message to UI
  messagesDiv.innerHTML += `<div style="background:#C6A43F; color:white; padding:0.8rem; border-radius:10px; max-width:80%; align-self:flex-end; word-wrap:break-word;">${message}</div>`;
  input.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // 🛑 BLOCK CHATBOT ON LOCALHOST
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    messagesDiv.innerHTML += `<div style="background:#ffebee; color:#c62828; padding:0.8rem; border-radius:10px; max-width:80%; align-self:flex-start; border: 1px solid #ffcdd2; word-wrap:break-word;">
      <strong>Local Mode:</strong> The AI chatbot is disabled locally. It will work automatically on your live deployed website!
    </div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return; // Stops the function here, so it doesn't call the server
  }

  // 🟢 PRODUCTION MODE (Runs when deployed online)
  try {
    const response = await fetch(
      "https://tutorlink-backend-d1oa.onrender.com/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      },
    );

    const data = await response.json();

    // Add bot reply to UI
    messagesDiv.innerHTML += `<div style="background:white; padding:0.8rem; border-radius:10px; max-width:80%; align-self:flex-start; box-shadow:0 2px 5px rgba(0,0,0,0.05); word-wrap:break-word;">${data.reply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    console.error("Chat error:", error);
    messagesDiv.innerHTML += `<div style="color:red; font-size:0.8rem; text-align:center; width:100%;">Error: Could not reach the AI server.</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}
