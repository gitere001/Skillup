// Helper function to get the X-Token from the cookie
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Return null if the cookie is not found
}

async function logout() {
	const logoutLink = document.getElementById('logout')
	logoutLink.addEventListener('click', async (e) => {
		e.preventDefault()
		const response = await fetch('http://localhost:5000/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const result = await response.json()
		if (result.message === 'success') {
			document.cookie = 'X-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			window.location.href = '/loginUsers';
		}

	})

}

async function fetchWelcomeNote() {
    try {
        // Get the X-Token from the cookie
        const token = getCookieValue('X-Token');
        console.log("Token:", token);

        if (!token) throw new Error('User is not authenticated'); // Handle case where the token is missing

        // Make the fetch request with the X-Toke in the headers
        const response = await fetch('/expert/welcome-note', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);

        const data = await response.json();
        console.log("Welcome Note Data:", data);

        // Display the welcome note in the DOM
        document.getElementById('welcome-note').innerText = data.response;
    } catch (error) {
        console.error('Error fetching welcome note:', error);
    }
}

async function createCourse() {
    const courseForm = document.getElementById('course-form');

    if (courseForm) {
        courseForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(courseForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('http://localhost:5000/course', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Token': getCookieValue('X-Token') // Include the token in the header
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);

                const result = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.style.display = 'block'; // Show message div
                messageDiv.style.padding = '10px'; // Add padding
                messageDiv.style.borderRadius = '5px'; // Add rounded corners

                if (result.message === 'success') {
                    messageDiv.textContent = 'Course created successfully!';
                    messageDiv.style.color = 'green';
                } else {
                    messageDiv.textContent = result.error || 'Failed to create course';
                    messageDiv.style.color = 'red';
                }

            } catch (error) {
                console.error('Error submitting course:', error);
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = 'Error submitting course. Please try again.';
                messageDiv.style.color = 'red';
            }
        });
    }

    // Handle navigation to course creation page
    const courseLink = document.getElementById('create-course');
    if (courseLink) {
        courseLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/create-course';
        });
    }
}

// Call fetchWelcomeNote on DOMContentLoaded and set up course creation
document.addEventListener('DOMContentLoaded', () => {
    fetchWelcomeNote(); // Fetch welcome note on page load
    createCourse(); // Set up the course creation form
});
