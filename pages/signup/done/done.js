document.addEventListener("DOMContentLoaded", function () {
    const ramInput = document.getElementById("ram");
    const ramValue = document.getElementById("ram-value");
    const storageInput = document.getElementById("storage");
    const htypeSelect = document.getElementById("htype");
    const platformSelect = document.getElementById("platform");
    const storageType = document.getElementById("storage-type");

    // Update RAM display
    ramInput.addEventListener("input", function () {
        ramValue.textContent = `RAM: ${ramInput.value}GB`;
    });

    // Lock RAM and storage based on hosting type
    htypeSelect.addEventListener("change", function () {
        const selectedType = htypeSelect.value;

        switch (selectedType) {
            case "Budget":
                ramInput.value = 6;
                ramInput.disabled = true;
                storageInput.value = 20;
                storageInput.disabled = true;
                storageType.value = "GB";
                storageType.disabled = true;
                break;
            case "Premium":
                ramInput.value = 10;
                ramInput.disabled = true;
                storageInput.value = 30;
                storageInput.disabled = true;
                storageType.value = "GB";
                storageType.disabled = true;
                break;
            case "Extreme":
                ramInput.value = 16;
                ramInput.disabled = true;
                storageInput.value = 45;
                storageInput.disabled = true;
                storageType.value = "GB";
                storageType.disabled = true;
                break;
            case "Custom":
                ramInput.disabled = false;
                storageInput.disabled = false;
                storageType.disabled = false;
                break;
        }
        ramValue.textContent = `RAM: ${ramInput.value}GB`;
    });

    // Override RAM value based on slider input
    ramInput.oninput = function () {
        let ramText = "RAM: " + ramInput.value + "GB";

        // If the platform is VPS and RAM is above 32GB, set it to "Unlimited"
        if (platformSelect.value === "VPS" && ramInput.value > 999) {
            ramText = "RAM: Unlimited";
        }

        ramValue.textContent = ramText;
    };
});


document.addEventListener("DOMContentLoaded", function () {
    const platformSelect = document.getElementById("platform");
    const plangSelect = document.getElementById("plang");
    const plangLabel = document.getElementById("plang-label");

    // Function to show/hide the Programming Language label and dropdown
    function toggleProgrammingLanguage() {
        if (platformSelect.value === "Discord-Bot") {
            plangSelect.style.display = "inline";  // Show the Programming Language dropdown
            plangLabel.style.display = "inline";  // Show the Programming Language label
        } else {
            plangSelect.style.display = "none";  // Hide the Programming Language dropdown
            plangLabel.style.display = "none";  // Hide the Programming Language label
        }
    }

    // Listen for changes in the Platform dropdown
    platformSelect.addEventListener("change", toggleProgrammingLanguage);

    // Initial check when the page loads
    toggleProgrammingLanguage();
});



function validateFields() {
    // Get all the required input fields
    const fields = [
        document.getElementById('ram'),
        document.getElementById('processor'),
        document.getElementById('platform'),
        document.getElementById('htype'),
        document.getElementById('user-email'),
        document.getElementById('discord-username'),
        document.getElementById('password'),
        document.getElementById('first-name'),
        document.getElementById('last-name'),
        document.getElementById('storage')
    ];

    let valid = true;

    // Check if any field is empty or invalid
    for (let field of fields) {
        if (!field.value) {
            // Display a custom validation message on the field
            field.setCustomValidity("Please fill this field");
            field.reportValidity();  // Trigger the custom validity message
            valid = false;
        } else {
            field.setCustomValidity("");  // Clear any previous custom validity
        }
    }

    return valid;  // Return true if all fields are filled
}

document.getElementById("purchase-btn").onclick = async function (e) {
    e.preventDefault();  // Prevent form submission or button default action

    // Validate the fields before running the actions
    if (!validateFields()) return;

    const promoInput = document.getElementById("promo");
    const promoCode = promoInput.value.trim();

    if (promoCode) {
        try {
            const response = await fetch("https://web-production-7e9e.up.railway.app/promo");
            const promoData = await response.json();

            if (promoData[promoCode]) {
                // Valid promo code, show success message
                showPromoSuccess(promoData[promoCode]);

                // Prevent multiple promo codes from being applied
                promoInput.readOnly = true;  
            } else {
                // Invalid promo code, show error like required field validation
                promoInput.setCustomValidity("This promocode is incorrect");
                promoInput.reportValidity();
                return;
            }
        } catch (error) {
            console.error("Error fetching promo data:", error);
            alert("Failed to validate promo code. Try again later.");
            return;
        }
    }

    try {
        createUser();  // Proceed with user creation
    } catch (e) {
        alert("Failed to create user!");
        console.log(e);
    }
    
    sendPurchaseEmbed();  // Send purchase embed
    alert('Redirecting you to our login page.. Please wait..');  // Show alert
    navigateTo('../success/index.html', true, 30);  // Navigate to success page
};

// Function to show promo success message
function showPromoSuccess(discount) {
    const messageBox = document.createElement("div");
    messageBox.textContent = `You have successfully assigned a ${discount}% off promo code!`;
    messageBox.style.position = "fixed";
    messageBox.style.bottom = "20px";
    messageBox.style.left = "20px";
    messageBox.style.background = "#4CAF50";
    messageBox.style.color = "white";
    messageBox.style.padding = "10px 20px";
    messageBox.style.borderRadius = "5px";
    messageBox.style.fontSize = "14px";
    messageBox.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
    messageBox.style.zIndex = "1000";
    
    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 5000);
}

function sendPurchaseEmbed() {
    const payload = {
        email: document.getElementById('user-email').value,
        discord: document.getElementById('discord-username').value,
        platform: document.getElementById('platform').value,
        ram: document.getElementById('ram').value,
        processor: document.getElementById('processor').value,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        htype: document.getElementById('htype').value,
        storage: document.getElementById('storage').value,
        storage_type: document.getElementById('storage-type').value,
        bot_programming_lang: document.getElementById('plang').value || "Unprovided",
        promocode: document.getElementById("promo").value || "None"
    };

    fetch("https://web-production-7e9e.up.railway.app/sendPurchase", { // Use your real backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => console.log("Response:", data))
    .catch(error => console.error("Error:", error));
}


async function createUser() {
    const userData = {
        email: document.getElementById('user-email').value,
        username: document.getElementById('discord-username').value,
        password: document.getElementById('password').value,
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
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


function navigateTo(url, waitForSeconds = false, delayTime = 25) {

    if (waitForSeconds) {        
        // Wait for the specified number of seconds before redirecting
        setTimeout(function() {
            window.location.href = url;
        }, delayTime * 1000);  // Convert seconds to milliseconds
    } else {
        // Redirect immediately
        window.location.href = url;
    }
}

document.getElementById("details").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const promoCode = document.getElementById("promo").value.trim();
    if (!promoCode) {
        this.submit();
        return;
    }
    
    try {
        const response = await fetch("https://icehosting-usercreation-backend-production.up.railway.app/promo");
        const promoData = await response.json();
        
        if (promoData[promoCode]) {
            const discount = promoData[promoCode];
            showPromoNotification(`You have successfully assigned a ${discount} off promo code!`);
        } else {
            alert("Invalid promo code!");
        }
    } catch (error) {
        console.error("Error checking promo code:", error);
        alert("Failed to verify promo code. Please try again.");
    }
});
