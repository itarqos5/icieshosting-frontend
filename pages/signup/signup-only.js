async function createUser() {
    const userData = {
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        first_name: document.getElementById('firstname').value,
        last_name: document.getElementById('lastname').value,
        language: "en",
        root_admin: false
    };

    try {
        const response = await fetch("https://web-production-7e9e.up.railway.app/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        // Check if the response is ok (status code 2xx)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();  // Read response as text first
        if (!text) {
            throw new Error("Empty response body");
        }

        const result = JSON.parse(text);  // Parse as JSON
        console.log("Response:", result);

        if (result.user) {
            alert(`User created successfully!\n You can login now in https://panel.icehosting.cloud/auth/login`);
        } else {
            alert("Failed to create user.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to create user.");
    }
}
