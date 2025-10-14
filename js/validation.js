/**
 * VALIDACIONES - MOTOTRANSPORTE SATÉLITE
 * Funciones de validación para formularios y datos
 */

const Validation = {
    /**
     * Valida que un campo no esté vacío
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    /**
     * Valida longitud mínima
     * @param {string} value - Valor a validar
     * @param {number} min - Longitud mínima
     * @returns {boolean} - True si es válido
     */
    minLength(value, min) {
        return value && value.toString().length >= min;
    },

    /**
     * Valida longitud máxima
     * @param {string} value - Valor a validar
     * @param {number} max - Longitud máxima
     * @returns {boolean} - True si es válido
     */
    maxLength(value, max) {
        return value && value.toString().length <= max;
    },

    /**
     * Valida formato de email
     * @param {string} email - Email a validar
     * @returns {boolean} - True si es válido
     */
    email(email) {
        if (!email) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Valida número de teléfono boliviano
     * @param {string} phone - Teléfono a validar
     * @returns {boolean} - True si es válido
     */
    phone(phone) {
        if (!phone) return false;
        // Formato: 8 dígitos o +591 seguido de 8 dígitos
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 8 || (cleaned.length === 11 && cleaned.startsWith('591'));
    },

    /**
     * Valida Cédula de Identidad boliviana
     * @param {string} ci - CI a validar
     * @returns {boolean} - True si es válido
     */
    ci(ci) {
        if (!ci) return false;
        // CI boliviana: 7-8 dígitos seguido de extensión (1-4 letras)
        // Ejemplos válidos: 12345678, 1234567-SC, 12345678-CBBA, 1234567LP
        const regex = /^\d{7,8}(-?[A-Z]{1,4})?$/i;
        return regex.test(ci);
    },

    /**
     * Valida número de licencia de conducir boliviana
     * @param {string} license - Licencia a validar
     * @returns {boolean} - True si es válido
     */
    license(license) {
        if (!license) return false;
        // Formato boliviano: Categoría (1-2 letras) + número (6-8 dígitos)
        // Ejemplos: A-1234567, B-12345678, C-1234567, PROF-1234567
        const regex = /^[A-Z]{1,4}-?\d{6,8}$/i;
        return regex.test(license);
    },

    /**
     * Valida placa de vehículo boliviana
     * @param {string} plate - Placa a validar
     * @returns {boolean} - True si es válido
     */
    plate(plate) {
        if (!plate) return false;
        // Formato boliviano actual: 4 números + 3 letras
        // Ejemplos: 1234ABC, 5678XYZ
        // También acepta formato antiguo: 3 números + 3 letras (123ABC)
        const cleanPlate = plate.replace(/[\s-]/g, '').toUpperCase();
        const regex = /^(\d{3,4}[A-Z]{3})$/;
        return regex.test(cleanPlate);
    },

    /**
     * Valida rango numérico
     * @param {number} value - Valor a validar
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {boolean} - True si es válido
     */
    range(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    /**
     * Valida que sea un número
     * @param {any} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    number(value) {
        return !isNaN(Number(value));
    },

    /**
     * Valida que sea un número entero
     * @param {any} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    integer(value) {
        return Number.isInteger(Number(value));
    },

    /**
     * Valida formato de fecha
     * @param {string} date - Fecha a validar
     * @returns {boolean} - True si es válido
     */
    date(date) {
        if (!date) return false;
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },

    /**
     * Valida que la fecha sea pasada
     * @param {string} date - Fecha a validar
     * @returns {boolean} - True si es válido
     */
    pastDate(date) {
        if (!this.date(date)) return false;
        return new Date(date) < new Date();
    },

    /**
     * Valida que la fecha sea futura
     * @param {string} date - Fecha a validar
     * @returns {boolean} - True si es válido
     */
    futureDate(date) {
        if (!this.date(date)) return false;
        return new Date(date) > new Date();
    },

    /**
     * Valida edad mínima
     * @param {string} birthDate - Fecha de nacimiento
     * @param {number} minAge - Edad mínima
     * @returns {boolean} - True si es válido
     */
    minAge(birthDate, minAge) {
        if (!this.date(birthDate)) return false;
        const age = Utils.calculateAge(birthDate);
        return age >= minAge;
    },

    /**
     * Valida edad máxima
     * @param {string} birthDate - Fecha de nacimiento
     * @param {number} maxAge - Edad máxima
     * @returns {boolean} - True si es válido
     */
    maxAge(birthDate, maxAge) {
        if (!this.date(birthDate)) return false;
        const age = Utils.calculateAge(birthDate);
        return age <= maxAge;
    },

    /**
     * Valida formato de hora (HH:MM)
     * @param {string} time - Hora a validar
     * @returns {boolean} - True si es válido
     */
    time(time) {
        if (!time) return false;
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
    },

    /**
     * Valida que solo contenga letras
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    alpha(value) {
        if (!value) return false;
        const regex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/;
        return regex.test(value);
    },

    /**
     * Valida que solo contenga letras y números
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    alphanumeric(value) {
        if (!value) return false;
        const regex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s]+$/;
        return regex.test(value);
    },

    /**
     * Valida dirección
     * @param {string} address - Dirección a validar
     * @returns {boolean} - True si es válido
     */
    address(address) {
        return this.required(address) && this.minLength(address, 10);
    },

    /**
     * Valida nombre completo
     * @param {string} name - Nombre a validar
     * @returns {boolean} - True si es válido
     */
    fullName(name) {
        if (!this.required(name)) return false;
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2 && this.alpha(name);
    },

    /**
     * Valida capacidad de vehículo
     * @param {number} capacity - Capacidad a validar
     * @returns {boolean} - True si es válido
     */
    vehicleCapacity(capacity) {
        return this.integer(capacity) && this.range(capacity, 1, 50);
    },

    /**
     * Valida datos de estudiante
     * @param {object} student - Datos del estudiante
     * @returns {object} - {valid: boolean, errors: array}
     */
    validateStudent(student) {
        const errors = [];

        if (!this.required(student.ci)) {
            errors.push('La CI es obligatoria');
        } else if (!this.ci(student.ci)) {
            errors.push('Formato de CI inválido. Ejemplos válidos: 12345678, 1234567-SC, 12345678-CBBA');
        }

        if (!this.required(student.fullName)) {
            errors.push('El nombre completo es obligatorio');
        } else if (!this.fullName(student.fullName)) {
            errors.push('Debe ingresar nombre y apellido (solo letras)');
        }

        if (!this.required(student.birthDate)) {
            errors.push('La fecha de nacimiento es obligatoria');
        } else if (!this.pastDate(student.birthDate)) {
            errors.push('La fecha de nacimiento debe ser pasada');
        } else if (!this.minAge(student.birthDate, 3)) {
            errors.push('El estudiante debe tener al menos 3 años');
        } else if (!this.maxAge(student.birthDate, 18)) {
            errors.push('El estudiante no puede tener más de 18 años');
        }

        if (!this.required(student.address)) {
            errors.push('La dirección es obligatoria');
        } else if (!this.address(student.address)) {
            errors.push('La dirección debe tener al menos 10 caracteres');
        }

        if (!this.required(student.phone)) {
            errors.push('El teléfono es obligatorio');
        } else if (!this.phone(student.phone)) {
            errors.push('Formato de teléfono inválido (8 dígitos). Ejemplo: 78901234');
        }

        if (student.parentEmail && !this.email(student.parentEmail)) {
            errors.push('Formato de email inválido');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Valida datos de conductor
     * @param {object} driver - Datos del conductor
     * @returns {object} - {valid: boolean, errors: array}
     */
    validateDriver(driver) {
        const errors = [];

        if (!this.required(driver.ci)) {
            errors.push('La CI es obligatoria');
        } else if (!this.ci(driver.ci)) {
            errors.push('Formato de CI inválido. Ejemplos: 12345678, 1234567-SC, 12345678-CBBA');
        }

        if (!this.required(driver.fullName)) {
            errors.push('El nombre completo es obligatorio');
        } else if (!this.fullName(driver.fullName)) {
            errors.push('Debe ingresar nombre y apellido (solo letras)');
        }

        if (!this.required(driver.phone)) {
            errors.push('El teléfono es obligatorio');
        } else if (!this.phone(driver.phone)) {
            errors.push('Formato de teléfono inválido (8 dígitos). Ejemplo: 78901234');
        }

        if (!this.required(driver.license)) {
            errors.push('El número de licencia es obligatorio');
        } else if (!this.license(driver.license)) {
            errors.push('Formato de licencia inválido. Ejemplos: A-1234567, B-12345678, PROF-1234567');
        }

        if (!this.required(driver.licenseExpiry)) {
            errors.push('La fecha de vencimiento de licencia es obligatoria');
        } else if (!this.futureDate(driver.licenseExpiry)) {
            errors.push('La licencia debe estar vigente (fecha futura)');
        }

        if (driver.email && !this.email(driver.email)) {
            errors.push('Formato de email inválido');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Valida datos de vehículo
     * @param {object} vehicle - Datos del vehículo
     * @returns {object} - {valid: boolean, errors: array}
     */
    validateVehicle(vehicle) {
        const errors = [];

        if (!this.required(vehicle.plate)) {
            errors.push('La placa es obligatoria');
        } else if (!this.plate(vehicle.plate)) {
            errors.push('Formato de placa inválido. Ejemplos válidos: 1234ABC, 5678XYZ');
        }

        if (!this.required(vehicle.brand)) {
            errors.push('La marca es obligatoria');
        } else if (!this.alpha(vehicle.brand)) {
            errors.push('La marca solo puede contener letras');
        }

        if (!this.required(vehicle.model)) {
            errors.push('El modelo es obligatorio');
        } else if (!this.alphanumeric(vehicle.model)) {
            errors.push('El modelo contiene caracteres inválidos');
        }

        if (!this.required(vehicle.year)) {
            errors.push('El año es obligatorio');
        } else if (!this.range(vehicle.year, 1990, new Date().getFullYear() + 1)) {
            errors.push(`El año debe estar entre 1990 y ${new Date().getFullYear() + 1}`);
        }

        if (!this.required(vehicle.capacity)) {
            errors.push('La capacidad es obligatoria');
        } else if (!this.vehicleCapacity(vehicle.capacity)) {
            errors.push('La capacidad debe ser entre 1 y 50 pasajeros');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Valida datos de ruta
     * @param {object} route - Datos de la ruta
     * @returns {object} - {valid: boolean, errors: array}
     */
    validateRoute(route) {
        const errors = [];

        if (!this.required(route.name)) {
            errors.push('El nombre de la ruta es obligatorio');
        } else if (!this.minLength(route.name, 3)) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }

        if (!this.required(route.zone)) {
            errors.push('La zona es obligatoria');
        }

        if (!this.required(route.pickupTime)) {
            errors.push('La hora de recogida es obligatoria');
        } else if (!this.time(route.pickupTime)) {
            errors.push('Formato de hora inválido (HH:MM)');
        }

        if (!this.required(route.dropoffTime)) {
            errors.push('La hora de entrega es obligatoria');
        } else if (!this.time(route.dropoffTime)) {
            errors.push('Formato de hora inválido (HH:MM)');
        }

        if (route.pickupTime && route.dropoffTime && route.pickupTime >= route.dropoffTime) {
            errors.push('La hora de entrega debe ser posterior a la de recogida');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Muestra errores de validación en el formulario
     * @param {array} errors - Array de errores
     */
    showErrors(errors) {
        if (errors.length === 0) return;

        const errorList = errors.map(error => `• ${error}`).join('\n');
        
        Swal.fire({
            icon: 'error',
            title: '❌ Errores de Validación',
            html: `<div style="text-align: left; white-space: pre-line;">${errorList}</div>`,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#ef4444'
        });
    }
};

// Exportar para uso global
window.Validation = Validation;