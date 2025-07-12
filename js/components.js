// ===== PREMIUM EMPLOYEE DIRECTORY - COMPONENT CREATION =====

/**
 * Component Manager for creating and managing UI components
 */
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.toastQueue = [];
        this.toastContainer = null;
    }

    /**
     * Initialize the component manager
     */
    init() {
        this.toastContainer = document.getElementById('toastContainer');
        this.setupEventDelegation();
    }

    /**
     * Setup event delegation for component interactions
     */
    setupEventDelegation() {
        // Delegate events to the document for dynamically created elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const employeeId = target.dataset.employeeId;

            switch (action) {
                case 'edit':
                    this.handleEditEmployee(employeeId);
                    break;
                case 'delete':
                    this.handleDeleteEmployee(employeeId);
                    break;
            }
        });
    }

    /**
     * Handle edit employee action
     * @param {string} employeeId - Employee ID
     */
    handleEditEmployee(employeeId) {
        const employee = EmployeeData.getEmployeeById(employeeId);
        if (employee) {
            window.App.showEmployeeModal(employee);
        }
    }

    /**
     * Handle delete employee action
     * @param {string} employeeId - Employee ID
     */
    handleDeleteEmployee(employeeId) {
        const employee = EmployeeData.getEmployeeById(employeeId);
        if (employee) {
            window.App.showDeleteConfirmation(employee);
        }
    }

    /**
     * Create an employee card component
     * @param {Object} employee - Employee data
     * @returns {string} HTML string for the employee card
     */
    createEmployeeCard(employee) {
        const initials = Utils.getInitials(employee.firstName, employee.lastName);
        const joinDate = Utils.formatDate(employee.joinDate, 'short');
        const phoneDisplay = employee.phone ? Utils.formatPhoneNumber(employee.phone) : null;

        return `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-card__header">
                    <div class="employee-card__avatar">
                        ${employee.avatar ? 
                            `<img src="${employee.avatar}" alt="${employee.firstName} ${employee.lastName}">` :
                            `<div class="employee-card__avatar-placeholder">${initials}</div>`
                        }
                    </div>
                    
                    <div class="employee-card__actions">
                        <button class="employee-card__action" data-action="edit" data-employee-id="${employee.id}" title="Edit Employee">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="employee-card__action employee-card__action--danger" data-action="delete" data-employee-id="${employee.id}" title="Delete Employee">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="employee-card__content">
                    <h3 class="employee-card__name">${Utils.sanitizeHtml(employee.firstName)} ${Utils.sanitizeHtml(employee.lastName)}</h3>
                    <p class="employee-card__email">${Utils.sanitizeHtml(employee.email)}</p>
                    
                    <div class="employee-card__info">
                        <div class="employee-card__department">
                            <i class="fas fa-building"></i>
                            <span>${Utils.sanitizeHtml(employee.department)}</span>
                        </div>
                        <div class="employee-card__role">
                            <i class="fas fa-user-tie"></i>
                            <span>${Utils.sanitizeHtml(employee.role)}</span>
                        </div>
                        ${phoneDisplay ? `
                            <div class="employee-card__contact">
                                <i class="fas fa-phone"></i>
                                <span>${phoneDisplay}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="employee-card__footer">
                    <small class="employee-card__joined">
                        <i class="fas fa-calendar"></i>
                        Joined ${joinDate}
                    </small>
                </div>
            </div>
        `;
    }

    /**
     * Create an employee list row component
     * @param {Object} employee - Employee data
     * @returns {string} HTML string for the employee list row
     */
    createEmployeeListRow(employee) {
        const initials = Utils.getInitials(employee.firstName, employee.lastName);
        const joinDate = Utils.formatDate(employee.joinDate, 'medium');
        const phoneDisplay = employee.phone ? Utils.formatPhoneNumber(employee.phone) : null;
        const departmentClass = employee.department.toLowerCase().replace(/\s+/g, '');

        return `
            <div class="employee-list__row" data-employee-id="${employee.id}">
                <div class="employee-list__cell employee-list__cell--name">
                    <div class="employee-list__avatar">
                        ${employee.avatar ? 
                            `<img src="${employee.avatar}" alt="${employee.firstName} ${employee.lastName}">` :
                            `<div class="employee-list__avatar-placeholder">${initials}</div>`
                        }
                    </div>
                    <div class="employee-list__info">
                        <div class="employee-list__name">${Utils.sanitizeHtml(employee.firstName)} ${Utils.sanitizeHtml(employee.lastName)}</div>
                        <div class="employee-list__email">${Utils.sanitizeHtml(employee.email)}</div>
                    </div>
                </div>
                
                <div class="employee-list__cell employee-list__cell--department">
                    <span class="employee-list__badge employee-list__badge--${departmentClass}">
                        ${Utils.sanitizeHtml(employee.department)}
                    </span>
                </div>
                
                <div class="employee-list__cell employee-list__cell--role">
                    ${Utils.sanitizeHtml(employee.role)}
                </div>
                
                <div class="employee-list__cell employee-list__cell--contact">
                    ${phoneDisplay ? `
                        <div class="employee-list__phone">
                            <i class="fas fa-phone"></i>
                            ${phoneDisplay}
                        </div>
                    ` : ''}
                    <div class="employee-list__joined">
                        <i class="fas fa-calendar"></i>
                        ${joinDate}
                    </div>
                </div>
                
                <div class="employee-list__cell employee-list__cell--actions">
                    <button class="employee-list__action" data-action="edit" data-employee-id="${employee.id}" title="Edit Employee">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="employee-list__action employee-list__action--danger" data-action="delete" data-employee-id="${employee.id}" title="Delete Employee">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Create the employee list header
     * @returns {string} HTML string for the employee list header
     */
    createEmployeeListHeader() {
        return `
            <div class="employee-list__header">
                <div class="employee-list__column">Name</div>
                <div class="employee-list__column">Department</div>
                <div class="employee-list__column">Role</div>
                <div class="employee-list__column">Contact</div>
                <div class="employee-list__column">Actions</div>
            </div>
        `;
    }

    /**
     * Create the complete employee list component
     * @param {Array} employees - Array of employee data
     * @returns {string} HTML string for the complete employee list
     */
    createEmployeeList(employees) {
        const header = this.createEmployeeListHeader();
        const rows = employees.map(employee => this.createEmployeeListRow(employee)).join('');
        
        return `
            <div class="employee-list">
                ${header}
                <div class="employee-list__body">
                    ${rows}
                </div>
            </div>
        `;
    }

    /**
     * Create skeleton loading cards
     * @param {number} count - Number of skeleton cards to create
     * @returns {string} HTML string for skeleton loading cards
     */
    createSkeletonCards(count = 4) {
        const cards = Array(count).fill(null).map(() => `
            <div class="skeleton-card"></div>
        `).join('');

        return `
            <div class="skeleton-loader">
                ${cards}
            </div>
        `;
    }

    /**
     * Create empty state component
     * @param {string} title - Title for the empty state
     * @param {string} message - Message for the empty state
     * @param {string} buttonText - Button text (optional)
     * @param {Function} buttonAction - Button action (optional)
     * @returns {string} HTML string for the empty state
     */
    createEmptyState(title = 'No employees found', message = 'Try adjusting your search or filter criteria', buttonText = null, buttonAction = null) {
        return `
            <div class="empty-state">
                <div class="empty-state__content">
                    <i class="fas fa-users empty-state__icon"></i>
                    <h3 class="empty-state__title">${title}</h3>
                    <p class="empty-state__message">${message}</p>
                    ${buttonText ? `
                        <button class="btn btn--primary" id="resetSearch">
                            <i class="fas fa-refresh"></i>
                            ${buttonText}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Create pagination component
     * @param {Object} pagination - Pagination data
     * @returns {string} HTML string for pagination
     */
    createPagination(pagination) {
        const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPrevPage } = pagination;

        return `
            <div class="pagination">
                <button class="pagination__btn" id="prevBtn" ${!hasPrevPage ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                    Previous
                </button>
                <div class="pagination__info">
                    Page ${currentPage} of ${totalPages} (${totalItems} total)
                </div>
                <button class="pagination__btn" id="nextBtn" ${!hasNextPage ? 'disabled' : ''}>
                    Next
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of toast ('success', 'error', 'info')
     * @param {number} duration - Duration in milliseconds
     */
    showToast(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        this.toastContainer.appendChild(toast);

        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto-hide toast
        setTimeout(() => {
            this.hideToast(toast);
        }, duration);
    }

    /**
     * Create a toast element
     * @param {string} message - Message to display
     * @param {string} type - Type of toast
     * @returns {HTMLElement} Toast element
     */
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast__icon ${iconMap[type]}"></i>
            <div class="toast__message">${Utils.sanitizeHtml(message)}</div>
            <button class="toast__close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        return toast;
    }

    /**
     * Hide toast notification
     * @param {HTMLElement} toast - Toast element to hide
     */
    hideToast(toast) {
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Create form validation error display
     * @param {Object} errors - Validation errors object
     * @returns {string} HTML string for error display
     */
    createFormErrors(errors) {
        if (!errors || Object.keys(errors).length === 0) {
            return '';
        }

        const errorList = Object.values(errors).map(error => `
            <li>${Utils.sanitizeHtml(error)}</li>
        `).join('');

        return `
            <div class="form-errors">
                <ul class="form-errors__list">
                    ${errorList}
                </ul>
            </div>
        `;
    }

    /**
     * Create loading spinner
     * @param {string} type - Type of spinner ('primary', 'secondary')
     * @returns {string} HTML string for loading spinner
     */
    createLoadingSpinner(type = 'primary') {
        return `<div class="loading-spinner loading-spinner--${type}"></div>`;
    }

    /**
     * Create department filter options
     * @param {Array} departments - Array of department names
     * @param {string} selectedDepartment - Currently selected department
     * @returns {string} HTML string for department options
     */
    createDepartmentOptions(departments, selectedDepartment = '') {
        const options = departments.map(dept => `
            <option value="${dept}" ${dept === selectedDepartment ? 'selected' : ''}>
                ${Utils.sanitizeHtml(dept)}
            </option>
        `).join('');

        return `
            <option value="">All Departments</option>
            ${options}
        `;
    }

    /**
     * Create role filter options
     * @param {Array} roles - Array of role names
     * @param {string} selectedRole - Currently selected role
     * @returns {string} HTML string for role options
     */
    createRoleOptions(roles, selectedRole = '') {
        const options = roles.map(role => `
            <option value="${role}" ${role === selectedRole ? 'selected' : ''}>
                ${Utils.sanitizeHtml(role)}
            </option>
        `).join('');

        return `
            <option value="">All Roles</option>
            ${options}
        `;
    }

    /**
     * Render components to the DOM
     * @param {string} containerSelector - CSS selector for container
     * @param {string} html - HTML string to render
     * @param {boolean} animate - Whether to animate the rendering
     */
    renderToDOM(containerSelector, html, animate = true) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        if (animate) {
            // Fade out existing content
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = html;
                container.style.opacity = '1';
            }, 150);
        } else {
            container.innerHTML = html;
        }
    }

    /**
     * Clear container content
     * @param {string} containerSelector - CSS selector for container
     */
    clearContainer(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = '';
        }
    }

    /**
     * Show loading state
     * @param {string} containerSelector - CSS selector for container
     * @param {number} skeletonCount - Number of skeleton items to show
     */
    showLoading(containerSelector, skeletonCount = 4) {
        const loadingHtml = this.createSkeletonCards(skeletonCount);
        this.renderToDOM(containerSelector, loadingHtml, false);
    }

    /**
     * Hide loading state
     * @param {string} containerSelector - CSS selector for container
     */
    hideLoading(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
            const loadingState = container.querySelector('.loading-state, .skeleton-loader');
            if (loadingState) {
                loadingState.remove();
            }
        }
    }

    /**
     * Update view toggle buttons
     * @param {string} activeView - Active view ('grid' or 'list')
     */
    updateViewToggle(activeView) {
        const buttons = document.querySelectorAll('.view-toggle__btn');
        buttons.forEach(btn => {
            btn.classList.toggle('view-toggle__btn--active', btn.dataset.view === activeView);
        });
    }

    /**
     * Update pagination display
     * @param {Object} pagination - Pagination data
     */
    updatePagination(pagination) {
        const paginationContainer = document.getElementById('pagination');
        if (paginationContainer) {
            paginationContainer.innerHTML = this.createPagination(pagination);
        }
    }

    /**
     * Update filter dropdowns
     * @param {Array} departments - Available departments
     * @param {Array} roles - Available roles
     * @param {Object} selectedFilters - Currently selected filters
     */
    updateFilterDropdowns(departments, roles, selectedFilters = {}) {
        const departmentSelect = document.getElementById('departmentFilter');
        const roleSelect = document.getElementById('roleFilter');

        if (departmentSelect) {
            departmentSelect.innerHTML = this.createDepartmentOptions(departments, selectedFilters.department);
        }

        if (roleSelect) {
            roleSelect.innerHTML = this.createRoleOptions(roles, selectedFilters.role);
        }
    }

    /**
     * Animate element entrance
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - Animation class to add
     * @param {number} delay - Delay before animation starts
     */
    animateEntrance(element, animationClass = 'animate-fadeInUp', delay = 0) {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, delay);
    }

    /**
     * Stagger animations for multiple elements
     * @param {NodeList} elements - Elements to animate
     * @param {number} staggerDelay - Delay between each animation
     */
    staggerAnimations(elements, staggerDelay = 100) {
        elements.forEach((element, index) => {
            this.animateEntrance(element, 'animate-fadeInUp', index * staggerDelay);
        });
    }

    /**
     * Handle responsive image loading
     * @param {HTMLElement} img - Image element
     * @param {string} src - Image source
     * @param {string} alt - Alt text
     */
    loadImage(img, src, alt) {
        img.onload = () => {
            img.classList.add('loaded');
        };
        img.onerror = () => {
            img.style.display = 'none';
            // Show placeholder instead
            const placeholder = img.nextElementSibling;
            if (placeholder && placeholder.classList.contains('avatar-placeholder')) {
                placeholder.style.display = 'flex';
            }
        };
        img.src = src;
        img.alt = alt;
    }

    /**
     * Create breadcrumb navigation
     * @param {Array} breadcrumbs - Array of breadcrumb items
     * @returns {string} HTML string for breadcrumbs
     */
    createBreadcrumbs(breadcrumbs) {
        const items = breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <li class="breadcrumb__item ${isLast ? 'breadcrumb__item--active' : ''}">
                    ${isLast ? 
                        `<span>${Utils.sanitizeHtml(item.text)}</span>` :
                        `<a href="${item.href || '#'}">${Utils.sanitizeHtml(item.text)}</a>`
                    }
                </li>
            `;
        }).join('');

        return `
            <nav class="breadcrumb">
                <ol class="breadcrumb__list">
                    ${items}
                </ol>
            </nav>
        `;
    }
}

// Create global instance
window.Components = new ComponentManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.Components.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentManager;
}