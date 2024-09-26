document.addEventListener('DOMContentLoaded', () => {
	const loginLink = document.getElementById('login-user');
	const loginForm = document.getElementById('login-form')
	

	if (loginForm) {
		loginForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(loginForm);
			const data = Object.fromEntries(formData);
			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://localhost:5000/login', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			const messageDiv = document.getElementById('message');
            messageDiv.style.display = 'block'; // Ensure the message div is visible
            messageDiv.style.padding = '10px'; // Add padding
            messageDiv.style.borderRadius = '5px'; // Optional: rounded corners

			xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        console.log('Result received:', result);

                        if (result.message === 'success') {
                            // Set cookie with X-Token and expiry based on role
                            const expiryTime = result.role === 'admin' ? 2 * 60 * 60 * 1000 : // 2 hours
                                               result.role === 'expert' ? 5 * 60 * 60 * 1000 : // 5 hours
                                               24 * 60 * 60 * 1000; // 24 hours
                            const expires = new Date(Date.now() + expiryTime).toUTCString();
                            document.cookie = `X-Token=${result['X-Token']}; expires=${expires}; path=/`;

                            // Show success message and redirect after 2 seconds
                            messageDiv.textContent = 'Login successful!';
                            messageDiv.style.color = 'green';

                                // Redirect based on role
                                if (result.role === 'admin') {
                                    window.location.href = '/admin-dashboard';
                                } else if (result.role === 'expert') {
                                    window.location.href = '/expert-dashboard';
                                } else if (result.role === 'learner') {
                                    window.location.href = '/learner-dashboard';
                                }

                        } else {
                            // Show error message
                            messageDiv.textContent = result.error;
                            messageDiv.style.color = 'red';
                        }
                    } catch (e) {
                        messageDiv.textContent = 'Error parsing response.';
                        messageDiv.style.color = 'red';
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        });
    }
	loginLink.addEventListener('click', (e) => {
		e.preventDefault()
		window.location.href = '/loginUsers';

	})

});