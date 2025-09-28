// Mkaes *s in the input fields red

document.addEventListener('DOMContentLoaded', () => {
    const loginEmailInput = document.getElementById('email-login');
    const loginPasswordInput = document.getElementById('password-login');
    
    const inputs = [loginPasswordInput, loginEmailInput];

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

// For Login

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById("email-login").value.trim();
    const password = document.getElementById("password-login").value.trim();

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch("https://api.redseam.redberryinternship.ge/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "product_listing.html";

    } catch (error) {
      alert("Incorrect Email or Password");
    }
  });
});
