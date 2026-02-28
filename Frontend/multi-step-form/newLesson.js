// Select the necessary elements
const steps = document.querySelectorAll('.form-step1, .form-step2, .form-step3, .form-step4, .form-step5');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
let currentStep = 0;
const totalSteps = 5;

const removeContent = document.getElementById('removeContentBtn');
const removeVideo = document.getElementById('removeVideoBtn');
const contentInput = document.getElementById('lesson-content');
const videoInput = document.getElementById('lesson-video');

contentInput.addEventListener('input', function() {
    if (contentInput.value) {
        removeContent.style.display = 'inline-block';
    } else {
        removeContent.style.display = 'none';
    }
})

videoInput.addEventListener('input', function() {
    if (videoInput.files.length > 0) {
        removeVideo.style.display = 'inline-block';
    } else {
        removeVideo.style.display = 'none';
    }
})


removeContent.addEventListener('click', function() {
    contentInput.value = '';
    removeContent.style.display = 'none';
})
removeVideo.addEventListener('click', function() {
    videoInput.value = '';
    removeVideo.style.display = 'none';
})

// Removed progressBar and progressText

// Function to validate a field
function validateField(inputElement, messageElement, isError, errorMessage) {
    if (isError) {
        messageElement.textContent = errorMessage;
        inputElement.classList.add('error');
        messageElement.classList.add('show');
        return false; // Validation failed
    } else {
        hideErrorMessage(inputElement, messageElement);
        return true; // Validation passed
    }
}

// Function to hide the error message
function hideErrorMessage(inputElement, messageElement) {
    messageElement.textContent = '';
    inputElement.classList.remove('error');
    messageElement.classList.remove('show');
}

// Function to update the form display
function updateStepDisplay() {
    // Hide all steps
    steps.forEach((step) => {
        step.classList.remove('active');
    });
    // Show the current step
    steps[currentStep].classList.add('active');

    // Show or hide the previous button based on the current step
    prevButton.style.display = currentStep === 0 ? 'none' : 'inline-block';

    // Hide the next button if on the last step (the review step)
    nextButton.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-block';

    // Autofill the review details if on the review step
    if (currentStep === totalSteps - 1) {
        autofillReviewDetails();
    }
    // Removed updateProgressBar(currentStep + 1);
}

// Function to autofill review details
function autofillReviewDetails() {
    // Get values from previous steps
    const lessonTitle = document.getElementById('lesson-title').value;
    const lessonDescription = document.getElementById('lesson-description').value;
    let contentName = 'No content';
    let videoName = 'No video';
    if (contentInput.value) {
        contentName = contentInput.files[0].name;
    }

    if (videoInput.files.length > 0) {
        videoName = videoInput.files[0].name;
    }



    // Set the review details in the review step
    document.getElementById('review-lesson-title').textContent = lessonTitle;
    document.getElementById('review-lesson-description').textContent = lessonDescription;
    document.getElementById('review-content').textContent = contentName;
    document.getElementById('review-video').textContent = videoName;
}

// Function to handle "Continue" button click
nextButton.addEventListener('click', () => {
    let canProceed = true;

    // Step 0: Validate Course Title
    if (currentStep === 0) {
        const lessonTitle = document.getElementById('lesson-title');
        const titleMessage = document.getElementById('message-title');
        canProceed = validateField(
            lessonTitle,
            titleMessage,
            lessonTitle.value.length < 5 || lessonTitle.value.length > 70,
            'Title must be between 5 and 70 characters long'
        );
    }

    // Step 1: Validate Course Description
    else if (currentStep === 1) {
        const lessonDescription = document.getElementById('lesson-description');
        const descriptionMessage = document.getElementById('message-description');
        canProceed = validateField(
            lessonDescription,
            descriptionMessage,
            lessonDescription.value.length < 10 || lessonDescription.value.length > 200,
            'Description must be between 10 and 200 characters long'
        );
    }

    // Step 2: Validate Category
    else if (currentStep === 2) {
        canProceed = true; // You can add specific validations for step 2 here
    }

    // Step 3: Validate Price
    else if (currentStep === 3) {
        canProceed = true; // You can add specific validations for step 3 here
    }

    // If no errors, move to the next step
    if (canProceed && currentStep < totalSteps - 1) {
        currentStep++;
        updateStepDisplay();
    }
});

// Function to handle "Previous" button click
prevButton.addEventListener('click', () => {
    // Move to the previous step
    if (currentStep > 0) {
        currentStep--;
        updateStepDisplay();
    }
});

// Function to update character counts
function updateCharacterCounts() {
    // Update title counter
    const maxTitleLength = 70;
    const currentTitleLength = document.getElementById('lesson-title').value.length;
    const remainingTitle = maxTitleLength - currentTitleLength;
    document.getElementById('title-counter').textContent = remainingTitle;

    // Update description counter
    const maxDescriptionLength = 200;
    const currentDescriptionLength = document.getElementById('lesson-description').value.length;
    const remainingDescription = maxDescriptionLength - currentDescriptionLength;
    document.getElementById('description-counter').textContent = remainingDescription;
}

// Add event listeners for input fields to update character counts
document.getElementById('lesson-title').addEventListener('input', updateCharacterCounts);
document.getElementById('lesson-description').addEventListener('input', updateCharacterCounts);

async function createLesson(e) {
    e.preventDefault();
    const confirmSubmission = confirm('Are you sure you want to submit the lesson?');

    if (confirmSubmission) {
        // Get the data in the review stage
        const lessonTitle = document.getElementById('lesson-title').value;
        const lessonDescription = document.getElementById('lesson-description').value;
        const lessonContent = contentInput.files[0];
        const lessonVideo = videoInput.files[0];

        // Create a FormData object to hold the data for submission
        const formData = new FormData();
        formData.append('title', lessonTitle);
        formData.append('description', lessonDescription);
        if (lessonContent) {
            formData.append('content', lessonContent);
        }
        if (lessonVideo) {
            formData.append('video', lessonVideo);
        }

        console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }


        document.getElementById('spinner').style.display = 'block';
        const spinnerMessage = document.getElementById('spinner-message');
        spinnerMessage.innerText = 'Submitting lesson...';
        spinnerMessage.style.display = 'block';

        try {
            const response = await fetch(`/courses/${courseId}/lessons`, {
                method: 'POST',
                body: formData // Send formData directly
            });

            const result = await response.json();

            document.getElementById('spinner').style.display = 'none';
            spinnerMessage.style.display = 'none';

            if (response.ok && result.message) {
                const successPopup = document.getElementById('success-popup');
                successPopup.innerText = 'Lesson added successfully!';
                successPopup.style.display = 'block';

                setTimeout(() => {
                    successPopup.style.display = 'none';
                }, 2000);
            } else {
                const errorPopup = document.getElementById('error-popup');
                errorPopup.innerText = result.error || 'Error adding lesson';
                errorPopup.style.display = 'block';
                setTimeout(() => {
                    errorPopup.style.display = 'none';
                }, 2000);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            const errorPopup = document.getElementById('error-popup');
            errorPopup.innerText = 'An error occurred. Please try again later.';
            errorPopup.style.display = 'block';
            setTimeout(() => {
                errorPopup.style.display = 'none';
            }, 2000);
        }
    }
}

const submitButton = document.getElementById('submit-lesson-btn');
submitButton.addEventListener('click', createLesson);

// Initialize the form
updateStepDisplay();
