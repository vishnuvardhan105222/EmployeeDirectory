// ===== PREMIUM EMPLOYEE DIRECTORY - DATA MANAGEMENT =====

/**
 * Mock employee data for the premium directory
 */
const mockEmployees = [
    {
        id: 1,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@company.com",
        department: "HR",
        role: "HR Manager",
        phone: "+1 (555) 123-4567",
        joinDate: new Date("2020-03-15"),
        avatar: null
    },
    {
        id: 2,
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@company.com",
        department: "IT",
        role: "Senior Developer",
        phone: "+1 (555) 234-5678",
        joinDate: new Date("2019-08-22"),
        avatar: null
    },
    {
        id: 3,
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@company.com",
        department: "Marketing",
        role: "Marketing Specialist",
        phone: "+1 (555) 345-6789",
        joinDate: new Date("2021-01-10"),
        avatar: null
    },
    {
        id: 4,
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@company.com",
        department: "Finance",
        role: "Financial Analyst",
        phone: "+1 (555) 456-7890",
        joinDate: new Date("2020-11-05"),
        avatar: null
    },
    {
        id: 5,
        firstName: "Jessica",
        lastName: "Taylor",
        email: "jessica.taylor@company.com",
        department: "Operations",
        role: "Operations Manager",
        phone: "+1 (555) 567-8901",
        joinDate: new Date("2018-06-30"),
        avatar: null
    },
    {
        id: 6,
        firstName: "Robert",
        lastName: "Brown",
        email: "robert.brown@company.com",
        department: "IT",
        role: "DevOps Engineer",
        phone: "+1 (555) 678-9012",
        joinDate: new Date("2021-09-12"),
        avatar: null
    },
    {
        id: 7,
        firstName: "Amanda",
        lastName: "Davis",
        email: "amanda.davis@company.com",
        department: "HR",
        role: "HR Coordinator",
        phone: "+1 (555) 789-0123",
        joinDate: new Date("2022-02-28"),
        avatar: null
    },
    {
        id: 8,
        firstName: "Kevin",
        lastName: "Martinez",
        email: "kevin.martinez@company.com",
        department: "Marketing",
        role: "Digital Marketing Manager",
        phone: "+1 (555) 890-1234",
        joinDate: new Date("2020-07-18"),
        avatar: null
    },
    {
        id: 9,
        firstName: "Lisa",
        lastName: "Anderson",
        email: "lisa.anderson@company.com",
        department: "Finance",
        role: "Accounting Manager",
        phone: "+1 (555) 901-2345",
        joinDate: new Date("2019-04-03"),
        avatar: null
    },
    {
        id: 10,
        firstName: "James",
        lastName: "Garcia",
        email: "james.garcia@company.com",
        department: "Operations",
        role: "Operations Coordinator",
        phone: "+1 (555) 012-3456",
        joinDate: new Date("2021-12-01"),
        avatar: null
    },
    {
        id: 11,
        firstName: "Maria",
        lastName: "Lopez",
        email: "maria.lopez@company.com",
        department: "IT",
        role: "Frontend Developer",
        phone: "+1 (555) 123-7890",
        joinDate: new Date("2022-05-15"),
        avatar: null
    },
    {
        id: 12,
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        department: "Marketing",
        role: "Content Manager",
        phone: "+1 (555) 234-8901",
        joinDate: new Date("2021-03-20"),
        avatar: null
    }
];

/**
 * Employee Data Manager Class
 */
class EmployeeDataManager {
    constructor() {
        this.employees = this.loadEmployees();
        this.nextId = this.employees.length ? Math.max(...this.employees.map(emp => emp.id)) + 1 : 1;
        this.observers = [];
    }

    /**
     * Load employees from localStorage or use mock data
     * @returns {Array} Array of employee objects
     */
    loadEmployees() {
        const stored = Utils.LocalStorage.get('employees');
        return stored && stored.length > 0 ? stored : Utils.deepClone(mockEmployees);
    }

    /**
     * Save employees to localStorage
     */
    saveEmployees() {
        Utils.LocalStorage.set('employees', this.employees);
        this.notifyObservers();
    }

    /**
     * Add an observer for data changes
     * @param {Function} callback - Callback function
     */
    addObserver(callback) {
        this.observers.push(callback);
    }

    /**
     * Remove an observer
     * @param {Function} callback - Callback function
     */
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    /**
     * Notify all observers of data changes
     */
    notifyObservers() {
        this.observers.forEach(callback => callback(this.employees));
    }

