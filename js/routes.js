/**
 * GESTIÓN DE RUTAS - MOTOTRANSPORTE SATÉLITE
 * Versión LocalStorage
 */

const Routes = {
    routes: [],
    storageKey: 'routes',
    
    init() {
        this.loadRoutes();
        this.attachEventListeners();
    },

    async loadRoutes() {
        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'GET');
            this.routes = response.data || [];
            this.renderCards();
        } catch (error) {
            this.routes = [];
            this.renderCards();
        } finally {
            Utils.toggleLoading(false);
        }
    },

    attachEventListeners() {
        const addBtn = document.getElementById('addRouteBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showForm());
        }
    },

    async showForm(route = null) {
        const isEdit = route !== null;
        
        const drivers = Drivers.drivers || [];
        const vehicles = Vehicles.vehicles || [];
        
        const driverOptions = drivers.map(d => 
            `<option value="${d.id}" ${route && route.driverId === d.id ? 'selected' : ''}>
                ${d.fullName}
            </option>`
        ).join('');
        
        const vehicleOptions = vehicles.map(v => 
            `<option value="${v.id}" ${route && route.vehicleId === v.id ? 'selected' : ''}>
                ${v.plate} - ${v.brand} ${v.model}
            </option>`
        ).join('');

        const { value: formValues } = await Swal.fire({
            title: isEdit ? '✏️ Editar Ruta' : '➕ Nueva Ruta',
            html: `
                <div style="text-align: left;">
                    <div class="input-group">
                        <label>Nombre de la Ruta *</label>
                        <input id="routeName" class="swal2-input" placeholder="Ej: Ruta Norte" 
                               value="${route ? route.name : ''}">
                    </div>
                    <div class="input-group">
                        <label>Zona *</label>
                        <input id="routeZone" class="swal2-input" placeholder="Ej: Zona Norte, Centro" 
                               value="${route ? route.zone : ''}">
                    </div>
                    <div class="input-group">
                        <label>Hora de Recogida *</label>
                        <input id="routePickup" type="time" class="swal2-input" 
                               value="${route ? route.pickupTime : '07:00'}">
                    </div>
                    <div class="input-group">
                        <label>Hora de Entrega *</label>
                        <input id="routeDropoff" type="time" class="swal2-input" 
                               value="${route ? route.dropoffTime : '08:00'}">
                    </div>
                    <div class="input-group">
                        <label>Conductor</label>
                        <select id="routeDriver" class="swal2-select">
                            <option value="">Sin asignar</option>
                            ${driverOptions}
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Vehículo</label>
                        <select id="routeVehicle" class="swal2-select">
                            <option value="">Sin asignar</option>
                            ${vehicleOptions}
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: isEdit ? 'Actualizar' : 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2563eb',
            width: '600px',
            preConfirm: () => {
                return {
                    name: document.getElementById('routeName').value,
                    zone: document.getElementById('routeZone').value,
                    pickupTime: document.getElementById('routePickup').value,
                    dropoffTime: document.getElementById('routeDropoff').value,
                    driverId: document.getElementById('routeDriver').value,
                    vehicleId: document.getElementById('routeVehicle').value
                };
            }
        });

        if (formValues) {
            if (isEdit) {
                await this.updateRoute(route.id, formValues);
            } else {
                await this.createRoute(formValues);
            }
        }
    },

    async createRoute(data) {
        const validation = Validation.validateRoute(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        try {
            Utils.toggleLoading(true);
            data.id = Utils.generateId();
            data.status = 'active';
            data.createdAt = Utils.getCurrentDateTime();

            const response = await Utils.request(this.storageKey, 'POST', data);
            if (response.success) {
                this.routes.push(data);
                this.renderCards();
                Utils.showToast('success', '✅ Ruta creada exitosamente');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo crear la ruta');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async updateRoute(id, data) {
        const validation = Validation.validateRoute(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        try {
            Utils.toggleLoading(true);
            data.id = id;
            const response = await Utils.request(this.storageKey, 'PUT', data);
            if (response.success) {
                const index = this.routes.findIndex(r => r.id === id);
                if (index !== -1) {
                    this.routes[index] = { ...this.routes[index], ...data };
                    this.renderCards();
                    Utils.showToast('success', '✅ Ruta actualizada');
                }
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo actualizar la ruta');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async deleteRoute(id) {
        const confirmed = await Utils.confirmDialog(
            '¿Eliminar Ruta?',
            'Esta acción no se puede deshacer'
        );

        if (!confirmed) return;

        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'DELETE', id);
            if (response.success) {
                this.routes = this.routes.filter(r => r.id !== id);
                this.renderCards();
                Utils.showToast('success', '✅ Ruta eliminada');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo eliminar la ruta');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    renderCards() {
        const grid = document.getElementById('routesGrid');
        if (!grid) return;

        if (this.routes.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-route"></i>
                    <h3>No hay rutas registradas</h3>
                    <p>Comienza creando la primera ruta</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.routes.map(route => {
            const driver = Drivers.drivers?.find(d => d.id === route.driverId);
            const vehicle = Vehicles.vehicles?.find(v => v.id === route.vehicleId);
            const studentsCount = Students.students?.filter(s => s.routeId === route.id).length || 0;

            return `
                <div class="card animate-fadeIn">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${Utils.sanitize(route.name)}</h3>
                            <p class="card-subtitle">${Utils.sanitize(route.zone)}</p>
                        </div>
                        <span class="card-badge badge-${route.status === 'active' ? 'active' : 'inactive'}">
                            ${route.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="card-info">
                            <div class="info-row">
                                <i class="fas fa-clock"></i>
                                <span>Recogida: <strong>${route.pickupTime}</strong></span>
                            </div>
                            <div class="info-row">
                                <i class="fas fa-clock"></i>
                                <span>Entrega: <strong>${route.dropoffTime}</strong></span>
                            </div>
                            <div class="info-row">
                                <i class="fas fa-user"></i>
                                <span>Conductor: <strong>${driver ? driver.fullName : 'Sin asignar'}</strong></span>
                            </div>
                            <div class="info-row">
                                <i class="fas fa-bus"></i>
                                <span>Vehículo: <strong>${vehicle ? vehicle.plate : 'Sin asignar'}</strong></span>
                            </div>
                            <div class="info-row">
                                <i class="fas fa-user-graduate"></i>
                                <span>Estudiantes: <strong>${studentsCount}</strong></span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-small btn-warning" onclick='Routes.showForm(${JSON.stringify(route).replace(/'/g, "\\'")})'}>
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-small btn-danger" onclick="Routes.deleteRoute('${route.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.updateCount();
    },

    updateCount() {
        const counter = document.getElementById('totalRoutes');
        if (counter) {
            counter.textContent = this.routes.length;
        }
    }
};

window.Routes = Routes;