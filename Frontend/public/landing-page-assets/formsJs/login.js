document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form')

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:5000/login', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

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
                            const successPopup = document.getElementById('submit-success-popup');
                            successPopup.innerText = 'Login successful!';
                            successPopup.style.display = 'block';

                            setTimeout(() => {
                                successPopup.style.display = 'none';
                                if (result.role === 'admin') {
                                    window.location.href = '/admin-dashboard';
                                } else if (result.role === 'expert') {
                                    window.location.href = '/expert-dashboard';
                                } else if (result.role === 'learner') {
                                    window.location.href = '/learner-dashboard';
                                }
                            }, 2000);
                        } else {
                            // Show error message
                            const errorPopup = document.getElementById('submit-error-popup');
                            errorPopup.innerText = result.error;
                            errorPopup.style.display = 'block';

                            setTimeout(() => {
                                errorPopup.style.display = 'none';
                            }, 2000);
                        }
                    } catch (e) {
                        const errorPopup = document.getElementById('submit-error-popup');
                        errorPopup.innerText = 'An error occurred. Please try again.';
                        errorPopup.style.display = 'block';

                        setTimeout(() => {
                            errorPopup.style.display = 'none';
                        }, 2000);
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        });
    }
});
