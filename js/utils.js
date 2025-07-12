// ===== PREMIUM EMPLOYEE DIRECTORY - UTILITY FUNCTIONS =====

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to trigger the function on the leading edge
 * @returns {Function} The debounced function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle function to limit the rate at which a function can fire
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to throttle
 * @returns {Function} The throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Generate a unique ID
 * @returns {string} A unique identifier
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format a date string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'medium', 'long')
 * @returns {string} The formatted date string
 */
function formatDate(date, format = 'medium') {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }
    
    const options = {
        short: { year: 'numeric', month: 'short' },
        medium: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' }
    };
    
    return dateObj.toLocaleDateString('en-US', options[format]);
}

/**
 * Format a phone number
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} The formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phoneNumber; // Return original if can't format
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get initials from a name
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The initials
 */
function getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
}

/**
 * Validate an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate a phone number
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
function isValidPhone(phoneNumber) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const digits = phoneNumber.replace(/\D/g, '');
    return phoneRegex.test(digits) && digits.length >= 10;
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @returns {string} The sanitized HTML string
 */
function sanitizeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Deep clone an object
 * @param {any} obj - The object to clone
 * @returns {any} The cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
}

/**
 * Get a nested property from an object safely
 * @param {Object} obj - The object to get the property from
 * @param {string} path - The path to the property (e.g., 'user.profile.name')
 * @param {any} defaultValue - The default value if the property doesn't exist
 * @returns {any} The property value or default value
 */
function getNestedProperty(obj, path, defaultValue = null) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
}

/**
 * Set a nested property on an object
 * @param {Object} obj - The object to set the property on
 * @param {string} path - The path to the property (e.g., 'user.profile.name')
 * @param {any} value - The value to set
 */
function setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (current[key] === undefined) {
            current[key] = {};
        }
        return current[key];
    }, obj);
    target[lastKey] = value;
}

/**
 * Check if an element is visible in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} Whether the element is visible
 */
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to an element
 * @param {HTMLElement|string} element - The element or selector to scroll to
 * @param {number} offset - The offset from the top (default: 0)
 */
function smoothScrollTo(element, offset = 0) {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;
    
    const targetPosition = target.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Add event listener with automatic cleanup
 * @param {HTMLElement} element - The element to add the listener to
 * @param {string} event - The event type
 * @param {Function} handler - The event handler
 * @param {Object} options - Event listener options
 * @returns {Function} Cleanup function
 */
function addEventListenerWithCleanup(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
}

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - The tag name
 * @param {Object} attributes - The attributes to set
 * @param {Array|string} children - The children to append
 * @returns {HTMLElement} The created element
 */
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add children
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Local storage utilities with JSON support
 */
const LocalStorage = {
    /**
     * Set an item in local storage
     * @param {string} key - The key
     * @param {any} value - The value
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting localStorage item:', error);
        }
    },
    
    /**
     * Get an item from local storage
     * @param {string} key - The key
     * @param {any} defaultValue - The default value
     * @returns {any} The stored value or default value
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting localStorage item:', error);
            return defaultValue;
        }
    },
    
    /**
     * Remove an item from local storage
     * @param {string} key - The key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing localStorage item:', error);
        }
    },
    
    /**
     * Clear all local storage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

/**
 * Animation utilities
 */
const AnimationUtils = {
    /**
     * Add a CSS class with animation
     * @param {HTMLElement} element - The element
     * @param {string} className - The class name
     * @param {number} duration - The animation duration in ms
     */
    addClassWithAnimation(element, className, duration = 300) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    },
    
    /**
     * Fade in an element
     * @param {HTMLElement} element - The element to fade in
     * @param {number} duration - The duration in ms
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    /**
     * Fade out an element
     * @param {HTMLElement} element - The element to fade out
     * @param {number} duration - The duration in ms
     */
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
};

/**
 * Form validation utilities
 */
const FormValidation = {
    /**
     * Validate a form field
     * @param {HTMLElement} field - The form field
     * @returns {Object} Validation result
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.required;
        const errors = [];
        
        if (required && !value) {
            errors.push('This field is required');
        }
        
        if (value && type === 'email' && !isValidEmail(value)) {
            errors.push('Please enter a valid email address');
        }
        
        if (value && type === 'tel' && !isValidPhone(value)) {
            errors.push('Please enter a valid phone number');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            value
        };
    },
    
    /**
     * Show validation error on a field
     * @param {HTMLElement} field - The form field
     * @param {Array} errors - The error messages
     */
    showError(field, errors) {
        field.classList.add('error');
        const errorElement = field.parentElement.querySelector('.form-group__error');
        if (errorElement) {
            errorElement.textContent = errors[0];
            errorElement.classList.add('show');
        }
    },
    
    /**
     * Clear validation error on a field
     * @param {HTMLElement} field - The form field
     */
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.form-group__error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
};

// Export utilities to global scope
window.Utils = {
    debounce,
    throttle,
    generateId,
    formatDate,
    formatPhoneNumber,
    capitalize,
    getInitials,
    isValidEmail,
    isValidPhone,
    sanitizeHtml,
    deepClone,
    getNestedProperty,
    setNestedProperty,
    isElementVisible,
    smoothScrollTo,
    addEventListenerWithCleanup,
    createElement,
    LocalStorage,
    AnimationUtils,
    FormValidation
};