    /**
     * Get all employees
     * @returns {Array} Array of employee objects
     */
    getAllEmployees() {
        return Utils.deepClone(this.employees);
    }

    /**
     * Get employee by ID
     * @param {number} id - Employee ID
     * @returns {Object|null} Employee object or null if not found
     */
    getEmployeeById(id) {
        const employee = this.employees.find(emp => emp.id === parseInt(id));
        return employee ? Utils.deepClone(employee) : null;
    }

    /**
     * Add a new employee
     * @param {Object} employeeData - Employee data
     * @returns {Object} The added employee
     */
    addEmployee(employeeData) {
        const newEmployee = {
            id: this.nextId++,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            department: employeeData.department,
            role: employeeData.role,
            phone: employeeData.phone || null,
            joinDate: employeeData.joinDate || new Date(),
            avatar: employeeData.avatar || null
        };

        this.employees.push(newEmployee);
        this.saveEmployees();
        return Utils.deepClone(newEmployee);
    }

    /**
     * Update an employee
     * @param {number} id - Employee ID
     * @param {Object} employeeData - Updated employee data
     * @returns {Object|null} Updated employee or null if not found
     */
    updateEmployee(id, employeeData) {
        const index = this.employees.findIndex(emp => emp.id === parseInt(id));
        if (index === -1) return null;

        const updatedEmployee = {
            ...this.employees[index],
            ...employeeData,
            id: parseInt(id) // Ensure ID doesn't change
        };

        this.employees[index] = updatedEmployee;
        this.saveEmployees();
        return Utils.deepClone(updatedEmployee);
    }

