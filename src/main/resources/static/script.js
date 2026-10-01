const API_BASE = '/employees';

const employeeForm = document.getElementById('employee-form');
const employeeIdInput = document.getElementById('employee-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const salaryInput = document.getElementById('salary');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const employeeTbody = document.getElementById('employee-tbody');
const alertBanner = document.getElementById('alert-banner');
const refreshBtn = document.getElementById('refresh-btn');

document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();

    employeeForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    refreshBtn.addEventListener('click', loadEmployees);
});

function showAlert(message, type = 'error') {
    alertBanner.textContent = message;
    alertBanner.className = `alert alert-${type}`;
    alertBanner.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearAlert() {
    alertBanner.textContent = '';
    alertBanner.className = 'alert hidden';
}

async function loadEmployees() {
    clearAlert();
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) {
            throw new Error(`Failed to load employees (Status ${response.status})`);
        }
        const employees = await response.json();
        renderTable(employees);
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

function renderTable(employees) {
    employeeTbody.innerHTML = '';

    if (!employees || employees.length === 0) {
        employeeTbody.innerHTML = '<tr><td colspan="6" class="text-center">No employees found. Add one above.</td></tr>';
        return;
    }

    employees.forEach(emp => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${emp.id}</td>
            <td>${escapeHtml(emp.name)}</td>
            <td>${escapeHtml(emp.email)}</td>
            <td>${escapeHtml(emp.department || '-')}</td>
            <td>₹${Number(emp.salary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td class="table-actions">
                <button class="btn btn-warning" onclick="startEdit(${emp.id}, '${escapeJs(emp.name)}', '${escapeJs(emp.email)}', '${escapeJs(emp.department || '')}', ${emp.salary})">Edit</button>
                <button class="btn btn-danger" onclick="deleteEmployee(${emp.id})">Delete</button>
            </td>
        `;

        employeeTbody.appendChild(tr);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    clearAlert();

    const id = employeeIdInput.value;
    const isEdit = Boolean(id);

    const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value.trim(),
        salary: parseFloat(salaryInput.value)
    };

    const url = isEdit ? `${API_BASE}/${id}` : API_BASE;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMsg = `Error ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMsg = errorData.message;
                }
            } catch {
                errorMsg = await response.text();
            }
            showAlert(errorMsg, 'error');
            return;
        }

        showAlert(isEdit ? 'Employee updated successfully!' : 'Employee added successfully!', 'success');
        resetForm();
        loadEmployees();
    } catch (err) {
        showAlert(err.message || 'Network error occurred', 'error');
    }
}

function startEdit(id, name, email, department, salary) {
    clearAlert();
    employeeIdInput.value = id;
    nameInput.value = name;
    emailInput.value = email;
    departmentInput.value = department;
    salaryInput.value = salary;

    formTitle.textContent = `Edit Employee (ID: ${id})`;
    submitBtn.textContent = 'Update Employee';
    cancelBtn.classList.remove('hidden');

    nameInput.focus();
}

function resetForm() {
    employeeForm.reset();
    employeeIdInput.value = '';
    formTitle.textContent = 'Add New Employee';
    submitBtn.textContent = 'Save Employee';
    cancelBtn.classList.add('hidden');
}

async function deleteEmployee(id) {
    if (!confirm(`Are you sure you want to delete employee #${id}?`)) {
        return;
    }

    clearAlert();
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            let errorMsg = `Failed to delete (Status ${response.status})`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMsg = errorData.message;
                }
            } catch {
                // Ignore parse errors
            }
            showAlert(errorMsg, 'error');
            return;
        }

        showAlert(`Employee #${id} deleted successfully!`, 'success');
        if (employeeIdInput.value === String(id)) {
            resetForm();
        }
        loadEmployees();
    } catch (err) {
        showAlert(err.message || 'Network error occurred', 'error');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

function escapeJs(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
