document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const closePopup = document.getElementById("close-popup");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Prepare the popup message
        popupMessage.textContent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

        // Show the popup
        popup.style.display = "flex"; // Use flex to center content

        // Here you can add code to send the data to a server if needed
    });

    // Close the popup when the close button is clicked
    closePopup.addEventListener("click", function () {
        popup.style.display = "none"; // Hide the popup
    });
});
