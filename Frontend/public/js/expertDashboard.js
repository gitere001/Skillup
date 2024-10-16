
const addNewCourseButton = document.getElementById('add-course-btn')


addNewCourseButton.addEventListener('click', () => {
    window.location.href = '/newCourseForm.html';
})


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
        window.location.href = '/landing-page/login.html'; // Redirect to login
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
            window.location.href = '/landing-page/login.html';
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
        coursesHeading.innerText = 'Courses in progress';
        coursesHeading.classList.add('courses-heading');  // Add class
        coursesContainer.appendChild(coursesHeading);

        if (courses.length === 0) {
            coursesContainer.innerHTML += '<p class="no-courses-message">No courses available.</p>';
            return;
        }


        // Create a list of courses in grid format
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';

            const topicDiv = document.createElement('div');
            topicDiv.className = 'course-title';
            topicDiv.innerText = `Title: ${course.title}`;

            const statusDiv = document.createElement('div');
            statusDiv.className = 'course-status';
            statusDiv.innerText = `Status: ${course.status}`;

            const createdDateDiv = document.createElement('div');
            createdDateDiv.className = 'course-created-date';
            createdDateDiv.innerText = `Date created: ${course.createdAt}`;

            const actionsDiv = document.createElement('div');
            const openButton = document.createElement('button');
            openButton.className = 'open-button';
            openButton.innerHTML = '&#x270D; update course';

            openButton.onclick = () => {


                // Construct the URL correctly with a single ? for the first parameter
                window.location.href = `http://localhost:5000/lessonManagement/index.html?courseId=${course.id}`;
            };



            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';

            deleteButton.innerHTML = '&#128465; Delete Course';
            deleteButton.onclick = async () => {
                if (course.status !== 'draft' && course.status !== 'rejected') {
                    alert('You can only delete courses in draft or rejected status.');
                    return;
                }
            const confirmDelete = confirm(`Are you sure you want to delete course: ${course.title}?`);
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
                getCoursesOverallDetails();
                location.reload();
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
async function getCoursesOverallDetails() {
    try {
        const response = await fetch('http://localhost:5000/expert/courses/overall-details', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }

        });

        const result = await response.json(); // Getting the data from the API response
        console.log("gotten overall details", result);
        document.getElementById('total-courses').innerText = result.totalCourses || 0;
        document.getElementById('approved-courses').innerText = result.approvedCourses || 0;
        document.getElementById('pending-courses').innerText = result.pendingApprovalCourses || 0;
        document.getElementById('draft-courses').innerText = result.draftCourses || 0;
        document.getElementById('rejected-courses').innerText = result.rejectedCourses || 0;
        const totalEarnings = document.getElementById('total-earnings');
        totalEarnings.innerText = `Ksh ${result.totalEarnings}` || 0;
        totalEarnings.style.fontWeight = 'bold';
        totalEarnings.style.color = '#000000';
        totalEarnings.style.fontSize = '18px';
        const pendingDisbursement = document.getElementById('pending-payment-courses')
        pendingDisbursement.innerText = `Ksh ${result.pendingDisbursement}` || 0;
        pendingDisbursement.style.fontWeight = 'bold';
        pendingDisbursement.style.color = '#000000';
        pendingDisbursement.style.fontSize = '18px';

    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Call fetchWelcomeNote on DOMContentLoaded and set up course creation and display courses
document.addEventListener('DOMContentLoaded', () => {
    fetchWelcomeNote();
    displayExpertCourses();
    logout();
    monitorSession();
    getCoursesOverallDetails();
});
