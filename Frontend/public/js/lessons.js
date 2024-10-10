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
// Get the file input and remove buttons
const contentInput = document.getElementById('content');
const removeContentBtn = document.getElementById('removeContentBtn');
const videoInput = document.getElementById('video');
const removeVideoBtn = document.getElementById('removeVideoBtn');

// Show 'Remove Content' button when a content file is selected
contentInput.addEventListener('change', function() {
    if (contentInput.files.length > 0) {
        removeContentBtn.style.display = 'inline'; // Show the button
    } else {
        removeContentBtn.style.display = 'none'; // Hide the button if no file is selected
    }
});

// Show 'Remove Video' button when a video file is selected
videoInput.addEventListener('change', function() {
    if (videoInput.files.length > 0) {
        removeVideoBtn.style.display = 'inline'; // Show the button
    } else {
        removeVideoBtn.style.display = 'none'; // Hide the button if no file is selected
    }
});

// Handle 'Remove Content' button click
removeContentBtn.addEventListener('click', function() {
    contentInput.value = ''; // Clear the selected content file
    removeContentBtn.style.display = 'none'; // Hide the button
});

// Handle 'Remove Video' button click
removeVideoBtn.addEventListener('click', function() {
    videoInput.value = ''; // Clear the selected video file
    removeVideoBtn.style.display = 'none'; // Hide the button
});


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
    submitButton.onclick = async () => {
        const confirmSubmission = confirm("Are you sure you want to submit this course for review?");
        if (confirmSubmission) {
            const response = await fetch(`http://localhost:5000/courses/${courseId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            console.log(response); // Log the response for debugging

                const result = await response.json();

                // Show the success popup if message exists
                if (result.message) {
                    const successPopup = document.getElementById('submit-success-popup');
                    successPopup.innerText = 'Course submitted successfully';
                    successPopup.style.display = 'block'; // Show the popup

                    // Close the popup and reset the form after 2 seconds
                    setTimeout(() => {
                        successPopup.style.display = 'none';
                        location.reload();
                    }, 2000);
                } else {
                    // Show the error popup if no message
                    const errorPopup = document.getElementById('submit-error-popup');
                    errorPopup.innerText = result.error || 'An unknown error occurred';
                    errorPopup.style.display = 'block';

                    // Hide error popup after a delay
                    setTimeout(() => {
                        errorPopup.style.display = 'none';
                    }, 2000); // Added a duration for hiding the error popup
                }

            } else {
                alert('Submission cancelled.');
            }


    };

    submitReviewBtnContainer.appendChild(submitButton);
}// Append to the correct button container


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

    // Show the spinner when submission starts
    document.getElementById('spinner').style.display = 'block';
    const spinnerMessage = document.getElementById('spinner-message');
    spinnerMessage.innerText = 'Submitting lesson...';
    spinnerMessage.style.display = 'block';


    try {
        const response = await fetch(`http://localhost:5000/courses/${courseId}/lessons`, {
            method: 'POST',
            body: formData // Send the form data
        });

        const result = await response.json();

        // Hide the spinner after processing the response
        document.getElementById('spinner').style.display = 'none';
        spinnerMessage.style.display = 'none';

        // Check if the network request was successful
        if (response.ok) {
            // Check if the result contains a success message or an error message
            if (result.message) {
                // Show the success popup
                const successPopup = document.getElementById('success-popup');
                successPopup.innerText = 'Lesson added successfully!';
                successPopup.style.display = 'block'; // Show the popup

                // Close the popup and reset the form after 2 seconds
                setTimeout(() => {
                    successPopup.style.display = 'none'; // Hide the popup
                    closeModal();
                    lessonForm.reset();
                    location.reload();
                }, 2000);
            } else if (result.error) {
                const errorPopup = document.getElementById('error-popup');
                errorPopup.innerText = result.error;
                errorPopup.style.display = 'block'; // Show the error popup
                setTimeout(() => {
                    errorPopup.style.display = 'none'; // Hide the popup


                }, 2000);
            }
        } else {
            console.error('Error adding lesson:', result.error);
            const errorPopup = document.getElementById('error-popup');
            errorPopup.innerText = result.error;
            errorPopup.style.display = 'block'; // Show the error popup
            setTimeout(() => {
                errorPopup.style.display = 'none'; // Hide the popup
            }, 2000);
        }
    } catch (error) {
        // Catch and handle any errors that occur during the fetch request
        console.error('Fetch error:', error);
        const errorPopup = document.getElementById('error-popup');
        errorPopup.innerText = 'An error occurred. Please try again later.';
        errorPopup.style.display = 'block'; // Show the error popup
        setTimeout(() => {
            errorPopup.style.display = 'none'; // Hide the popup
        }, 2000);
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
                width: 70%;
                margin: 0 auto;
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
        deleteButton.addEventListener('click', async function () {
            const confirmDelete = confirm(`Are you sure you want to delete lesson: ${lesson.title}?`);
            if (!confirmDelete) {
                return;
            }
            if (course.status !== 'draft' || course.status === 'rejected') {
                alert('Cannot delete lesson in draft or rejected status');
                return;
            }
            const response = await fetch(`http://localhost:5000/courses/${courseId}/lessons/${lesson.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json()
                if (result.message) {
                    lessonDiv.remove();
                    alert(`lesson: ${lesson.title} Deleted successfully`);


                } else {
                    alert(`Error: ${result.error}`)
                    return;
                }
            }
        });
    });
}

// Function to toggle existing lessons
function toggleExistingLessons() {
    if (existingLessonsContainer.style.display === 'none') {
        // Check if lessons exist
        const lessonItemsDiv = document.getElementById('lesson-items');
        if (lessonItemsDiv.children.length === 0) {
            lessonItemsDiv.innerHTML =  '<p style="font-size: 2em; color: #4a90e2; text-align: center; margin-top: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">No Available Lessons</p>'
            // Show the message if no lessons
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

