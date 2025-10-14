/**
 * ARCHIVO PRINCIPAL - MOTOTRANSPORTE SATÉLITE
 * Inicialización y control general del sistema
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema
    App.init();
});

const App = {
    currentSection: 'dashboard',

    /**
     * Inicializa la aplicación
     */
    init() {
        console.log('🚐 Inicializando Mototransporte Satélite...');
        
        // Inicializar módulos
        this.initModules();
        
        // Configurar navegación
        this.setupNavigation();
        
        // Configurar menú móvil
        this.setupMobileMenu();
        
        // Configurar botón README
        this.setupReadmeButton();
        
        // Ocultar loading
        setTimeout(() => {
            Utils.toggleLoading(false);
        }, 500);
        
        console.log('✅ Sistema inicializado correctamente');
    },

    /**
     * Inicializa todos los módulos
     */
    initModules() {
        // Inicializar módulos en orden
        Students.init();
        Routes.init();
        Drivers.init();
        Vehicles.init();
        
        // Actualizar dashboard después de cargar datos
        setTimeout(() => {
            this.updateDashboard();
        }, 1000);
    },

    /**
     * Configura la navegación entre secciones
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const sectionId = link.getAttribute('data-section');
                this.showSection(sectionId);
                
                // Actualizar active en navegación
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Cerrar menú móvil si está abierto
                this.closeMobileMenu();
            });
        });
    },

    /**
     * Muestra una sección específica
     */
    showSection(sectionId) {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    /**
     * Configura el menú móvil
     */
    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mainNav.classList.toggle('active');
            });
            
            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    },

    /**
     * Cierra el menú móvil
     */
    closeMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        
        if (menuToggle && mainNav) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    },

    /**
     * Actualiza el dashboard con estadísticas
     */
    updateDashboard() {
        // Actualizar contadores
        const totalStudents = Students.students.length;
        const totalRoutes = Routes.routes.length;
        const totalDrivers = Drivers.drivers.length;
        const totalVehicles = Vehicles.vehicles.length;
        
        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('totalRoutes').textContent = totalRoutes;
        document.getElementById('totalDrivers').textContent = totalDrivers;
        document.getElementById('totalVehicles').textContent = totalVehicles;
        
        // Actualizar notificaciones
        this.updateNotifications();
    },

    /**
     * Actualiza las notificaciones del dashboard
     */
    updateNotifications() {
        const notificationsContainer = document.getElementById('notifications');
        if (!notificationsContainer) return;
        
        const notifications = [];
        
        // Verificar licencias próximas a vencer
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        Drivers.drivers.forEach(driver => {
            const expiryDate = new Date(driver.licenseExpiry);
            if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
                notifications.push({
                    type: 'warning',
                    icon: 'fa-exclamation-triangle',
                    message: `La licencia del conductor ${driver.fullName} vence pronto`,
                    time: 'Próximo vencimiento'
                });
            }
        });
        
        // Verificar vehículos en mantenimiento
        const maintenanceVehicles = Vehicles.vehicles.filter(v => v.status === 'maintenance');
        if (maintenanceVehicles.length > 0) {
            notifications.push({
                type: 'info',
                icon: 'fa-tools',
                message: `${maintenanceVehicles.length} vehículo(s) en mantenimiento`,
                time: 'Estado actual'
            });
        }
        
        // Verificar rutas sin asignar conductor o vehículo
        const incompleteRoutes = Routes.routes.filter(r => !r.driverId || !r.vehicleId);
        if (incompleteRoutes.length > 0) {
            notifications.push({
                type: 'warning',
                icon: 'fa-route',
                message: `${incompleteRoutes.length} ruta(s) sin conductor o vehículo asignado`,
                time: 'Requiere atención'
            });
        }
        
        // Mensaje de bienvenida si no hay notificaciones
        if (notifications.length === 0) {
            notifications.push({
                type: 'success',
                icon: 'fa-check-circle',
                message: 'Todo está en orden, no hay notificaciones pendientes',
                time: 'Actualizado'
            });
        }
        
        // Renderizar notificaciones
        notificationsContainer.innerHTML = notifications.map(notif => {
            const iconClass = notif.type === 'warning' ? 'warning-color' : 
                            notif.type === 'error' ? 'error-color' : 
                            notif.type === 'success' ? 'success-color' : 'info-color';
            
            return `
                <div class="notification-item animate-fadeInLeft">
                    <i class="fas ${notif.icon}" style="color: var(--${iconClass})"></i>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
            `;
        }).join('');
    },

    /**
     * Busca en todas las secciones
     */
    globalSearch(term) {
        const results = {
            students: Students.students.filter(s => 
                s.fullName.toLowerCase().includes(term.toLowerCase()) ||
                s.ci.toLowerCase().includes(term.toLowerCase())
            ),
            routes: Routes.routes.filter(r => 
                r.name.toLowerCase().includes(term.toLowerCase()) ||
                r.zone.toLowerCase().includes(term.toLowerCase())
            ),
            drivers: Drivers.drivers.filter(d => 
                d.fullName.toLowerCase().includes(term.toLowerCase()) ||
                d.ci.toLowerCase().includes(term.toLowerCase())
            ),
            vehicles: Vehicles.vehicles.filter(v => 
                v.plate.toLowerCase().includes(term.toLowerCase()) ||
                v.brand.toLowerCase().includes(term.toLowerCase())
            )
        };
        
        return results;
    },

    /**
     * Exporta datos a JSON
     */
    exportData() {
        const data = {
            exportDate: new Date().toISOString(),
            students: Students.students,
            routes: Routes.routes,
            drivers: Drivers.drivers,
            vehicles: Vehicles.vehicles
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `mototransporte_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        Utils.showToast('success', 'Datos exportados correctamente');
    }
};

// Funciones de utilidad del documento
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = 'var(--shadow-lg)';
    }
});

// Prevenir cierre accidental
window.addEventListener('beforeunload', (e) => {
    const hasData = Students.students.length > 0 || 
                   Routes.routes.length > 0 || 
                   Drivers.drivers.length > 0 || 
                   Vehicles.vehicles.length > 0;
    
    if (hasData) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Exportar para uso global
window.App = App;