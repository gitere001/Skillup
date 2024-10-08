// Helper function to get the X-Token from the cookie
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
function displaySessionExpiredMessage() {
    const messageDiv = document.getElementById('session-message');
    messageDiv.innerText = 'Your session has expired. Redirecting to login...';
    messageDiv.style.display = 'block'; // Show the message
    messageDiv.style.color = 'red'; // Optional styling

    // Redirect after 3 seconds
    setTimeout(() => {
        window.location.href = '/loginUsers'; // Redirect to login
    }, 2000); // Adjust time as needed
}


async function monitorSession() {
    setInterval(() => {
        const token = getCookieValue('X-Token');
        if (!token) {
            displaySessionExpiredMessage();
            return;
        }
    }, 1000);
}

async function logout() {
    const logoutLink = document.getElementById('logout');
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!confirm('Are you sure you want to logout?')) {
            return;
        }

        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const result = await response.json();
        console.log('Logout result', result);
        if (result.message === 'success') {
            document.cookie = 'X-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/loginUsers';
        } else {
            alert('Logout failed. try again.');
        }
    });
}

async function fetchWelcomeNote() {
    try {

        // Make the fetch request with the X-Token in the headers
        const response = await fetch('/expert/welcome-note', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);

        const data = await response.json();

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
            if (data.price) {
                data.price = parseInt(data.price);
            }

            try {
                const response = await fetch('http://localhost:5000/courses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                console.log('Response:', response);

                const result = await response.json();
                const messageDiv = document.getElementById('message');
                messageDiv.style.display = 'block'; // Show message div
                messageDiv.style.padding = '10px'; // Add padding
                messageDiv.style.borderRadius = '5px'; // Add rounded corners

                if (result.message === 'success') {
                    messageDiv.textContent = 'Course created successfully, proceed to add lessons';
                    messageDiv.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = '/expert-dashboard';
                    }, 2000);
                } else {
                    messageDiv.textContent = result.error;
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

async function displayExpertCourses() {
    try {

        const response = await fetch('http://localhost:5000/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const responseData = await response.json();
        const courses = responseData.courses;

        const coursesContainer = document.getElementById('courses-list');
        coursesContainer.innerHTML = ''; // Clear previous content

        const coursesHeading = document.createElement('h2');
        coursesHeading.innerText = 'Courses Created';
        coursesHeading.style.marginBottom = '15px';
        coursesContainer.appendChild(coursesHeading);

        if (courses.length === 0) {
            coursesContainer.innerHTML += '<p>No courses available.</p>';
            return;
        }

        // Create a list of courses in grid format
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';

            const topicDiv = document.createElement('div');
            topicDiv.innerText = `Topic: ${course.topic}`;

            const statusDiv = document.createElement('div');
            statusDiv.innerText = `Status: ${course.status}`;

            const createdDateDiv = document.createElement('div');
            createdDateDiv.innerText = `Date created: ${course.createdAt}`;

            const actionsDiv = document.createElement('div');
            const openButton = document.createElement('button');
            openButton.innerText = 'Open';
            openButton.onclick = () => {
                const courseId = course.id;

                window.location.href = `/lessons/${courseId}`;

              };


            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = async () => {
                if (course.status !== 'draft' && course.status !== 'rejected') {
                    alert('You can only delete courses in draft or rejected status.');
                    return;
                }
            const confirmDelete = confirm(`Are you sure you want to delete course: ${course.topic}?`);
            if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/courses/${course.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            if (response.ok) {
                // Remove the course card from the DOM
                coursesContainer.removeChild(courseCard);
                alert('Course deleted successfully.');
            } else {
                const result = await response.json();
                alert(`Failed to delete course: ${result.error}`);
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Error deleting course. Please try again.');
         }
        }
        };


            actionsDiv.appendChild(openButton);
            actionsDiv.appendChild(deleteButton);

            courseCard.appendChild(topicDiv);
            courseCard.appendChild(statusDiv);
            courseCard.appendChild(createdDateDiv);
            courseCard.appendChild(actionsDiv);

            coursesContainer.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Call fetchWelcomeNote on DOMContentLoaded and set up course creation and display courses
document.addEventListener('DOMContentLoaded', () => {
    fetchWelcomeNote();
    createCourse();
    displayExpertCourses();
    logout();
    monitorSession();
});
