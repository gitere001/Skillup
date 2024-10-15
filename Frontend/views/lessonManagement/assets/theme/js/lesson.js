
const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('add-lesson-modal');
const lessonForm = document.getElementById('add-lesson-form');
const addNewLessonButton = document.getElementById('addNewLesson');
const closeTop = document.getElementById('x')



const contentInput = document.getElementById('content');
const removeContentBtn = document.getElementById('removeContentBtn');
const videoInput = document.getElementById('video');
const removeVideoBtn = document.getElementById('removeVideoBtn');

addNewLessonButton.addEventListener('click', showModal)
closeModalBtn.addEventListener('click', closeModal)
closeTop.addEventListener('click', closeModal)
lessonForm.addEventListener('submit', addNewLesson)

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

function showModal() {
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

const url = new URL(window.location.href);
const courseDataString = url.searchParams.get('courseData');
let courseData;
let courseId;
let course;

if (courseDataString) {
    courseData = JSON.parse(decodeURIComponent(courseDataString));
    course = courseData.course
    courseId = course.courseId;
    console.log('course Id', courseId)
    console.log('course', course)
} else {
    console.log('No course data found in the URL.');
}

const BASE_URL = 'http://localhost:5000';



async function fetchCourseData() {
    const coursetitle = document.getElementById('course-topic');
    const coursedescription = document.getElementById('course-description');
    const coursestatus = document.getElementById('course-status');
    const courseprice = document.getElementById('course-price');

    try {
        const data = course; // Assuming `course` is defined elsewhere
        if (url) {
            if (data) {
                coursetitle.innerText = `Title:  ${data.topic}`;
                coursetitle.className = 'course-title';

                coursedescription.innerText = `Description: ${data.description}`;
                coursedescription.className = 'course-description';

                coursestatus.innerText = `STATUS: ${data.status}`;
                coursestatus.className = 'course-status';

                courseprice.innerText = `Price: Kes ${data.price}`;
                courseprice.className = 'course-price';
            } else {
                console.error('Error:', data.message);
                displayError();
            }
        } else {
            console.error('Error:', response.status);
            console.error('Error:', data.message);
            displayError();
        }
    } catch (error) {
        console.error(error);
        displayError();
    }

    function displayError() {
        coursetitle.innerText = `Title:  N/A`;
        coursetitle.className = 'error-title';

        coursedescription.innerText = `Description: N/A`;
        coursedescription.className = 'error-description';

        coursestatus.innerText = `STATUS: N/A`;
        coursestatus.className = 'error-status';

        courseprice.innerText = `Price: N/A`;
        courseprice.className = 'error-price';
    }
}


function submitCourseForReview() {
    const submitButton = document.getElementById('submitForReviewButton');
    submitButton.onclick = async () => {
        const confirmSubmission = confirm("Are you sure you want to submit this course for review?");
        if (confirmSubmission) {
            const response = await fetch(`http://localhost:5000/courses/${courseId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

                const result = await response.json();
                console.log('result for submit', result)

                if (result.message) {
                    console.log('submit success', result.message)
                    const successPopup = document.getElementById('submit-success-popup');
                    successPopup.innerText = 'Course submitted successfully';
                    successPopup.style.display = 'block'; // Show the popup

                    setTimeout(() => {
                        successPopup.style.display = 'none';
                        location.reload();
                    }, 2000);
                } else {
                    // Show the error popup if no message
                    const errorPopup = document.getElementById('submit-error-popup');
                    errorPopup.innerText = result.error;
                    errorPopup.style.display = 'block';

                    // Hide error popup after a delay
                    setTimeout(() => {
                        errorPopup.style.display = 'none';
                    }, 2000);
                }

            } else {
                alert('Submission cancelled.');
            }

    };
}
async function addNewLesson (e) {
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
function viewExistingLessons () {
	const viewExistingLessonsButton = document.getElementById('viewExistingLessons');
	viewExistingLessonsButton.onclick = () => {
		const confirmSubmission = confirm("Are you sure you want to submit this course for review?");
	}
}
function updateCourseDetails () {
	const updateDetailsButton = document.getElementById('updateCourseButton');
	updateDetailsButton.onclick = () => {
		const confirmUpdate = confirm("You clicked update details!")
	}
}

document.addEventListener('DOMContentLoaded', function() {
	fetchCourseData();
	submitCourseForReview();
	viewExistingLessons();
	updateCourseDetails();
});

