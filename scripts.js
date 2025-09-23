/* Registration */

const uploadBtn = document.querySelector(".profile-image-upload");
const removeBtn = document.querySelector(".profile-image-remove");
const avatarInput = document.getElementById("avatar");
const defaultProfileIcon = document.querySelector(".default-profile-icon");
const form = document.querySelector(".registration-form");

// Handlers for profile image
uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  avatarInput.click();
});

avatarInput.addEventListener("change", () => {
  if (avatarInput.files.length === 0) return;

  const file = avatarInput.files[0];

  if (file.size > 1048576) {
    alert("File size exceeds 1 MB.");
    avatarInput.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Only image files are allowed.");
    avatarInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    defaultProfileIcon.src = e.target.result;
    defaultProfileIcon.classList.remove("default-profile-icon");
    defaultProfileIcon.classList.add("profile-picture-icon");
  };
  reader.readAsDataURL(file);
});

removeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  avatarInput.value = "";
  defaultProfileIcon.src = "images/camera_icon.png";
  defaultProfileIcon.classList.remove("profile-picture-icon");
  defaultProfileIcon.classList.add("default-profile-icon");
});

// Handler for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

  let isValid = true;

  // Client-side validation
  const username = document.getElementById("username").value;
  if (username.length < 3) {
    document.querySelector(".username-message").innerText = "Username must be at least 3 characters.";
    isValid = false;
  }

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    document.querySelector(".password-message").innerText = "Passwords do not match.";
    isValid = false;
  }

  if (password.length < 3) {
    document.querySelector(".password-message").innerText = "Password must be at least 3 characters.";
    isValid = false;
  }

  if (!isValid) {
    return; // Stop if client-side validation fails
  }

  const formData = new FormData(form);
  if (avatarInput.files.length > 0) {
    formData.append("avatar", avatarInput.files[0]);
  }

  try {
  const response = await fetch("https://api.redseam.redberryinternship.ge/api/register", {
    method: "POST",
    body: formData
  });

  const userData = await response.json();
  console.log("Response:", userData);

  // Check if the response was successful
  if (response.ok) {
    window.location.href = "product_listing.html";
    localStorage.setItem("token", userData.token);
  } else {
    // Handle API errors from the JSON body
    const apiErrors = userData.errors;

    if (apiErrors.username) {
      document.querySelector(".username-message").innerText = apiErrors.username[0];
    }
    if (apiErrors.email) {
      document.querySelector(".email-message").innerText = apiErrors.email[0];
    }
  }
} catch (error) {
  // This block is only for network-related errors
  console.error("Error:", error);
  alert("Something went wrong. Please try again.");
}
});


// ===========================

// LOGIN

