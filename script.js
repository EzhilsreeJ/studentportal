const studentForm = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentMajorInput = document.getElementById('studentMajor');
const studentTableBody = document.querySelector('#studentTable tbody');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');

let students = []; // Array to store student data
let editingStudentId = null; // Stores the ID of the student being edited

// Function to render students in the table
function renderStudents() {
    studentTableBody.innerHTML = ''; // Clear existing rows

    if (students.length === 0) {
        const noDataRow = studentTableBody.insertRow();
        const cell = noDataRow.insertCell(0);
        cell.colSpan = 4; // Span across all columns (ID, Name, Major, Actions)
        cell.textContent = 'No students added yet.';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        return;
    }

    students.forEach(student => {
        const row = studentTableBody.insertRow();

        row.insertCell(0).textContent = student.id;
        row.insertCell(1).textContent = student.name;
        row.insertCell(2).textContent = student.major;

        const actionsCell = row.insertCell(3);
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.onclick = () => editStudent(student.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = () => deleteStudent(student.id);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });
}

// Function to handle adding or updating a student
function addOrUpdateStudent(event) {
    event.preventDefault(); // Prevent default form submission

    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const major = studentMajorInput.value.trim();

    if (!id || !name || !major) {
        alert('Please fill in all fields.');
        return;
    }

    if (editingStudentId) {
        // Update existing student
        const studentIndex = students.findIndex(s => s.id === editingStudentId);
        if (studentIndex !== -1) {
            students[studentIndex] = { id: id, name: name, major: major };
        }
    } else {
        // Check for duplicate ID when adding a new student
        if (students.some(s => s.id === id)) {
            alert('Student ID already exists. Please use a unique ID.');
            return;
        }
        // Add new student
        students.push({ id: id, name: name, major: major });
    }

    resetForm();
    renderStudents();
}

// Function to populate form for editing
function editStudent(id) {
    const studentToEdit = students.find(student => student.id === id);
    if (studentToEdit) {
        studentIdInput.value = studentToEdit.id;
        studentNameInput.value = studentToEdit.name;
        studentMajorInput.value = studentToEdit.major;
        studentIdInput.disabled = true; // Prevent changing ID during edit

        editingStudentId = id;
        submitButton.textContent = 'Update Student';
        cancelEditButton.style.display = 'inline-block';
    }
}

// Function to delete a student
function deleteStudent(id) {
    if (confirm(`Are you sure you want to delete student with ID: ${id}?`)) {
        students = students.filter(student => student.id !== id);
        renderStudents();
        resetForm(); // Reset form if the deleted student was being edited
    }
}

// Function to reset the form and editing state
function resetForm() {
    studentForm.reset();
    studentIdInput.disabled = false; // Re-enable ID input
    submitButton.textContent = 'Add Student';
    cancelEditButton.style.display = 'none';
    editingStudentId = null;
}

// Event Listeners
studentForm.addEventListener('submit', addOrUpdateStudent);
cancelEditButton.addEventListener('click', resetForm);

// Initial render when the page loads
renderStudents();
