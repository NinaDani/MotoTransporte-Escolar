/**
 * FUNCIONES UTILITARIAS - MOTOTRANSPORTE SATÉLITE
 * Versión LocalStorage (sin PHP)
 */

const Utils = {
    /**
     * Simula peticiones HTTP usando localStorage
     * @param {string} entity - Entidad (students, routes, drivers, vehicles)
     * @param {string} method - Método (GET, POST, PUT, DELETE)
     * @param {object} data - Datos
     * @returns {Promise} - Respuesta simulada
     */
    async request(entity, method = 'GET', data = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const storageKey = entity.replace('php/', '').replace('.php', '');
                    let items = this.getFromStorage(storageKey) || [];

                    switch (method) {
                        case 'GET':
                            resolve({ success: true, data: items });
                            break;

                        case 'POST':
                            items.push(data);
                            this.saveToStorage(storageKey, items);
                            resolve({ success: true, data: data });
                            break;

                        case 'PUT':
                            const updateIndex = items.findIndex(item => item.id === data.id);
                            if (updateIndex !== -1) {
                                items[updateIndex] = { ...items[updateIndex], ...data };
                                this.saveToStorage(storageKey, items);
                                resolve({ success: true, data: items[updateIndex] });
                            } else {
                                resolve({ success: false, message: 'No encontrado' });
                            }
                            break;

                        case 'DELETE':
                            const id = data;
                            items = items.filter(item => item.id !== id);
                            this.saveToStorage(storageKey, items);
                            resolve({ success: true });
                            break;

                        default:
                            resolve({ success: false, message: 'Método no soportado' });
                    }
                } catch (error) {
                    resolve({ success: false, message: error.message });
                }
            }, 100); // Simula latencia de red
        });
    },

    /**
     * Muestra alertas con SweetAlert2
     */
    showAlert(type, title, text = '') {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        Swal.fire({
            icon: type,
            title: `${icons[type]} ${title}`,
            text: text,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#2563eb',
            showClass: {
                popup: 'animate-scaleIn'
            },
            hideClass: {
                popup: 'animate-scaleOut'
            }
        });
    },

    /**
     * Diálogo de confirmación
     */
    async confirmDialog(title, text) {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            showClass: {
                popup: 'animate-scaleIn'
            }
        });

        return result.isConfirmed;
    },

    /**
     * Toast notification
     */
    showToast(type, message) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: type,
            title: message
        });
    },

    /**
     * Formatea fecha a formato legible
     */
    formatDate(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return d.toLocaleDateString('es-ES', options);
    },

    /**
     * Formatea fecha corta
     */
    formatDateShort(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    },

    /**
     * Formatea teléfono boliviano
     */
    formatPhone(phone) {
        if (!phone) return '';
        
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length === 11 && cleaned.startsWith('591')) {
            return `+591 ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
        }
        
        if (cleaned.length === 8) {
            return `${cleaned.substring(0, 3)}-${cleaned.substring(3)}`;
        }
        
        return phone;
    },

    /**
     * Capitaliza texto
     */
    capitalize(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    },

    /**
     * Genera ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },

    /**
     * Fecha y hora actual ISO
     */
    getCurrentDateTime() {
        return new Date().toISOString();
    },

    /**
     * Calcula edad
     */
    calculateAge(birthDate) {
        if (!birthDate) return 0;
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    /**
     * Sanitiza texto (previene XSS)
     */
    sanitize(str) {
        if (!str) return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Debounce
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Muestra/oculta loading
     */
    toggleLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            if (show) {
                loading.classList.remove('hidden');
            } else {
                setTimeout(() => {
                    loading.classList.add('hidden');
                }, 300);
            }
        }
    },

    /**
     * Filtra array por búsqueda
     */
    filterBySearch(array, searchTerm, fields) {
        if (!searchTerm) return array;
        
        const term = searchTerm.toLowerCase();
        
        return array.filter(item => {
            return fields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    },

    /**
     * Ordena array
     */
    sortBy(array, field, order = 'asc') {
        return array.sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    },

    /**
     * Formatea número con separadores
     */
    formatNumber(num) {
        if (!num && num !== 0) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    /**
     * Trunca texto
     */
    truncate(str, length = 50) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    /**
     * Guarda en localStorage
     */
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            this.showAlert('error', 'Error de Almacenamiento', 'No se pudieron guardar los datos. El almacenamiento puede estar lleno.');
        }
    },

    /**
     * Obtiene de localStorage
     */
    getFromStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error obteniendo de localStorage:', error);
            return null;
        }
    },

    /**
     * Elimina de localStorage
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error eliminando de localStorage:', error);
        }
    },

    /**
     * Exporta todos los datos a JSON
     */
    exportAllData() {
        const allData = {
            exportDate: new Date().toISOString(),
            students: this.getFromStorage('students') || [],
            routes: this.getFromStorage('routes') || [],
            drivers: this.getFromStorage('drivers') || [],
            vehicles: this.getFromStorage('vehicles') || []
        };

        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `mototransporte_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showToast('success', '✅ Datos exportados correctamente');
    },

    /**
     * Importa datos desde JSON
     */
    async importData() {
        const { value: file } = await Swal.fire({
            title: 'Importar Datos',
            input: 'file',
            inputAttributes: {
                accept: '.json',
                'aria-label': 'Selecciona archivo JSON'
            },
            showCancelButton: true,
            confirmButtonText: 'Importar',
            cancelButtonText: 'Cancelar'
        });

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.students) this.saveToStorage('students', data.students);
                    if (data.routes) this.saveToStorage('routes', data.routes);
                    if (data.drivers) this.saveToStorage('drivers', data.drivers);
                    if (data.vehicles) this.saveToStorage('vehicles', data.vehicles);
                    
                    this.showAlert('success', 'Importación Exitosa', 'Los datos se han importado correctamente');
                    setTimeout(() => location.reload(), 1500);
                } catch (error) {
                    this.showAlert('error', 'Error', 'El archivo no es un JSON válido');
                }
            };
            reader.readAsText(file);
        }
    },

    /**
     * Limpia todos los datos
     */
    async clearAllData() {
        const confirmed = await this.confirmDialog(
            '¿Eliminar TODOS los datos?',
            'Esta acción eliminará permanentemente todos los estudiantes, rutas, conductores y vehículos. No se puede deshacer.'
        );

        if (confirmed) {
            this.removeFromStorage('students');
            this.removeFromStorage('routes');
            this.removeFromStorage('drivers');
            this.removeFromStorage('vehicles');
            
            this.showAlert('success', 'Datos Eliminados', 'Todos los datos han sido eliminados');
            setTimeout(() => location.reload(), 1500);
        }
    }
};

