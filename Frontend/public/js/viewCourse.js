let courseData = null;


const urlParams = new URLSearchParams(window.location.search);
const courseDataString = urlParams.get('courseData');
if (courseDataString) {
    // Decode the URI component to get the JSON string
    const decodedCourseData = decodeURIComponent(courseDataString);

    // Parse the JSON string back to an object
    courseData = JSON.parse(decodedCourseData);
} else {
    console.log('No course data found in the URL.');
}


const courseTitle = document.getElementById("courseTitle");
const courseDescription = document.getElementById("courseDescription");
const lessonList = document.getElementById('lessonsList');
const lessonContent = document.getElementById('lessonContent');
const backButtonCourse = document.getElementById('back-btn-course');


backButtonCourse.addEventListener('click', function() {
    window.location.href = `/expertDashboard.html`;
})
let lessons = [];

async function fetchLessons() {
    try {
        const response = await fetch(`/expert/courses/${courseData.courseId}/lessons`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const resultLessons = await response.json();

        // Return the lessons data if the fetch is successful
        return resultLessons;

    } catch (error) {
        console.error('Error fetching lessons:', error);
        return null;  // Return null in case of an error
    }
}

// Use an IIFE to fetch and handle lessons asynchronously
(async () => {
    const resultLessons = await fetchLessons();

    if (resultLessons && resultLessons.lessons) {
        lessons = resultLessons.lessons;
        console.log('Lessons:', lessons.length);
        if (lessons.length > 0) {
            lessons.forEach(lesson => {
                const li = document.createElement('li');

                // Create a delete button if course status is draft or rejected
                let deleteButton = '';
                if (courseData.status === 'draft' || courseData.status === 'rejected') {
                    deleteButton = `<button class="delete-lesson-button" onclick="deleteLesson('${lesson.id}')">Delete</button>`; // Add class for styling
                }

                li.innerHTML = `
                    <a href="#" onclick="loadLesson('${lesson.id}')">${lesson.title}</a>
                    ${deleteButton}
                `;
                lessonList.appendChild(li);
            });

            // Add the 'Add Lesson' button if the course is draft or rejected
            addLessonButton();
        } else {
            // If no lessons are available, show a message and the 'Add Lesson' button
            const noLessonsMessage = document.createElement('p');
            noLessonsMessage.textContent = 'No lessons available.';
            noLessonsMessage.style.color = 'white';
            lessonList.appendChild(noLessonsMessage);

            // Add the 'Add Lesson' button if course is draft or rejected
            addLessonButton();
        }


    } else {
        console.log('No lessons found or error fetching lessons.');
        const noLessonsMessage = document.createElement('p');
        noLessonsMessage.textContent = 'No lessons available.';
        noLessonsMessage.style.color = 'white';
        lessonList.appendChild(noLessonsMessage);

        // Add the 'Add Lesson' button if course is draft or rejected
        addLessonButton();
    }
})();

// Display the course details
courseTitle.innerHTML = `Title: ${courseData.title}`;
courseDescription.innerHTML = `<strong>Description</strong>: ${courseData.description}`;

// Function to add 'Add Lesson' button if course is draft or rejected
function addLessonButton() {
    if (courseData.status === 'draft' || courseData.status === 'rejected') {
        const addLessonButton = document.createElement('button');
        addLessonButton.textContent = 'Add Lesson';
        addLessonButton.className = 'add-lesson-button'; // Add class for styling
        addLessonButton.onclick = () => {
            window.location.href = `/lessonManagement/newLesson.html?courseId=${courseData.courseId}`;
        };
        lessonList.appendChild(addLessonButton);
    }
}

// Populate the lesson titles in the navigation or display a message if no lessons are available

// Function to load lesson content
function loadLesson(lessonId) {
    const selectedLesson = lessons.find(lesson => lesson.id === lessonId);

    if (!selectedLesson) {
        alert('Lesson not found');
        return;
    }

    // Clear the lesson content area
    lessonContent.innerHTML = '';

    // Create elements for title and description
    const titleElement = document.createElement('h2');
    titleElement.textContent = selectedLesson.title;
    titleElement.style.fontWeight = '600';
    titleElement.style.fontSize = '18px';

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = selectedLesson.description;
    descriptionElement.style.fontSize = '16px';

    // Create a container for the video and content
    const lessonContainer = document.createElement('div');
    lessonContainer.className = 'lesson-container'; // Add a class for styling

    // Add video if available
    if (selectedLesson.videoPath) {
        const videoElement = document.createElement('video');
        videoElement.setAttribute('controls', '');

        const sourceElement = document.createElement('source');
        sourceElement.src = selectedLesson.videoPath;
        sourceElement.type = 'video/mp4';

        videoElement.appendChild(sourceElement);
        lessonContainer.appendChild(videoElement);
    }

    // Add content if available
    if (selectedLesson.contentPath) {
        const contentElement = document.createElement('iframe');
        contentElement.src = selectedLesson.contentPath;
        contentElement.style.width = '100%';
        contentElement.style.height = '600px';
        contentElement.style.border = 'none';
        lessonContainer.appendChild(contentElement);
    }

    // Append title and description to lessonContent
    lessonContent.appendChild(titleElement);
    lessonContent.appendChild(descriptionElement);
    lessonContent.appendChild(lessonContainer);
}

// Function to delete a lesson
async function deleteLesson(lessonId) {
    alert(`You clicked delete on lesson with ID: ${lessonId}`);
    try {
        const response = await fetch(`/courses/${courseData.courseId}/lessons/${lessonId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const result = await response.json();
        if (result.message === 'Lesson deleted successfully') {
            alert('Lesson deleted successfully');
            location.reload();
        } else {
            alert(`Failed to delete lesson: ${result.error}`);
        }

    } catch (error) {
        console.error('Error deleting lesson:', error);

    }

    // You can handle server requests later
}

