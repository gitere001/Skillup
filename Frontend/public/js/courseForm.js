// Select the necessary elements
const steps = document.querySelectorAll('.form-step1, .form-step2, .form-step3, .form-step4, .form-step5, .form-step6'); // Include the review step
const imageDisplayReview = document.getElementById('review-course-image');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const removeImageBtnReview = document.getElementById('removeImageBtnReview');
const addImageBtn = document.getElementById('addImageBtn');
let currentStep = 0;
const totalSteps = 6;
const defaultImageUrl = '/images/no-image.png';


const removeImageBtn = document.getElementById('removeContentBtn');
const imageInput = document.getElementById('course-image');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Function to update the progress bar
function updateProgressBar(step) {
    const progressPercentage = (step / totalSteps) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Update progress bar color based on the current step
    switch (step) {
        case 1:
            progressBar.style.backgroundColor = '#d0f0c0'; // Color for step 1
            break;
        case 2:
            progressBar.style.backgroundColor = '#b2e0b0'; // Color for step 2
            break;
        case 3:
            progressBar.style.backgroundColor = '#99cc99'; // Color for step 3
            break;
        case 4:
            progressBar.style.backgroundColor = '#7fbf7f'; // Color for step 4
            break;
        case 5:
            progressBar.style.backgroundColor = '#66b366'; // Color for step 5
            break;
        case 6:
            progressBar.style.backgroundColor = '#4caf50'; // Color for step 6 (normal green for submission)
            break;
        default:
            progressBar.style.backgroundColor = '#d0f0c0'; // Default color
    }



    // Update the text
    progressText.textContent = `Step ${step} of ${totalSteps}`;
}

// Initial call to set the progress bar for the first step
updateProgressBar(currentStep + 1);


imageInput.addEventListener('input', function() {
	if (imageInput.files.length > 0) {
		removeImageBtn.style.display = 'inline'; // Show the button
	} else {
		removeImageBtn.style.display = 'none'; // Hide the button if no file is selected
	}

})
removeImageBtn.addEventListener('click', function() {
	imageInput.value = ''; // Clear the selected image file
	removeImageBtn.style.display = 'none'; // Hide the button
});

removeImageBtnReview.addEventListener('click', function() {
    imageInput.value = ''; // Clear the selected image file
    removeImageBtnReview.style.display = 'none'; // Hide the button
    addImageBtn.style.display = 'inline';
    const reviewImage = document.getElementById('review-course-image');
    reviewImage.src = defaultImageUrl;
})
addImageBtn.addEventListener('click', function() {
    imageInput.click();
})
imageInput.addEventListener('change', function() {
    if (imageInput.files.length > 0) {
        const imageUrl = URL.createObjectURL(imageInput.files[0]);
        const reviewImage = document.getElementById('review-course-image');
        reviewImage.src = imageUrl; // Set the source to the uploaded image
        if (currentStep === 5) {
            removeImageBtnReview.style.display = 'inline';
        }
        addImageBtn.style.display = 'none';
    }
})


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

	if (currentStep !== totalSteps - 1) {
		removeImageBtnReview.style.display = 'none';
		addImageBtn.style.display = 'none';
	}


    // Hide the next button if on the last step (the review step)
    nextButton.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-block';
	imageDisplayReview.style.display = currentStep === totalSteps - 1 ? 'block' : 'none';


    // Autofill the review details if on the review step
    if (currentStep === totalSteps - 1) {
        autofillReviewDetails();
    }
    updateProgressBar(currentStep + 1);
}

// Function to autofill review details
function autofillReviewDetails() {
    // Get values from previous steps
    const courseTitle = document.getElementById('course-title').value;
    const courseDescription = document.getElementById('course-description').value;
    const category = document.getElementById('category').value;
    const coursePrice = document.getElementById('course-price').value;
const courseImage = imageInput.files[0];

	if (courseImage) {
        const imageUrl = URL.createObjectURL(courseImage);
        const reviewImage = document.getElementById('review-course-image');
        reviewImage.src = imageUrl; // Set the source to the uploaded image
		removeImageBtnReview.style.display = 'inline';
		addImageBtn.style.display = 'none';
    } else {;
		const reviewImage = document.getElementById('review-course-image');
		reviewImage.src = defaultImageUrl;
		addImageBtn.style.display = 'inline';
		removeImageBtnReview.style.display = 'none';
	}

    // Set the review details in the review step
    document.getElementById('review-course-title').textContent = courseTitle;
    document.getElementById('review-course-description').textContent = courseDescription;
    document.getElementById('review-category').textContent = category;
    document.getElementById('review-course-price').textContent = `Kes ${coursePrice}`;
}

