const result = {
    	course: {
			topic: "Poultry Farming Basics pig farming using modern technology",
			description: "Learn the fundamentals of poultry farming, including feeding, housing, and health management.",
			"price": 1500,
			status: "draft",
    }
}
const submitReviewData = {
	message: "success"
}

const pathParts = window.location.pathname.split('/');
const courseId = pathParts[pathParts.length - 1];
const BASE_URL = 'http://localhost:5000';
let course = null;

async function fetchCourseData() {
    const coursetitle = document.getElementById('course-topic');
    const coursedescription = document.getElementById('course-description');
    const coursestatus = document.getElementById('course-status');
    const courseprice = document.getElementById('course-price');

    try {
        // let response = await fetch(`http://localhost:5000/courses/${courseId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        // });
        // const data = await response.json();
		const response = {ok: true}
		const data = result.course;
        if (response.ok) {
            if (result.course) {
                coursetitle.innerText = `Title:  ${data.topic}`;
                coursetitle.style.fontWeight = '700';

                coursedescription.innerText = `Description: ${data.description}`;
                coursedescription.style.fontWeight = '600';

                coursestatus.innerText = `STATUS: ${data.status}`;
                coursestatus.style.fontWeight = '700';

                courseprice.innerText = `Price: Kes ${data.price}`;
                courseprice.style.fontWeight = '700';
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
        coursetitle.style.fontWeight = '700';
        coursetitle.style.textTransform = 'uppercase';

        coursedescription.innerText = `Description: N/A`;
        coursedescription.style.fontWeight = '600';

        coursestatus.innerText = `STATUS: N/A`;
        coursestatus.style.fontWeight = '400';

        courseprice.innerText = `Price: N/A`;
        courseprice.style.fontWeight = '400';
    }
}

function submitCourseForReview() {
    const submitButton = document.getElementById('submitForReviewButton');
    submitButton.onclick = async () => {
        const confirmSubmission = confirm("Are you sure you want to submit this course for review?");
        if (confirmSubmission) {
            // const response = await fetch(`http://localhost:5000/courses/${courseId}/submit`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // });

                const result = submitReviewData;

                if (result.message) {
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
                    errorPopup.innerText = result.error || 'An unknown error occurred';
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
function addNewLesson () {
	const addNewLessonButton = document.getElementById('addNewLesson');
	addNewLessonButton.onclick = () => {
		const confirmr = confirm("Are you sure you want to add a new lesson")
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
	addNewLesson();
	viewExistingLessons();
	updateCourseDetails();
});