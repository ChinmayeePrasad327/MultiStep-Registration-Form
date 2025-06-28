let currentStep = 1;
const totalSteps = 4;
let selectedBranch = null;
let selectedCourses = [];

const branchToCourses = {
  CSE: ["Data Structures", "Algorithms", "AI & ML", "Web Development"],
  IT: ["Networks", "Cloud Computing", "Cyber Security"],
  ECE: ["Digital Systems", "Signal Processing", "Embedded Systems"],
  EEE: ["Power Systems", "Electrical Machines", "Control Systems"],
  MECH: ["Thermodynamics", "CAD", "Fluid Mechanics"],
  CIVIL: ["Structural Analysis", "Concrete Technology", "Surveying"],
  CSD: ["Big Data", "Data Science", "Cloud Infra"],
  CSM: ["IoT", "Robotics", "Machine Learning"]
};

// Elements
const steps = document.querySelectorAll(".form-step");
const indicators = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("multiStepForm");
const courseContainer = document.getElementById("step3-course-options");
//For valid Step 1
function isValidName(name) {
    return /^[a-zA-Z ]{2,}$/.test(name.trim());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.trim());
}

// Display a specific step
function showStep(step) {
  steps.forEach((el, idx) => el.classList.add("d-none"));
  steps[step - 1].classList.remove("d-none");

  indicators.forEach((el, idx) => {
    el.classList.remove("active");
    if (idx + 1 === step) el.classList.add("active");
  });

  prevBtn.style.display = step === 1 ? "none" : "inline-block";
  nextBtn.style.display = step === totalSteps ? "none" : "inline-block";
  submitBtn.classList.toggle("d-none", step !== totalSteps);

  if (step === 3) renderCourses();
  if (step === 4) populateReview();
}

// Validate input for the current step
function validateStep(step) {
  const showValidationModal = (message) => {
    document.getElementById("validationMessage").textContent = message;
    const modal = new bootstrap.Modal(document.getElementById("validationModal"));
    modal.show();
  };

  if (step === 1) {
  let valid = true;

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");

  // First Name
  if (!isValidName(firstName.value)) {
    firstNameError.textContent = "Enter a valid first name (only letters).";
    valid = false;
  } else {
    firstNameError.textContent = "";
  }

  // Last Name
  if (!isValidName(lastName.value)) {
    lastNameError.textContent = "Enter a valid last name (only letters).";
    valid = false;
  } else {
    lastNameError.textContent = "";
  }

  // Email
  if (!isValidEmail(email.value)) {
    emailError.textContent = "Enter a valid email address.";
    valid = false;
  } else {
    emailError.textContent = "";
  }

  // Phone
  if (!isValidPhone(phone.value)) {
    phoneError.textContent = "Enter a valid 10-digit phone number.";
    valid = false;
  } else {
    phoneError.textContent = "";
  }

  if (!valid) {
    showValidationModal("Please fix the errors in Step 1.");
  }

  return valid;
}

if (step === 2) {
  const checked = document.querySelector('input[name="branch"]:checked');
  const error = document.getElementById("interestsError");

  if (!checked) {
    error.textContent = "Please select exactly one branch.";
    showValidationModal("You must select a branch to continue.");
    return false;
  }

  error.textContent = "";
  selectedBranch = checked.value;
  return true;
}


  if (step === 3) {
    const error = document.getElementById("coursesError"); // You can create this in HTML optionally
    selectedCourses = Array.from(document.querySelectorAll("#step3 input[type='checkbox']:checked"))
      .map(el => el.value);

    if (selectedCourses.length === 0) {
      if (error) error.textContent = "Please select at least one course.";
      showValidationModal("Please select at least one course to continue.");
      return false;
    }

    if (error) error.textContent = "";
    return true;
  }

  return true;
}


// Render course checkboxes based on branch
function renderCourses() {
  courseContainer.innerHTML = "";

  if (!selectedBranch) return;

  const courses = branchToCourses[selectedBranch] || [];

  courses.forEach((course, idx) => {
    const id = `course_${idx}`;
    const isChecked = selectedCourses.includes(course) ? "checked" : "";
    courseContainer.innerHTML += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${id}" value="${course}" ${isChecked}>
        <label class="form-check-label" for="${id}">${course}</label>
      </div>
    `;
  });
}

// Show final data on review step
function populateReview() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  document.getElementById("reviewName").textContent = `${firstName} ${lastName}`;
  document.getElementById("reviewEmail").textContent = email;
  document.getElementById("reviewPhone").textContent = phone;
  document.getElementById("reviewBranch").textContent = selectedBranch ;
  document.getElementById("reviewCourses").textContent =
     selectedCourses.join(", ") ;
}

// Navigation buttons
nextBtn.addEventListener("click", () => {
  if (validateStep(currentStep)) {
    currentStep++;
    showStep(currentStep);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
});

// Step indicators clickable
indicators.forEach(ind => {
  ind.addEventListener("click", () => {
    const step = parseInt(ind.dataset.step);
    if (step <= currentStep) {
      currentStep = step;
      showStep(step);
    } else {
      alert(`Please complete Step ${currentStep} first.`);
    }
  });
});

// Submit handler
form.addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  document.getElementById("confirmEmail").textContent = email;

  const modalEl = document.getElementById("successModal");

  // Hide existing instance if any
  const existingModal = bootstrap.Modal.getInstance(modalEl);
  if (existingModal) {
    existingModal.hide();
  }

  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  // One-time click listener on document
  const handleClick = () => {
    resetForm(); // Reset the form
    modal.hide(); // Hide the modal
    document.removeEventListener("click", handleClick); // Clean up listener
  };

  // Delay to avoid immediate modal close from this same click
  setTimeout(() => {
    document.addEventListener("click", handleClick);
  }, 500);
});

// Reset everything
function resetForm() {
  form.reset();
  currentStep = 1;
  selectedBranch = null;
  selectedCourses = [];
  showStep(currentStep);
   document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");

  showStep(currentStep);
}



// Show first step on load
window.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);
});
