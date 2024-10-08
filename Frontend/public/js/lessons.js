// Get references to the modal and the form
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('add-lesson-modal');
const lessonForm = document.getElementById('add-lesson-form');
const messageDiv = document.getElementById('message');
const addLessonBtn = document.getElementById('open-modal-btn');

const courseTitleSpan = document.getElementById('course-topic');
const courseStatusSpan = document.getElementById('course-status');
const courseDescriptionSpan = document.getElementById('course-description');
const coursePriceSpan = document.getElementById('course-price');
const updateCourseBtnContainer = document.getElementById('update-course-btn'); // Updated to match HTML structure
const submitReviewBtnContainer = document.getElementById('submit-review-btn'); // Updated to match HTML structure

const toggleLessonsBtn = document.getElementById('toggle-lessons-btn');
const existingLessonsContainer = document.getElementById('existing-lessons');

const pathParts = window.location.pathname.split('/');
const courseId = pathParts[pathParts.length - 1];
const BASE_URL = 'http://localhost:5000';
let course = null;

// Function to show the modal
function showModal() {
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

function createUpdateCourseButton(courseId) {
    removeUpdateCourseButton(); // Ensure existing button is removed
    const updateButton = document.createElement('updateButton');
    updateButton.innerText = 'Update Course Details';
    updateButton.onclick = () => {
        alert(`Update course details button clicked for id ${courseId}`);
    };
    updateCourseBtnContainer.appendChild(updateButton); // Append to the correct button container
}

function createSubmitReviewButton() {
    removeSubmitReviewButton(); // Ensure existing button is removed
    const submitButton = document.createElement('submitButton');
    submitButton.innerText = 'Submit Course for Review';
    submitButton.onclick = () => {
        const confirmSubmission = confirm("Are you sure you want to submit this course for review?");
        if (confirmSubmission) {
            alert('Course submitted for review!');
            // Here you can add additional code to handle the submission
        } else {
            alert('Submission cancelled.');
        }
    };
    submitReviewBtnContainer.appendChild(submitButton); // Append to the correct button container
}

function removeSubmitReviewButton() {
    // Remove any existing buttons in the submit review container
    while (submitReviewBtnContainer.firstChild) {
        submitReviewBtnContainer.removeChild(submitReviewBtnContainer.firstChild);
    }
}

function removeUpdateCourseButton() {
    // Remove any existing buttons in the update course container
    while (updateCourseBtnContainer.firstChild) {
        updateCourseBtnContainer.removeChild(updateCourseBtnContainer.firstChild);
    }
}

// Call these functions after the page has loaded or course details have been fetched
window.onload = () => {
    fetchCourseDetails(); // Fetch course details on load
};

async function fetchCourseDetails() {
    try {
        const response = await fetch(`http://localhost:5000/courses/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const result = await response.json();
            if (result.course) {
                course = result.course;
                courseTitleSpan.innerText = course.topic;
                courseStatusSpan.innerText = course.status;
				courseDescriptionSpan.innerText = course.description;
				coursePriceSpan.innerText = `Kes ${course.price}`;

                if (course.status === 'draft' || course.status === 'rejected') {
                    submitReviewBtnContainer.style.display = 'inline-block';
                    createSubmitReviewButton();

                } else {
                    submitReviewBtnContainer.style.display = 'none';
					updateCourseBtnContainer.style.display = 'none'
					addLessonBtn.style.display = 'none'
                }

                createUpdateCourseButton(courseId); // Always create the update button
            } else {
                console.error('Error fetching course data:', result.error);
                courseTitleSpan.innerText = 'N/A';
                courseStatusSpan.innerText = 'N/A';
            }
        }
    } catch (error) {
        console.error(error);
        courseTitleSpan.innerText = 'N/A';
        courseStatusSpan.innerText = 'N/A';
    }
}

async function handleLessonSubmission(e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(lessonForm);

    try {
        const response = await fetch(`http://localhost:5000/courses/${courseId}/lessons`, {
            method: 'POST',
            body: formData // Send the form data
        });

        const result = await response.json();

        // Check if the network request was successful
        if (response.ok) {
            // Check if the result contains a success message or an error message
            if (result.message) {
                messageDiv.innerText = 'Lesson added successfully!';
                messageDiv.style.color = 'green';

                // Close the modal and reset the form after 2 seconds
                setTimeout(() => {
                    closeModal();
                    lessonForm.reset();
                    messageDiv.innerText = '';
                    location.reload();
                }, 2000);
            } else if (result.error) {
                // Show the error message if present in the result
                messageDiv.innerText = result.error;
                messageDiv.style.color = 'red';
            }
        } else {
            // Handle any other response status (e.g., 400, 500, etc.)
            messageDiv.innerText = result.error || 'Something went wrong. Please try again.';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        // Catch and handle any errors that occur during the fetch request
        console.error('Fetch error:', error);
        messageDiv.innerText = 'Error adding lesson. Please try again.';
        messageDiv.style.color = 'red';
    }
}
async function fetchExistingLessons() {
    try {
        const response = await fetch(`http://localhost:5000/expert/courses/${courseId}/lessons`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            displayLessons(result.lessons); // Call the function to display lessons
        } else {
            console.error('Error fetching lessons:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}



function displayLessons(lessons) {
    const lessonItemsDiv = document.getElementById('lesson-items');
    lessonItemsDiv.innerHTML = ''; // Clear previous lessons

    if (lessons.length === 0) {
        lessonItemsDiv.innerHTML = '<p>No lessons available yet.</p>';
        return;
    }

    lessons.forEach((lesson) => {
        const lessonDiv = document.createElement('div');
        lessonDiv.classList.add('lesson-item');
        lessonDiv.id = `lesson-${lesson.id}`; // Set a unique ID for each lesson

        // Create the lesson card with Delete button (if course is draft or rejected)
        lessonDiv.innerHTML = `
            <div class="lesson-card" style="
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 10px;
                margin-bottom: 10px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                background-color: #f9f9f9;
                transition: transform 0.3s, box-shadow 0.3s;">
                <h4 class="lesson-title" style="font-size: 1.5em; color: #333;">Title: ${lesson.title}</h4>
                <p class="lesson-description" style="color: #666;">Description: ${lesson.description || 'No description available.'}</p>
                <div class="lesson-buttons" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <button id="toggleButton-${lesson.id}" class="button" style="
                        padding: 5px 10px;
                        border: none;
                        border-radius: 5px;
                        background-color: #007bff;
                        color: white;
                        cursor: pointer;
                        transition: background-color 0.3s, transform 0.2s;">View Content</button>
                    <button id="deleteButton-${lesson.id}" class="delete-button" style="
                        padding: 5px 10px;
                        border: none;
                        border-radius: 5px;
                        background-color: #ff4d4d;
                        color: white;
                        cursor: pointer;
                        transition: background-color 0.3s, transform 0.2s;">Delete</button>
                </div>
                <div id="content-${lesson.id}" class="lesson-content" style="display: none; margin-top: 15px;"></div>
            </div>
        `;

        lessonItemsDiv.appendChild(lessonDiv);

        const toggleButton = document.getElementById(`toggleButton-${lesson.id}`);
        const contentDiv = document.getElementById(`content-${lesson.id}`);
        const deleteButton = document.getElementById(`deleteButton-${lesson.id}`);

        // Toggle lesson content visibility
        toggleButton.addEventListener('click', function () {
            if (contentDiv.style.display === 'none') {
                let videoHtml = '';
                let contentHtml = '';

                if (lesson.videoPath) {
                    videoHtml = `
                        <div class="video-container" style="margin-bottom: 15px;">
                            <video width="100%" height="400px" controls>
                                <source src="${BASE_URL}/${lesson.videoPath}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    `;
                }

                if (lesson.contentPath) {
                    contentHtml = `
                        <div class="iframe-container" style="margin-top: 10px;">
                            <iframe src="${BASE_URL}/${lesson.contentPath}" width="100%" height="500px" style="border: none;"></iframe>
                        </div>
                    `;
                } else {
                    contentHtml = '<p>No document uploaded.</p>';
                }

                contentDiv.innerHTML = videoHtml + contentHtml;
                contentDiv.style.display = 'block';
                toggleButton.innerText = 'Hide Content';
            } else {
                contentDiv.style.display = 'none';
                toggleButton.innerText = 'View Content';
            }
        });

        // Handle Delete button click
        deleteButton.addEventListener('click', function () {
            alert(`Delete lesson: ${lesson.title}`);
            // Here you can add the logic for actual deletion
        });
    });
}

// Function to toggle existing lessons
function toggleExistingLessons() {
    if (existingLessonsContainer.style.display === 'none') {
        // Check if lessons exist
        const lessonItemsDiv = document.getElementById('lesson-items');
        if (lessonItemsDiv.children.length === 0) {
            lessonItemsDiv.innerHTML = '<p>No available lessons.</p>'; // Show the message if no lessons
        }

        existingLessonsContainer.style.display = 'block';
        toggleLessonsBtn.innerText = 'Hide Existing Lessons';
    } else {
        existingLessonsContainer.style.display = 'none';
        toggleLessonsBtn.innerText = 'View Existing Lessons';
    }
}









// Call fetchCourseDetails when the page loads
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM fully loaded and parsed');
	fetchCourseDetails();
	fetchExistingLessons();
});

openModalBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', closeModal);
lessonForm.addEventListener('submit', handleLessonSubmission);
toggleLessonsBtn.addEventListener('click', toggleExistingLessons);