window.Utils = Utils;

// --- EVENTO: Ver Documentación RESPONSIVO ---
document.addEventListener("DOMContentLoaded", () => {
    const readmeBtn = document.getElementById("readmeBtn");
    if (readmeBtn) {
        readmeBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("README.md");
                const markdownText = await response.text();
                
                // Convierte Markdown a HTML simple
                const htmlFormatted = markdownText
                    .replace(/^### (.*$)/gim, '<h3 style="color:#6366f1; margin-top:1.5rem; margin-bottom:0.75rem; font-size:1.125rem;">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 style="color:#4f46e5; margin-top:2rem; margin-bottom:1rem; font-size:1.5rem;">$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1 style="color:#4338ca; margin-bottom:1.5rem; font-size:1.875rem;">$1</h1>')
                    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#1e293b;">$1</strong>')
                    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                    .replace(/`(.*?)`/gim, '<code style="background:#f1f5f9; padding:0.125rem 0.375rem; border-radius:0.25rem; font-size:0.875rem; color:#6366f1;">$1</code>')
                    .replace(/^- (.*$)/gim, '<li style="margin-left:1.25rem; margin-bottom:0.5rem;">$1</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li style="margin-left:1.25rem; margin-bottom:0.5rem; list-style-type:decimal;">$1</li>')
                    .replace(/\n\n/gim, '<br>');
                
                // Detectar si es móvil
                const isMobile = window.innerWidth < 768;
                
                Swal.fire({
                    title: `<h2 style="color:#6366f1; font-weight:700; margin-bottom:0.75rem; font-size:${isMobile ? '1.25rem' : '1.5rem'};">📘 Documentación del Sistema</h2>`,
                    html: `
                        <div style="
                            text-align:left; 
                            background:#f8fafc; 
                            border-radius:0.75rem; 
                            padding:${isMobile ? '1rem' : '1.5rem'}; 
                            max-height:${isMobile ? '60vh' : '70vh'}; 
                            overflow-y:auto; 
                            box-shadow:inset 0 0 8px rgba(0,0,0,0.08);
                            font-family:'Poppins', 'Segoe UI', sans-serif;
                            color:#1e293b;
                            line-height:1.7;
                            font-size:${isMobile ? '0.875rem' : '1rem'};
                        ">
                            ${htmlFormatted}
                        </div>
                    `,
                    width: isMobile ? '95%' : (window.innerWidth < 1024 ? '85%' : '850px'),
                    showConfirmButton: true,
                    confirmButtonText: '✅ Cerrar',
                    confirmButtonColor: '#6366f1',
                    background: '#ffffff',
                    padding: isMobile ? '1rem' : '1.5rem',
                    customClass: {
                        popup: 'readme-responsive-modal',
                        confirmButton: 'readme-confirm-btn'
                    },
                    didOpen: () => {
                        // Añadir estilos adicionales al contenedor
                        const container = document.querySelector('.readme-responsive-modal .swal2-html-container');
                        if (container) {
                            container.style.fontSize = isMobile ? '0.875rem' : '1rem';
                        }
                    }
                });
            } catch (error) {
                Utils.showAlert('error', 'Error al abrir README', error.message);
            }
        });
    }
});
