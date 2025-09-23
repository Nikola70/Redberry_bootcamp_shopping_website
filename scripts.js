// Mkaes *s in the input fields red

document.addEventListener('DOMContentLoaded', () => {
    const regUserInput = document.getElementById('username-reg');
    const regEmailInput = document.getElementById('email-reg');
    const regPasswordInput = document.getElementById('password-reg');
    const regConfrimPasswordInput = document.getElementById('confirm-password-reg');
    const loginEmailInput = document.getElementById('email-login');
    const loginPasswordInput = document.getElementById('password-login');
    
    const inputs = [regUserInput, regEmailInput, regPasswordInput, regConfrimPasswordInput, loginPasswordInput, loginEmailInput];

        inputs.filter(input => input).forEach(input => {
        input.addEventListener('focus', () => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                label.style.opacity = '0';
            }
        });

        input.addEventListener('blur', () => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label && input.value.trim() === '') {
                label.style.opacity = '1';
            }
        });
    });
});

/* Registration */

const uploadBtn = document.querySelector(".profile-image-upload");
const removeBtn = document.querySelector(".profile-image-remove");
const avatarInput = document.getElementById("avatar");
const defaultProfileIcon = document.querySelector(".default-profile-icon");

// Handle "Upload Now" → open file picker
uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  avatarInput.click();
});

// Handle file selection → show uploaded image instead of camera icon
avatarInput.addEventListener("change", () => {
  if (avatarInput.files && avatarInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      defaultProfileIcon.src = e.target.result; // replace camera with uploaded image
      defaultProfileIcon.classList.remove("default-profile-icon");
      defaultProfileIcon.classList.add("profile-picture-icon");
    };
    reader.readAsDataURL(avatarInput.files[0]);
  }
});

// Handle "Remove" → reset back to camera icon
removeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  avatarInput.value = ""; // clear file
  defaultProfileIcon.src = "images/camera_icon.png"; // reset to default icon
});

// Handle form submit → send registration request
document.querySelector(".registration-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (document.getElementById("username-reg").value.length < 3) {
    document.querySelector(".username-message").innerText = "Username has to be at least 3 charachters"
  }

  if (document.getElementById("password-reg").value !== document.getElementById("confirm-password-reg").value) {
    document.querySelector(".password-message").innerText = "Passwords do not match";
    return;
  }

  if (document.getElementById("password-reg").value.length < 3) {
    document.querySelector(".password-message").innerText = "Password has to be at least 3 charachters";
    return;
  }

  const formData = new FormData();
  formData.append("username", document.getElementById("username-reg").value);
  formData.append("email", document.getElementById("email-reg").value);
  formData.append("password", document.getElementById("password-reg").value);
  formData.append("password_confirmation", document.getElementById("confirm-password-reg").value);

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

    if (response.ok) {
      window.location.href = "product_listing.html";
      localStorage.setItem("token", userData.token);
    } else {

      const apiErrors = userData.errors;

      // Example: show username and email errors in the page
      if (apiErrors.username) {
        document.querySelector(".username-message").innerText = apiErrors.username.join("This username already exsists");
      }
      if (apiErrors.email) {
        document.querySelector(".email-message").innerText = apiErrors.email.join("This email already exsists");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
});

