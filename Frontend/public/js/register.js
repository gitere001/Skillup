document.addEventListener('DOMContentLoaded', () => {
    const expertLink = document.getElementById('register-expert');
    const learnerLink = document.getElementById('register-learner');

    const expertForm = document.getElementById('expert-form');
    const learnerForm = document.getElementById('learner-form');
    if (expertForm) {
        expertForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission
            const formData = new FormData(expertForm);
            const data = Object.fromEntries(formData);
            data.role = 'expert';

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:5000/register', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            const messageDiv = document.getElementById('message');
            messageDiv.style.display = 'block'; // Ensure the message div is visible
            messageDiv.style.padding = '10px'; // Add padding
            // messageDiv.style.border = '1px solid #ccc'; // Optional: border for visibility
            messageDiv.style.borderRadius = '5px'; // Optional: rounded corners

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        console.log('Result received:', result);

                        if (result.message === 'success') {
                            console.log('xhr status:', xhr.status);
                            messageDiv.textContent = 'Registration successful!';
                            messageDiv.style.color = 'green';
                            setTimeout(() => {
                                window.location.href = '/loginUsers';
                            }, 2000);
                        } else {
                            messageDiv.textContent = result.error;
                            messageDiv.style.color = 'red';
                            // expertForm.reset(); // Optional: Reset form fields after error
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
    if (learnerForm) {
        learnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(learnerForm);
            const data = Object.fromEntries(formData);
            data.role = 'learner';

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:5000/register', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            const messageDiv = document.getElementById('message');
            messageDiv.style.display = 'block';
            messageDiv.style.padding = '10px';
            // messageDiv.style.border = '1px solid #ccc';
            messageDiv.style.borderRadius = '5px';

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        console.log('Result received:', result);

                        if (result.message === 'success') {
                            console.log('xhr status:', xhr.status);
                            messageDiv.textContent = 'Registration successful!';
                            messageDiv.style.color = 'green';
                            setTimeout(() => {
                                window.location.href = '/loginUsers';
                            }, 2000);
                        } else {
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

    expertLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register-expert';
    });

    learnerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register-learner';
    });
});
