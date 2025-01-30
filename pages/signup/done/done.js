document.addEventListener("DOMContentLoaded", function () {
    const ramSlider = document.getElementById("ram");
    const ramValue = document.getElementById("ram-value");

    ramSlider.oninput = function () {
        ramValue.textContent = "RAM: " + ramSlider.value + "GB";
    };
});

document.getElementById('purchase-btn').addEventListener('click', function(event) {
    // Get the form (or container)
    const form = document.querySelector('.plan-selection');

    // Trigger the form validation
    if (form.checkValidity()) {
        // If the form is valid, proceed with your custom actions
        createUser();
        sendPurchaseEmbed();
        navigateTo('../success/success.html', true, 14);
        alert('Redirecting you to our login page.. Please wait..');
    } else {
        // If the form is not valid, prevent form submission (default browser action)
        event.preventDefault();
        // Optionally, you can display a custom message here
        console.log("Please fill in all required fields.");
    }
});


function sendPurchaseEmbed() {
    const email = document.getElementById('user-email').value;
    const discord = document.getElementById('discord-username').value;
    const platform = document.getElementById('platform').value;
    const ram = document.getElementById('ram').value;
    const processor = document.getElementById('processor').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const htype = document.getElementById('htype').value;

    const discordWebhook = "https://discord.com/api/webhooks/1334457000582582303/BF5ZT--YBu_bDc9kc7u1Q9y9ryU7MMNdmmeEVw7axkaf44aAyDRV5DElAY8VSw46Rgyr";

    const discordEmbed = {
        content: null, // No content, only an embed
        embeds: [
            {
                title: "Purchase Log Detected",
                description: `A new user has signed up for IceHosting\n\n**Discord username:** ${discord}\n**Their plan details:**\n  **RAM:** ${ram}GB\n  **Processor:** ${processor}\n  **First Name:** ${firstName}\n  **Last name:** ${lastName}\n**Platform**:${platform}\n**Email:**${email}\n**Hosting Type:**${htype}`,
                color: 1753560,
                author: {
                    name: "IceHosting Signup System"
                }
            }
        ],
        attachments: []
    };

    return fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordEmbed)
    })
    .then(response => {
        if (!response.ok) {
            console.error("Error sending to Discord:", response.statusText);
            return response.text(); // Log the error text for debugging
        }
        return response.json(); // Optional: log the response if needed
    })
    .then(data => {
        console.log("Successfully sent to Discord:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
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
        const response = await fetch("https://162.220.232.28/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log("Response:", result);
        
        if (result.user) {
            alert(`User created successfully! You can login now in https://panel.icehosting.cloud/auth/login`);
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
