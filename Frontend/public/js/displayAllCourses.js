async function displayAllCourses() {
    try {
        const response = await fetch('http://localhost:5000/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const responseData = await response.json();
        const courses = responseData.courses;  // Get all courses

        const coursesContainer = document.getElementById('courses-list');
        coursesContainer.innerHTML = '';  // Clear previous content

        const coursesHeading = document.createElement('h2');
        coursesHeading.innerText = 'All Courses';
        coursesHeading.classList.add('courses-heading');  // Add class for styling
        coursesContainer.appendChild(coursesHeading);

        if (courses.length === 0) {
            coursesContainer.innerHTML += '<p class="no-courses-message">No courses found.</p>';
            return;
        }

        // Create a grid container for courses
        const gridContainer = document.createElement('div');
        gridContainer.className = 'courses-grid';  // Add class for CSS grid
        coursesContainer.appendChild(gridContainer);

        // Loop through the courses and create course cards
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';  // Add card class

            // Course title
            const topicDiv = document.createElement('div');
            topicDiv.className = 'course-title';
            topicDiv.innerText = `Title: ${course.title}`;

            // Course status
            const statusDiv = document.createElement('div');
            statusDiv.className = `course-status ${course.status}`;  // Dynamic class for status
            statusDiv.innerText = `Status: ${course.status}`;

            // Date created
            const createdDateDiv = document.createElement('div');
            createdDateDiv.className = 'course-created-date';
            createdDateDiv.innerText = `Date created: ${new Date(course.createdAt).toLocaleDateString()}`;

            // Buttons for actions
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'course-actions';  // Add actions div class

            // Update button
            const openButton = document.createElement('button');
            openButton.className = 'open-button';
            openButton.innerHTML = '&#x270D; Open Course';  // Pencil icon
            openButton.onclick = () => {
                window.location.href = `http://localhost:5000/lessonManagement/index.html?courseId=${course.id}`;
            };

            // Append buttons to actions div
            actionsDiv.appendChild(openButton);

            // Append details and actions to the card
            courseCard.appendChild(topicDiv);
            courseCard.appendChild(statusDiv);
            courseCard.appendChild(createdDateDiv);
            courseCard.appendChild(actionsDiv);

            // Append the course card to the grid container
            gridContainer.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

document.addEventListener('DOMContentLoaded', displayAllCourses);