/**
 * GESTIÓN DE VEHÍCULOS - MOTOTRANSPORTE SATÉLITE
 * Versión LocalStorage
 */

const Vehicles = {
    vehicles: [],
    storageKey: 'vehicles',
    
    init() {
        this.loadVehicles();
        this.attachEventListeners();
    },

    async loadVehicles() {
        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'GET');
            this.vehicles = response.data || [];
            this.renderCards();
        } catch (error) {
            this.vehicles = [];
            this.renderCards();
        } finally {
            Utils.toggleLoading(false);
        }
    },

    attachEventListeners() {
        const addBtn = document.getElementById('addVehicleBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showForm());
        }
    },

    async showForm(vehicle = null) {
        const isEdit = vehicle !== null;

        const { value: formValues } = await Swal.fire({
            title: isEdit ? '✏️ Editar Vehículo' : '➕ Nuevo Vehículo',
            html: `
                <div style="text-align: left;">
                    <div class="input-group">
                        <label>Placa *</label>
                        <input id="vehiclePlate" class="swal2-input" placeholder="Ej: 1234ABC o 5678XYZ" 
                               value="${vehicle ? vehicle.plate : ''}" ${isEdit ? 'disabled' : ''}>
                        <small style="color: #64748b; font-size: 0.75rem;">Formato boliviano: 4 números + 3 letras (También acepta 3 números + 3 letras)</small>
                    </div>
                    <div class="input-group">
                        <label>Marca *</label>
                        <input id="vehicleBrand" class="swal2-input" placeholder="Toyota, Nissan, Hyundai..." 
                               value="${vehicle ? vehicle.brand : ''}">
                    </div>
                    <div class="input-group">
                        <label>Modelo *</label>
                        <input id="vehicleModel" class="swal2-input" placeholder="Hiace, Urvan, H1..." 
                               value="${vehicle ? vehicle.model : ''}">
                    </div>
                    <div class="input-group">
                        <label>Año *</label>
                        <input id="vehicleYear" type="number" class="swal2-input" placeholder="2020" 
                               value="${vehicle ? vehicle.year : ''}" min="1990" max="${new Date().getFullYear() + 1}">
                    </div>
                    <div class="input-group">
                        <label>Capacidad (pasajeros) *</label>
                        <input id="vehicleCapacity" type="number" class="swal2-input" placeholder="15" 
                               value="${vehicle ? vehicle.capacity : ''}" min="1" max="50">
                    </div>
                    <div class="input-group">
                        <label>Color</label>
                        <input id="vehicleColor" class="swal2-input" placeholder="Blanco" 
                               value="${vehicle ? vehicle.color || '' : ''}">
                    </div>
                    <div class="input-group">
                        <label>Estado</label>
                        <select id="vehicleStatus" class="swal2-select">
                            <option value="available" ${vehicle && vehicle.status === 'available' ? 'selected' : ''}>Disponible</option>
                            <option value="maintenance" ${vehicle && vehicle.status === 'maintenance' ? 'selected' : ''}>Mantenimiento</option>
                            <option value="inactive" ${vehicle && vehicle.status === 'inactive' ? 'selected' : ''}>Inactivo</option>
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
                    plate: document.getElementById('vehiclePlate').value,
                    brand: document.getElementById('vehicleBrand').value,
                    model: document.getElementById('vehicleModel').value,
                    year: document.getElementById('vehicleYear').value,
                    capacity: document.getElementById('vehicleCapacity').value,
                    color: document.getElementById('vehicleColor').value,
                    status: document.getElementById('vehicleStatus').value
                };
            }
        });

        if (formValues) {
            if (isEdit) {
                await this.updateVehicle(vehicle.id, formValues);
            } else {
                await this.createVehicle(formValues);
            }
        }
    },

    async createVehicle(data) {
        const validation = Validation.validateVehicle(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        // Verificar placa duplicada
        const exists = this.vehicles.find(v => v.plate === data.plate);
        if (exists) {
            Utils.showAlert('error', 'Placa Duplicada', 'Ya existe un vehículo con esta placa');
            return;
        }

        try {
            Utils.toggleLoading(true);
            data.id = Utils.generateId();
            data.registrationDate = Utils.getCurrentDateTime();

            const response = await Utils.request(this.storageKey, 'POST', data);
            if (response.success) {
                this.vehicles.push(data);
                this.renderCards();
                Utils.showToast('success', '✅ Vehículo registrado exitosamente');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo registrar el vehículo');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async updateVehicle(id, data) {
        const validation = Validation.validateVehicle(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        try {
            Utils.toggleLoading(true);
            data.id = id;
            const response = await Utils.request(this.storageKey, 'PUT', data);
            if (response.success) {
                const index = this.vehicles.findIndex(v => v.id === id);
                if (index !== -1) {
                    this.vehicles[index] = { ...this.vehicles[index], ...data };
                    this.renderCards();
                    Utils.showToast('success', '✅ Vehículo actualizado');
                }
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo actualizar el vehículo');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async deleteVehicle(id) {
        const confirmed = await Utils.confirmDialog(
            '¿Eliminar Vehículo?',
            'Esta acción no se puede deshacer'
        );

        if (!confirmed) return;

        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'DELETE', id);
            if (response.success) {
                this.vehicles = this.vehicles.filter(v => v.id !== id);
                this.renderCards();
                Utils.showToast('success', '✅ Vehículo eliminado');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo eliminar el vehículo');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    renderCards() {
        const grid = document.getElementById('vehiclesGrid');
        if (!grid) return;

        if (this.vehicles.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-bus"></i>
                    <h3>No hay vehículos registrados</h3>
                    <p>Comienza agregando el primer vehículo</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.vehicles.map(vehicle => {
            const statusLabels = {
                available: 'Disponible',
                maintenance: 'Mantenimiento',
                inactive: 'Inactivo'
            };

            const statusClass = vehicle.status === 'available' ? 'available' : 
                                vehicle.status === 'maintenance' ? 'maintenance' : 'inactive';

            return `
                <div class="card animate-fadeIn">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${Utils.sanitize(vehicle.plate)}</h3>
                            <p class="card-subtitle">${Utils.sanitize(vehicle.brand)} ${Utils.sanitize(vehicle.model)}</p>
                        </div>
                        <span class="card-badge badge-${statusClass}">
                            ${statusLabels[vehicle.status]}
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="card-info">
                            <div class="info-row">
                                <i class="fas fa-calendar"></i>
                                <span>Año: <strong>${vehicle.year}</strong></span>
                            </div>
                            <div class="info-row">
                                <i class="fas fa-users"></i>
                                <span>Capacidad: <strong>${vehicle.capacity} pasajeros</strong></span>
                            </div>
                            ${vehicle.color ? `
                            <div class="info-row">
                                <i class="fas fa-palette"></i>
                                <span>Color: <strong>${Utils.sanitize(vehicle.color)}</strong></span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-small btn-warning" onclick='Vehicles.showForm(${JSON.stringify(vehicle).replace(/'/g, "\\'")})'}>
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-small btn-danger" onclick="Vehicles.deleteVehicle('${vehicle.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.updateCount();
    },

    updateCount() {
        const counter = document.getElementById('totalVehicles');
        if (counter) {
            counter.textContent = this.vehicles.length;
        }
    }
};

window.Vehicles = Vehicles;