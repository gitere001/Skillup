const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('add-lesson-modal');
const lessonForm = document.getElementById('add-lesson-form');
const addNewLessonButton = document.getElementById('addNewLesson');
const closeTop = document.getElementById('x')
const updateDetailsButton = document.getElementById('updateCourseButton');
const imageInput = document.getElementById('course-image');
const deleteCourseButton = document.getElementById('deleteCourseButton');



const contentInput = document.getElementById('content');
const removeContentBtn = document.getElementById('removeContentBtn');
const videoInput = document.getElementById('video');
const removeVideoBtn = document.getElementById('removeVideoBtn');

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');
console.log('courseId = ', courseId);
let course;


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


const BASE_URL = 'http://localhost:5000';

async function fetchCourseData() {
    const coursetitle = document.getElementById('course-topic');
    const coursedescription = document.getElementById('course-description');
    const coursestatus = document.getElementById('course-status');
    const courseprice = document.getElementById('course-price');

    try {
        const response = await fetch(`/courses/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const courseData = await response.json();
        course = courseData.course;
        console.log('request.ok = ', response.ok);
        console.log('course = ', course);
        console.log('course is null ', course === null);
        if (response.ok) {
            if (course) {
                coursetitle.innerHTML = `${course.title}`;
                coursetitle.className = 'course-title';

                coursedescription.innerHTML = `${course.description}`;
                coursedescription.className = 'course-description';

                coursestatus.innerHTML = `${course.status}`;
                coursestatus.className = 'course-status';

                courseprice.innerHTML = `Kes ${course.price}`;
                courseprice.className = 'course-price';



                const courseImage = document.getElementById('course-image');
                courseImage.src = course.courseImagePath;
            } else {
                console.error('Error:', course.message);
                displayError();
            }
        } else {
            console.error('Error:', response.status);
            console.error('Error:', course.message);
            displayError();
        }
    } catch (error) {
        console.error(error);
        displayError();
    }

    console.log('course = ', course);

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
addNewLessonButton.addEventListener('click', function () {
    if (course.status !== 'draft' && course.status !== 'rejected') {
        alert('You can only add lessons in draft or rejected status.');
        return;
    }

    // Call showModal function if the status is valid
    showModal();
});


deleteCourseButton.addEventListener('click', async () => {
    if (course.status !== 'draft' && course.status !== 'rejected') {
        alert('You can only delete courses in draft or rejected status.');
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5000/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Remove the course card from the DOM
                alert('Course deleted successfully.');
                window.location.href = '/expertDashboard.html';
            } else {
                const result = await response.json();
                alert(`Failed to delete course: ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Error deleting course. Please try again.');
        }
    }
});


updateDetailsButton.addEventListener('click', () => {
    if (course.status !== 'draft' && course.status !== 'rejected') {
        alert('You can only update courses in draft or rejected status.');
        return;
    }
        const Course = {
            title: course.title,
            description: course.description,
            status: course.status,
            price: course.price,
            category: course.category,
            courseImagePath: course.courseImagePath,
            courseId: courseId
        };
        const courseDataString = encodeURIComponent(JSON.stringify(Course));
        window.location.href = `/lessonManagement/updateForm.html?courseData=${courseDataString}`;
});


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


document.addEventListener('DOMContentLoaded', function() {
	fetchCourseData();
	submitCourseForReview();
	viewExistingLessons();
});