// Function to handle "Continue" button click
nextButton.addEventListener('click', () => {
    let canProceed = true;

    // Step 0: Validate Course Title
    if (currentStep === 0) {
        const courseTitle = document.getElementById('course-title');
        const titleMessage = document.getElementById('message-title');
        canProceed = validateField(
            courseTitle,
            titleMessage,
            courseTitle.value.length < 5 || courseTitle.value.length > 70,
            'Title must be between 5 and 70 characters long'
        );
    }

    // Step 1: Validate Course Description
    else if (currentStep === 1) {
        const courseDescription = document.getElementById('course-description');
        const descriptionMessage = document.getElementById('message-description');
        canProceed = validateField(
            courseDescription,
            descriptionMessage,
            courseDescription.value.length < 10 || courseDescription.value.length > 200,
            'Description must be between 10 and 200 characters long'
        );
    }

    // Step 2: Validate Category
    else if (currentStep === 2) {
        const category = document.getElementById('category');
        const categoryMessage = document.getElementById('message-category');
        canProceed = validateField(
            category,
            categoryMessage,
            category.value === '',
            'Please select a category'
        );
    }

    // Step 3: Validate Price
    else if (currentStep === 3) {
        const coursePrice = document.getElementById('course-price');
        const priceMessage = document.getElementById('message-price');
        canProceed = validateField(
            coursePrice,
            priceMessage,
            isNaN(coursePrice.value) || coursePrice.value < 0,
            'Please enter a valid price'
        );
    }

    // Step 4: Validate Course Image (optional, but check size if provided)
    else if (currentStep === 4) {
        const courseImageInput = document.getElementById('course-image');
        const imageMessage = document.getElementById('message-image');
        const courseImage = courseImageInput.files[0];

        // Image is optional but if provided, ensure it's below 2MB
        if (courseImage && courseImage.size > 2 * 1024 * 1024) {
            canProceed = validateField(
                courseImageInput,
                imageMessage,
                true, // This condition is always true to trigger error if image size exceeds limit
                'Image size should be less than 2MB'
            );
        } else {
            hideErrorMessage(courseImageInput, imageMessage); // No error if image is optional
        }
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
function updateCharacterCounts() {
    // Update title counter
    const maxTitleLength = 70;
    const currentTitleLength = document.getElementById('course-title').value.length;
    const remainingTitle = maxTitleLength - currentTitleLength;
    document.getElementById('title-counter').textContent = remainingTitle;

    // Update description counter
    const maxDescriptionLength = 200;
    const currentDescriptionLength = document.getElementById('course-description').value.length;
    const remainingDescription = maxDescriptionLength - currentDescriptionLength;
    document.getElementById('description-counter').textContent = remainingDescription;
}

// Add event listeners for input fields to update character counts
document.getElementById('course-title').addEventListener('input', updateCharacterCounts);
document.getElementById('course-description').addEventListener('input', updateCharacterCounts);

async function createCourse(e) {
    e.preventDefault();
    const confirmSubmission = confirm('Are you sure you want to submit the course?');

    if (confirmSubmission) {
        // Get the data in review stage
        const courseTitle = document.getElementById('course-title').value;
        const courseDescription = document.getElementById('course-description').value;
        const category = document.getElementById('category').value;
        const coursePrice = parseInt(document.getElementById('course-price').value); // Correctly parse price
        const courseImage = imageInput.files[0]; // Get the selected image file

        // Create a FormData object to hold the data for submission
        const formData = new FormData();
        formData.append('title', courseTitle);
        formData.append('description', courseDescription);
        formData.append('category', category);
        formData.append('price', coursePrice);
        // Check if an image was uploaded
        if (courseImage) {
            formData.append('courseImage', courseImage); // Append image file to formData
        }

        let formDataText = "Form Data Submitted:\n\n";
        for (const [key, value] of formData.entries()) {
            formDataText += `${key}: ${value}\n`;
        }
        alert(formDataText);

        try {
            const response = await fetch('http://localhost:5000/courses', {
                method: 'POST',
                body: formData // Send formData directly
            });

            const result = await response.json();

            if (result.message === 'success') {
                const successPopup = document.getElementById('success-popup');
                successPopup.innerText = 'Course created successfully, proceed to add lessons';
                successPopup.style.display = 'block';
                setTimeout(() => {
                    successPopup.style.display = 'none';
                    window.location.href = '/expertDashboard.html';
                }, 2000);
            } else {
                const errorPopup = document.getElementById('error-popup');
                errorPopup.innerText = result.error;
                errorPopup.style.display = 'block';
                setTimeout(() => {
                    errorPopup.style.display = 'none';
                }, 2000);
            }

        } catch (error) {
            console.error('Error submitting course:', error);
            const errorPopup = document.getElementById('error-popup');
            errorPopup.innerText = error.message;
            errorPopup.style.display = 'block';
            setTimeout(() => {
                errorPopup.style.display = 'none';
            }, 2000);
        }
    } else {
        console.log('Submission cancelled by user'); // Optional logging
        return;
    }
}

const submitButton = document.getElementById('submit-course-btn');
submitButton.addEventListener('click', createCourse);



// Initialize the form
updateStepDisplay();
