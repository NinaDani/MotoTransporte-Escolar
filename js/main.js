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
     * Configura el botón README con modal RESPONSIVO TOTAL
     */
    setupReadmeButton() {
        const readmeBtn = document.getElementById("readmeBtn");
        if (!readmeBtn) return;
        
        readmeBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("README.md");
                const markdownText = await response.text();
                
                // Detectar dispositivo
                const isMobile = window.innerWidth < 768;
                const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
                
                // Convertir Markdown a HTML
                let html = markdownText
                    // Bloques de código
                    .replace(/```([\s\S]*?)```/gim, (match, code) => {
                        return `<pre style="background:#1e293b; color:#e2e8f0; padding:${isMobile ? '0.75rem' : '1rem'}; border-radius:0.5rem; overflow-x:auto; font-size:${isMobile ? '0.75rem' : '0.875rem'}; line-height:1.6; margin:1rem 0; white-space:pre-wrap; word-wrap:break-word;"><code>${code.trim()}</code></pre>`;
                    })
                    // Imágenes Markdown ![alt](url)
                    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, 
                        `<img src="$2" alt="$1" style="max-width:100%; height:auto; border-radius:0.75rem; margin:1rem auto; display:block; box-shadow:0 4px 12px rgba(0,0,0,0.15);" />`)
                    // Imágenes HTML
                    .replace(/<img\s+src="([^"]+)"\s+alt="([^"]*)"\s+width="(\d+)"\s*\/?>/gim,
                        `<img src="$1" alt="$2" style="max-width:100%; height:auto; border-radius:0.75rem; margin:1rem auto; display:block; box-shadow:0 4px 12px rgba(0,0,0,0.15);" />`)
                    // Títulos
                    .replace(/^### (.*$)/gim, `<h3 style="color:#6366f1; margin-top:${isMobile ? '1rem' : '1.5rem'}; margin-bottom:0.75rem; font-size:${isMobile ? '1rem' : '1.125rem'}; font-weight:600;">$1</h3>`)
                    .replace(/^## (.*$)/gim, `<h2 style="color:#4f46e5; margin-top:${isMobile ? '1.5rem' : '2rem'}; margin-bottom:1rem; font-size:${isMobile ? '1.125rem' : '1.5rem'}; font-weight:700;">$1</h2>`)
                    .replace(/^# (.*$)/gim, `<h1 style="color:#4338ca; margin-bottom:1.5rem; font-size:${isMobile ? '1.25rem' : '1.875rem'}; font-weight:700;">$1</h1>`)
                    // Negritas y cursivas
                    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#1e293b; font-weight:600;">$1</strong>')
                    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                    // Código inline
                    .replace(/`([^`]+)`/gim, `<code style="background:#f1f5f9; padding:0.125rem 0.375rem; border-radius:0.25rem; font-size:${isMobile ? '0.8rem' : '0.875rem'}; color:#6366f1; font-family:monospace;">$1</code>`)
                    // Listas
                    .replace(/^- (.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; list-style-type:disc;">$1</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; list-style-type:decimal;">$1</li>')
                    // Líneas horizontales
                    .replace(/^---$/gim, '<hr style="border:none; border-top:2px solid #e2e8f0; margin:2rem 0;" />')
                    // Saltos de línea
                    .replace(/\n\n/gim, '<br>');
                
                // CONFIGURACIÓN RESPONSIVA
                let width = '90vw';
                let maxWidth = '900px';
                let padding = '1.5rem';
                let maxHeight = '70vh';
                let fontSize = '1rem';
                let titleSize = '1.5rem';
                
                if (isMobile) {
                    width = 'calc(100vw - 1rem)';
                    maxWidth = 'calc(100vw - 1rem)';
                    padding = '1rem';
                    maxHeight = '60vh';
                    fontSize = '0.875rem';
                    titleSize = '1.125rem';
                } else if (isTablet) {
                    width = '85vw';
                    maxWidth = '85vw';
                    padding = '1.25rem';
                    maxHeight = '65vh';
                }
                
                Swal.fire({
                    title: `<h2 style="color:#6366f1; font-weight:700; margin:0; font-size:${titleSize};">📘 Documentación del Sistema</h2>`,
                    html: `
                        <div style="
                            text-align:left; 
                            background:#f8fafc; 
                            border-radius:0.75rem; 
                            padding:${padding}; 
                            max-height:${maxHeight}; 
                            overflow-y:auto; 
                            overflow-x:hidden;
                            box-shadow:inset 0 0 8px rgba(0,0,0,0.08);
                            font-family:'Poppins', sans-serif;
                            color:#1e293b;
                            line-height:1.7;
                            font-size:${fontSize};
                            word-wrap:break-word;
                            box-sizing:border-box;
                        ">
                            ${html}
                        </div>
                    `,
                    width: width,
                    padding: padding,
                    showConfirmButton: true,
                    confirmButtonText: '✅ Cerrar',
                    confirmButtonColor: '#6366f1',
                    background: '#ffffff',
                    allowOutsideClick: true,
                    customClass: {
                        popup: 'readme-responsive-modal',
                        container: 'swal2-container-custom',
                        confirmButton: 'btn-responsive'
                    },
                    didOpen: () => {
                        // Forzar posición correcta
                        const popup = Swal.getPopup();
                        if (popup) {
                            popup.style.maxWidth = maxWidth;
                            popup.style.margin = '0.5rem auto';
                            popup.style.position = 'relative';
                            popup.style.left = 'auto';
                            popup.style.right = 'auto';
                            popup.style.transform = 'none';
                        }
                        
                        // Prevenir scroll horizontal
                        document.body.style.overflowX = 'hidden';
                        document.documentElement.style.overflowX = 'hidden';
                    },
                    willClose: () => {
                        // Restaurar scroll
                        document.body.style.overflowX = '';
                        document.documentElement.style.overflowX = '';
                    }
                });
                
            } catch (error) {
                console.error('Error al cargar README:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el archivo README.md',
                    confirmButtonColor: '#6366f1',
                    customClass: {
                        popup: 'form-modal-responsive'
                    }
                });
            }
        });
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
