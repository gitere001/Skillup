document.addEventListener('DOMContentLoaded', () => {

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

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        console.log('Result received:', result);

                        if (result.message === 'success') {
							const successPopup = document.getElementById('submit-success-popup');
                			successPopup.innerText = 'Registration successful! Redirecting to login page...';
                			successPopup.style.display = 'block';

                            setTimeout(() => {
                                console.log('window.location.href:', window.location.href);
								successPopup.style.display = 'none';
                                // window.location.href = '/loginUsers';
                            }, 2000);
                        } else {
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
    if (learnerForm) {
        learnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(learnerForm);
            const data = Object.fromEntries(formData);
            data.role = 'learner';

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:5000/register', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        const result = JSON.parse(xhr.responseText);

                        if (result.message === 'success') {
							const successPopup = document.getElementById('submit-success-popup');
                			successPopup.innerText = 'Registration successful! Redirecting to login page...';
                			successPopup.style.display = 'block';


                            setTimeout(() => {
								successPopup.style.display = 'none';
                                // window.location.href = '/loginUsers';
                            }, 2000);
                        } else {
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