    /**
     * Delete an employee
     * @param {number} id - Employee ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteEmployee(id) {
        const index = this.employees.findIndex(emp => emp.id === parseInt(id));
        if (index === -1) return false;

        this.employees.splice(index, 1);
        this.saveEmployees();
        return true;
    }

    /**
     * Search employees
     * @param {string} query - Search query
     * @returns {Array} Array of matching employees
     */
    searchEmployees(query) {
        if (!query || query.trim() === '') {
            return this.getAllEmployees();
        }

        const searchTerm = query.toLowerCase().trim();
        return this.employees.filter(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            const email = employee.email.toLowerCase();
            const department = employee.department.toLowerCase();
            const role = employee.role.toLowerCase();
            
            return fullName.includes(searchTerm) ||
                   email.includes(searchTerm) ||
                   department.includes(searchTerm) ||
                   role.includes(searchTerm);
        });
    }

    /**
     * Filter employees by department
     * @param {string} department - Department name
     * @returns {Array} Array of employees in the department
     */
    filterByDepartment(department) {
        if (!department || department === '') {
            return this.getAllEmployees();
        }
        return this.employees.filter(emp => emp.department === department);
    }

    /**
     * Filter employees by role
     * @param {string} role - Role name
     * @returns {Array} Array of employees with the role
     */
    filterByRole(role) {
        if (!role || role === '') {
            return this.getAllEmployees();
        }
        return this.employees.filter(emp => emp.role === role);
    }

    /**
     * Apply multiple filters
     * @param {Object} filters - Filter options
     * @returns {Array} Array of filtered employees
     */
    applyFilters(filters) {
        let filteredEmployees = this.getAllEmployees();

        // Apply search filter
        if (filters.search) {
            filteredEmployees = this.searchEmployees(filters.search);
        }

        // Apply department filter
        if (filters.department) {
            filteredEmployees = filteredEmployees.filter(emp => emp.department === filters.department);
        }

        // Apply role filter
        if (filters.role) {
            filteredEmployees = filteredEmployees.filter(emp => emp.role === filters.role);
        }

        return filteredEmployees;
    }

    /**
     * Sort employees
     * @param {Array} employees - Array of employees to sort
     * @param {string} sortBy - Sort field
     * @param {string} sortOrder - Sort order ('asc' or 'desc')
     * @returns {Array} Sorted array of employees
     */
    sortEmployees(employees, sortBy, sortOrder = 'asc') {
        if (!sortBy) return employees;

        const sorted = [...employees].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle different data types
            if (aValue instanceof Date && bValue instanceof Date) {
                aValue = aValue.getTime();
                bValue = bValue.getTime();
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }

    /**
     * Get unique departments
     * @returns {Array} Array of unique departments
     */
    getDepartments() {
        const departments = [...new Set(this.employees.map(emp => emp.department))];
        return departments.sort();
    }

    /**
     * Get unique roles
     * @returns {Array} Array of unique roles
     */
    getRoles() {
        const roles = [...new Set(this.employees.map(emp => emp.role))];
        return roles.sort();
    }

    /**
     * Get employee statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const stats = {
            total: this.employees.length,
            departments: {},
            roles: {},
            recentHires: 0
        };

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        this.employees.forEach(employee => {
            // Count by department
            stats.departments[employee.department] = (stats.departments[employee.department] || 0) + 1;

            // Count by role
            stats.roles[employee.role] = (stats.roles[employee.role] || 0) + 1;

            // Count recent hires
            if (employee.joinDate >= threeMonthsAgo) {
                stats.recentHires++;
            }
        });

        return stats;
    }

    /**
     * Validate employee data
     * @param {Object} employeeData - Employee data to validate
     * @returns {Object} Validation result
     */
    validateEmployee(employeeData) {
        const errors = {};

        // Required fields
        if (!employeeData.firstName || employeeData.firstName.trim() === '') {
            errors.firstName = 'First name is required';
        }

        if (!employeeData.lastName || employeeData.lastName.trim() === '') {
            errors.lastName = 'Last name is required';
        }

        if (!employeeData.email || employeeData.email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!Utils.isValidEmail(employeeData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!employeeData.department || employeeData.department.trim() === '') {
            errors.department = 'Department is required';
        }

        if (!employeeData.role || employeeData.role.trim() === '') {
            errors.role = 'Role is required';
        }

        // Check for duplicate email (excluding current employee if updating)
        const existingEmployee = this.employees.find(emp => 
            emp.email.toLowerCase() === employeeData.email.toLowerCase() && 
            emp.id !== employeeData.id
        );
        
        if (existingEmployee) {
            errors.email = 'This email address is already in use';
        }

        // Validate phone number if provided
        if (employeeData.phone && !Utils.isValidPhone(employeeData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Export employees to CSV
     * @returns {string} CSV string
     */
    exportToCSV() {
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Role', 'Phone', 'Join Date'];
        const csvRows = [headers.join(',')];

        this.employees.forEach(employee => {
            const row = [
                employee.id,
                `"${employee.firstName}"`,
                `"${employee.lastName}"`,
                `"${employee.email}"`,
                `"${employee.department}"`,
                `"${employee.role}"`,
                `"${employee.phone || ''}"`,
                `"${Utils.formatDate(employee.joinDate)}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    /**
     * Import employees from CSV
     * @param {string} csvContent - CSV content
     * @returns {Object} Import result
     */
    importFromCSV(csvContent) {
        try {
            const lines = csvContent.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const imported = [];
            const errors = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const employeeData = {
                    firstName: values[1],
                    lastName: values[2],
                    email: values[3],
                    department: values[4],
                    role: values[5],
                    phone: values[6],
                    joinDate: new Date(values[7])
                };

                const validation = this.validateEmployee(employeeData);
                if (validation.valid) {
                    const newEmployee = this.addEmployee(employeeData);
                    imported.push(newEmployee);
                } else {
                    errors.push({
                        row: i + 1,
                        errors: validation.errors
                    });
                }
            }

            return {
                success: true,
                imported: imported.length,
                errors: errors.length,
                errorDetails: errors
            };
        } catch (error) {
            return {
                success: false,
                error: 'Invalid CSV format'
            };
        }
    }

    /**
     * Reset to default data
     */
    resetToDefaults() {
        this.employees = Utils.deepClone(mockEmployees);
        this.nextId = Math.max(...this.employees.map(emp => emp.id)) + 1;
        this.saveEmployees();
    }

    /**
     * Get paginated employees
     * @param {number} page - Page number (1-based)
     * @param {number} limit - Number of items per page
     * @param {Array} employees - Array of employees to paginate
     * @returns {Object} Pagination result
     */
    getPaginatedEmployees(page = 1, limit = 10, employees = null) {
        const data = employees || this.employees;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = data.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(data.length / limit),
                totalItems: data.length,
                itemsPerPage: limit,
                hasNextPage: endIndex < data.length,
                hasPrevPage: page > 1
            }
        };
    }
}

// Create a global instance
window.EmployeeData = new EmployeeDataManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmployeeDataManager;
}