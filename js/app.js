// ===== PREMIUM EMPLOYEE DIRECTORY - MAIN APPLICATION =====

/**
 * Main Application Class
 */
class EmployeeDirectoryApp {
    constructor() {
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentFilters = {
            search: '',
            department: '',
            role: ''
        };
        this.currentSort = {
            field: '',
            order: 'asc'
        };
        this.currentEmployees = [];
        this.isLoading = false;
        this.editingEmployeeId = null;
        
        // DOM elements
        this.elements = {};
        
        // Debounced functions
        this.debouncedSearch = Utils.debounce(this.performSearch.bind(this), 300);
        this.debouncedFilter = Utils.debounce(this.applyFilters.bind(this), 200);
    }

    /**
     * Initialize the application
     */
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setupFilters();
        this.loadEmployees();
        this.showWelcomeMessage();
    }

    /**
     * Cache DOM elements
     */
    cacheDOM() {
        this.elements = {
            // Search
            searchInput: document.getElementById('searchInput'),
            clearSearch: document.getElementById('clearSearch'),
            
            // Filter sidebar
            filterBtn: document.getElementById('filterBtn'),
            filterSidebar: document.getElementById('filterSidebar'),
            closeSidebar: document.getElementById('closeSidebar'),
            departmentFilter: document.getElementById('departmentFilter'),
            roleFilter: document.getElementById('roleFilter'),
            applyFilters: document.getElementById('applyFilters'),
            clearFilters: document.getElementById('clearFilters'),
            
            // View toggles
            viewToggle: document.querySelectorAll('.view-toggle__btn'),
            
            // Employee grid
            employeeGrid: document.getElementById('employeeGrid'),
            
            // Pagination
            pagination: document.getElementById('pagination'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            pageInfo: document.getElementById('pageInfo'),
            
            // Modals
            employeeModal: document.getElementById('employeeModal'),
            confirmModal: document.getElementById('confirmModal'),
            
            // Forms
            employeeForm: document.getElementById('employeeForm'),
            modalTitle: document.getElementById('modalTitle'),
            
            // Action buttons
            addEmployeeBtn: document.getElementById('addEmployeeBtn'),
            saveBtn: document.getElementById('saveBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            closeModal: document.getElementById('closeModal'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            
            // States
            loadingState: document.getElementById('loadingState'),
            emptyState: document.getElementById('emptyState'),
            resetSearch: document.getElementById('resetSearch')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search functionality
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.debouncedSearch();
            });
        }

        if (this.elements.clearSearch) {
            this.elements.clearSearch.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Filter sidebar
        if (this.elements.filterBtn) {
            this.elements.filterBtn.addEventListener('click', () => {
                this.toggleFilterSidebar();
            });
        }

        if (this.elements.closeSidebar) {
            this.elements.closeSidebar.addEventListener('click', () => {
                this.closeFilterSidebar();
            });
        }

        // Filter controls
        if (this.elements.departmentFilter) {
            this.elements.departmentFilter.addEventListener('change', (e) => {
                this.currentFilters.department = e.target.value;
                this.debouncedFilter();
            });
        }

        if (this.elements.roleFilter) {
            this.elements.roleFilter.addEventListener('change', (e) => {
                this.currentFilters.role = e.target.value;
                this.debouncedFilter();
            });
        }

        if (this.elements.applyFilters) {
            this.elements.applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        if (this.elements.clearFilters) {
            this.elements.clearFilters.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // View toggles
        this.elements.viewToggle.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view || e.target.closest('[data-view]').dataset.view;
                this.switchView(view);
            });
        });

        // Employee actions
        if (this.elements.addEmployeeBtn) {
            this.elements.addEmployeeBtn.addEventListener('click', () => {
                this.showEmployeeModal();
            });
        }

        // Form handling
        if (this.elements.employeeForm) {
            this.elements.employeeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Modal controls
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => {
                this.closeEmployeeModal();
            });
        }

        if (this.elements.cancelBtn) {
            this.elements.cancelBtn.addEventListener('click', () => {
                this.closeEmployeeModal();
            });
        }

        // Confirmation modal
        if (this.elements.confirmDeleteBtn) {
            this.elements.confirmDeleteBtn.addEventListener('click', () => {
                this.confirmDelete();
            });
        }

        if (this.elements.cancelDeleteBtn) {
            this.elements.cancelDeleteBtn.addEventListener('click', () => {
                this.closeDeleteConfirmation();
            });
        }

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevBtn') {
                this.goToPreviousPage();
            } else if (e.target.id === 'nextBtn') {
                this.goToNextPage();
            } else if (e.target.id === 'resetSearch') {
                this.resetSearch();
            }
        });

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop')) {
                this.closeAllModals();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeFilterSidebar();
            } else if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.focusSearch();
            }
        });

        // Data change observer
        EmployeeData.addObserver(() => {
            this.loadEmployees();
        });
    }

    /**
     * Setup filter dropdowns
     */
    setupFilters() {
        const departments = EmployeeData.getDepartments();
        const roles = EmployeeData.getRoles();
        Components.updateFilterDropdowns(departments, roles, this.currentFilters);
    }

    /**
     * Load and display employees
     */
    async loadEmployees() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            // Simulate API delay for demo
            await new Promise(resolve => setTimeout(resolve, 300));

            // Apply filters
            const filteredEmployees = EmployeeData.applyFilters(this.currentFilters);
            
            // Apply sorting
            const sortedEmployees = EmployeeData.sortEmployees(
                filteredEmployees,
                this.currentSort.field,
                this.currentSort.order
            );

            // Get paginated results
            const result = EmployeeData.getPaginatedEmployees(
                this.currentPage,
                this.itemsPerPage,
                sortedEmployees
            );

            this.currentEmployees = result.data;
            this.renderEmployees(this.currentEmployees);
            this.updatePagination(result.pagination);

            // Show empty state if no employees
            if (this.currentEmployees.length === 0) {
                this.showEmptyState();
            } else {
                this.hideEmptyState();
            }

        } catch (error) {
            console.error('Error loading employees:', error);
            Components.showToast('Error loading employees', 'error');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Render employees based on current view
     * @param {Array} employees - Array of employee data
     */
    renderEmployees(employees) {
        if (!employees || employees.length === 0) {
            this.elements.employeeGrid.innerHTML = '';
            return;
        }

        let html = '';
        
        if (this.currentView === 'grid') {
            html = employees.map(employee => Components.createEmployeeCard(employee)).join('');
            this.elements.employeeGrid.className = 'employee-grid';
        } else {
            html = Components.createEmployeeList(employees);
            this.elements.employeeGrid.className = 'employee-grid list-view';
        }

        Components.renderToDOM('#employeeGrid', html);
        
        // Trigger animations
        setTimeout(() => {
            const cards = this.elements.employeeGrid.querySelectorAll('.employee-card, .employee-list__row');
            Components.staggerAnimations(cards, 50);
        }, 100);
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.elements.loadingState.classList.remove('hidden');
        this.elements.employeeGrid.style.opacity = '0.5';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.elements.loadingState.classList.add('hidden');
        this.elements.employeeGrid.style.opacity = '1';
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        this.elements.emptyState.classList.remove('hidden');
    }

    /**
     * Hide empty state
     */
    hideEmptyState() {
        this.elements.emptyState.classList.add('hidden');
    }

    /**
     * Switch between grid and list view
     * @param {string} view - View type ('grid' or 'list')
     */
    switchView(view) {
        if (view === this.currentView) return;
        
        this.currentView = view;
        Components.updateViewToggle(view);
        this.renderEmployees(this.currentEmployees);
        
        // Save preference
        Utils.LocalStorage.set('preferredView', view);
    }

    /**
     * Perform search
     */
    performSearch() {
        this.currentPage = 1;
        this.loadEmployees();
    }

    /**
     * Apply filters
     */
    applyFilters() {
        this.currentPage = 1;
        this.loadEmployees();
        this.closeFilterSidebar();
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.elements.searchInput.value = '';
        this.currentFilters.search = '';
        this.performSearch();
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.currentFilters = {
            search: '',
            department: '',
            role: ''
        };
        
        this.elements.searchInput.value = '';
        this.elements.departmentFilter.value = '';
        this.elements.roleFilter.value = '';
        
        this.performSearch();
    }

    /**
     * Reset search and filters
     */
    resetSearch() {
        this.clearFilters();
        this.currentPage = 1;
        Components.showToast('Search and filters reset', 'info');
    }

    /**
     * Focus search input
     */
    focusSearch() {
        this.elements.searchInput.focus();
    }

    /**
     * Toggle filter sidebar
     */
    toggleFilterSidebar() {
        this.elements.filterSidebar.classList.toggle('active');
    }

    /**
     * Close filter sidebar
     */
    closeFilterSidebar() {
        this.elements.filterSidebar.classList.remove('active');
    }

    /**
     * Show employee modal
     * @param {Object} employee - Employee data for editing (optional)
     */
    showEmployeeModal(employee = null) {
        this.editingEmployeeId = employee ? employee.id : null;
        
        // Update modal title
        this.elements.modalTitle.textContent = employee ? 'Edit Employee' : 'Add New Employee';
        
        // Populate form if editing
        if (employee) {
            this.populateForm(employee);
        } else {
            this.clearForm();
        }
        
        // Show modal
        this.elements.employeeModal.classList.add('active');
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.elements.employeeForm.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    /**
     * Close employee modal
     */
    closeEmployeeModal() {
        this.elements.employeeModal.classList.remove('active');
        this.clearForm();
        this.editingEmployeeId = null;
    }

    /**
     * Populate form with employee data
     * @param {Object} employee - Employee data
     */
    populateForm(employee) {
        document.getElementById('firstName').value = employee.firstName || '';
        document.getElementById('lastName').value = employee.lastName || '';
        document.getElementById('email').value = employee.email || '';
        document.getElementById('department').value = employee.department || '';
        document.getElementById('role').value = employee.role || '';
        document.getElementById('phone').value = employee.phone || '';
    }

    /**
     * Clear form
     */
    clearForm() {
        this.elements.employeeForm.reset();
        this.clearFormErrors();
    }

    /**
     * Clear form validation errors
     */
    clearFormErrors() {
        const formGroups = this.elements.employeeForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, select');
            const errorElement = group.querySelector('.form-group__error');
            
            if (input) {
                input.classList.remove('error');
                Utils.FormValidation.clearError(input);
            }
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        });
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit() {
        const formData = this.getFormData();
        const validation = EmployeeData.validateEmployee(formData);
        
        if (!validation.valid) {
            this.showFormErrors(validation.errors);
            return;
        }

        try {
            if (this.editingEmployeeId) {
                // Update existing employee
                const updatedEmployee = EmployeeData.updateEmployee(this.editingEmployeeId, formData);
                if (updatedEmployee) {
                    Components.showToast('Employee updated successfully', 'success');
                } else {
                    Components.showToast('Error updating employee', 'error');
                }
            } else {
                // Add new employee
                const newEmployee = EmployeeData.addEmployee(formData);
                Components.showToast('Employee added successfully', 'success');
            }

            this.closeEmployeeModal();
            this.loadEmployees();
            
        } catch (error) {
            console.error('Error saving employee:', error);
            Components.showToast('Error saving employee', 'error');
        }
    }

    /**
     * Get form data
     * @returns {Object} Form data
     */
    getFormData() {
        return {
            id: this.editingEmployeeId ?? null,
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            department: document.getElementById('department').value.trim(),
            role: document.getElementById('role').value.trim(),
            phone: document.getElementById('phone').value.trim() || null
        };
    }

    /**
     * Show form validation errors
     * @param {Object} errors - Validation errors
     */
    showFormErrors(errors) {
        Object.keys(errors).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                Utils.FormValidation.showError(input, [errors[field]]);
            }
        });
    }

    /**
     * Show delete confirmation
     * @param {Object} employee - Employee to delete
     */
    showDeleteConfirmation(employee) {
        this.employeeToDelete = employee;
        this.elements.confirmModal.classList.add('active');
    }

    /**
     * Close delete confirmation
     */
    closeDeleteConfirmation() {
        this.elements.confirmModal.classList.remove('active');
        this.employeeToDelete = null;
    }

    /**
     * Confirm delete
     */
    async confirmDelete() {
        if (!this.employeeToDelete) return;

        try {
            const success = EmployeeData.deleteEmployee(this.employeeToDelete.id);
            if (success) {
                Components.showToast('Employee deleted successfully', 'success');
                this.loadEmployees();
            } else {
                Components.showToast('Error deleting employee', 'error');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            Components.showToast('Error deleting employee', 'error');
        }

        this.closeDeleteConfirmation();
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        this.closeEmployeeModal();
        this.closeDeleteConfirmation();
    }

    /**
     * Update pagination
     * @param {Object} pagination - Pagination data
     */
    updatePagination(pagination) {
        Components.updatePagination(pagination);
    }

    /**
     * Go to previous page
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadEmployees();
        }
    }

    /**
     * Go to next page
     */
    goToNextPage() {
        this.currentPage++;
        this.loadEmployees();
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const stats = EmployeeData.getStatistics();
        const message = `Welcome to Employee Directory! Managing ${stats.total} employees across ${Object.keys(stats.departments).length} departments.`;
        Components.showToast(message, 'info', 3000);
    }

    /**
     * Get current state for debugging
     * @returns {Object} Current application state
     */
    getState() {
        return {
            currentView: this.currentView,
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            currentFilters: this.currentFilters,
            currentSort: this.currentSort,
            employeeCount: this.currentEmployees.length,
            isLoading: this.isLoading
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.App = new EmployeeDirectoryApp();
    
    // Initialize the application
    window.App.init();
    
    // Add some development helpers
    if (window.location.hostname === 'localhost') {
        window.devHelpers = {
            app: window.App,
            data: window.EmployeeData,
            components: window.Components,
            utils: window.Utils,
            resetData: () => {
                window.EmployeeData.resetToDefaults();
                window.App.loadEmployees();
                console.log('Data reset to defaults');
            },
            exportData: () => {
                const csv = window.EmployeeData.exportToCSV();
                console.log('Employee data (CSV):', csv);
                return csv;
            }
        };
        
        console.log('🚀 Employee Directory loaded successfully!');
        console.log('💡 Development helpers available at window.devHelpers');
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.App) {
        // Refresh data when page becomes visible
        window.App.loadEmployees();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.Components) {
        window.Components.showToast('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.Components) {
        window.Components.showToast('You are offline', 'info');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmployeeDirectoryApp;
}