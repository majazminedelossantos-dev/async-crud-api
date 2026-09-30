const API_URL = "https://jsonplaceholder.typicode.com/users";
const SAMPLE_NAMES = [
    "Jazmine Delos Santos",
    "James De los Reyes",
    "Jose Reyes",
    "Ana Garcia",
    "Miguel Bautista",
    "Sofia Mendoza",
    "Gabriel Flores",
    "Isabella Navarro",
    "Carlos Aquino",
    "Angela Ramos"
];

const form = document.getElementById("recordForm");
const recordId = document.getElementById("recordId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const recordsContainer = document.getElementById("recordsContainer");
const loading = document.getElementById("loading");
const statusMessage = document.getElementById("statusMessage");
let displayedRecords = [];


// ================================
// GET - VIEW RECORDS
// ================================

async function getRecords() {
    showLoading(true);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch records.");
        }

        const records = await response.json();

        displayedRecords = records.map((record, index) => {
            const name = SAMPLE_NAMES[index % SAMPLE_NAMES.length];
            const emailName = name.toLowerCase().replace(/\s+/g, ".");

            return {
                ...record,
                name,
                email: `${emailName}@gmail.com`
            };
        });

        displayRecords(displayedRecords);

    } catch (error) {
        showMessage(error.message, "error");

    } finally {
        showLoading(false);
    }
}


// ================================
// DISPLAY RECORDS
// ================================

function displayRecords(records) {
    recordsContainer.innerHTML = "";

    records.forEach(record => {
        const recordElement = document.createElement("div");

        recordElement.className = "record";

        recordElement.innerHTML = `
            <h3>${record.name}</h3>
            <p>${record.email}</p>

            <button
                class="edit-btn"
                onclick="editRecord(${record.id}, '${record.name}', '${record.email}')">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteRecord(${record.id})">
                Delete
            </button>
        `;

        recordsContainer.appendChild(recordElement);
    });
}


// ================================
// POST - ADD RECORD
// ================================

async function addRecord(name, email) {
    showLoading(true);

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add record.");
        }

        const newRecord = await response.json();

        displayedRecords.push({ ...newRecord, name, email });
        displayRecords(displayedRecords);

        showMessage(
            `Record added successfully. ID: ${newRecord.id}`,
            "success"
        );

        form.reset();

    } catch (error) {
        showMessage(error.message, "error");

    } finally {
        showLoading(false);
    }
}


// ================================
// PUT - UPDATE RECORD
// ================================

async function updateRecord(id, name, email) {
    showLoading(true);

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update record.");
        }

        await response.json();

        displayedRecords = displayedRecords.map(record =>
            String(record.id) === String(id)
                ? { ...record, name, email }
                : record
        );
        displayRecords(displayedRecords);

        showMessage(
            "Record updated successfully.",
            "success"
        );

        resetForm();

    } catch (error) {
        showMessage(error.message, "error");

    } finally {
        showLoading(false);
    }
}


// ================================
// DELETE - DELETE RECORD
// ================================

async function deleteRecord(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) {
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete record.");
        }

        displayedRecords = displayedRecords.filter(
            record => String(record.id) !== String(id)
        );
        displayRecords(displayedRecords);

        showMessage(
            "Record deleted successfully.",
            "success"
        );

    } catch (error) {
        showMessage(error.message, "error");

    } finally {
        showLoading(false);
    }
}


// ================================
// EDIT RECORD
// ================================

function editRecord(id, name, email) {
    recordId.value = id;
    nameInput.value = name;
    emailInput.value = email;

    submitButton.textContent = "Update Record";
}


// ================================
// FORM SUBMISSION
// ================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const id = recordId.value;
    const name = nameInput.value;
    const email = emailInput.value;

    if (id) {

        await updateRecord(
            id,
            name,
            email
        );

    } else {

        await addRecord(
            name,
            email
        );
    }
});


// ================================
// CANCEL BUTTON
// ================================

cancelButton.addEventListener("click", function() {
    resetForm();
});


// ================================
// RESET FORM
// ================================

function resetForm() {
    form.reset();

    recordId.value = "";

    submitButton.textContent = "Add Record";
}


// ================================
// LOADING STATE
// ================================

function showLoading(isLoading) {

    if (isLoading) {
        loading.style.display = "block";
    } else {
        loading.style.display = "none";
    }
}


// ================================
// SUCCESS / ERROR MESSAGE
// ================================

function showMessage(message, type) {

    statusMessage.textContent = message;

    statusMessage.className = type;

    setTimeout(() => {
        statusMessage.className = "";
        statusMessage.textContent = "";
    }, 3000);
}


// ================================
// LOAD DATA WHEN PAGE OPENS
// ================================

getRecords();