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

// --- EVENTO: Ver Documentación con diseño y formato ---
document.addEventListener("DOMContentLoaded", () => {
    const readmeBtn = document.getElementById("readmeBtn");
    if (readmeBtn) {
        readmeBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("README.md");
                const markdownText = await response.text();

                // Convierte Markdown a HTML simple
                const htmlFormatted = markdownText
                    .replace(/^### (.*$)/gim, '<h3 style="color:#2563eb;">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 style="color:#1e40af;">$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1 style="color:#1d4ed8;">$1</h1>')
                    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
                    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
                    .replace(/`(.*?)`/gim, '<code style="background:#e5e7eb; padding:2px 4px; border-radius:4px;">$1</code>')
                    .replace(/\n- (.*)/gim, '<ul style="margin-left:20px;"><li>$1</li></ul>')
                    .replace(/\n\d+\. (.*)/gim, '<ol style="margin-left:20px;"><li>$1</li></ol>')
                    .replace(/\n\n/gim, '<br><br>');

                Swal.fire({
                    title: '<h2 style="color:#2563eb; font-weight:700; margin-bottom:10px;">📘 Documentación del Sistema</h2>',
                    html: `
                        <div style="
                            text-align:left; 
                            background:#f9fafb; 
                            border-radius:12px; 
                            padding:20px; 
                            max-height:450px; 
                            overflow-y:auto; 
                            box-shadow:inset 0 0 6px rgba(0,0,0,0.1);
                            font-family:'Segoe UI', sans-serif;
                            color:#111827;
                            line-height:1.6;
                        ">
                            ${htmlFormatted}
                        </div>
                    `,
                    width: 850,
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                    confirmButtonColor: '#2563eb',
                    background: '#ffffff',
                    scrollbarPadding: false
                });
            } catch (error) {
                Utils.showAlert('error', 'Error al abrir README', error.message);
            }
        });
    }
});
