/**
 * GESTIÓN DE CONDUCTORES - MOTOTRANSPORTE SATÉLITE
 * Versión LocalStorage
 */

const Drivers = {
    drivers: [],
    storageKey: 'drivers',
    
    init() {
        this.loadDrivers();
        this.attachEventListeners();
    },

    async loadDrivers() {
        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'GET');
            this.drivers = response.data || [];
            this.renderTable();
        } catch (error) {
            this.drivers = [];
            this.renderTable();
        } finally {
            Utils.toggleLoading(false);
        }
    },

    attachEventListeners() {
        const addBtn = document.getElementById('addDriverBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showForm());
        }
    },

    async showForm(driver = null) {
        const isEdit = driver !== null;

        const { value: formValues } = await Swal.fire({
            title: isEdit ? '✏️ Editar Conductor' : '➕ Nuevo Conductor',
            html: `
                <div style="text-align: left;">
                    <div class="input-group">
                        <label>CI *</label>
                        <input id="driverCi" class="swal2-input" placeholder="Ej: 12345678-CBBA o 1234567-SC" 
                               value="${driver ? driver.ci : ''}" ${isEdit ? 'disabled' : ''}>
                        <small style="color: #64748b; font-size: 0.75rem;">Extensiones válidas: SC, LP, CBBA, TJA, ORU, PTS, BNI, PND, SCZ</small>
                    </div>
                    <div class="input-group">
                        <label>Nombre Completo *</label>
                        <input id="driverName" class="swal2-input" placeholder="Nombre y Apellido" 
                               value="${driver ? driver.fullName : ''}">
                    </div>
                    <div class="input-group">
                        <label>Teléfono *</label>
                        <input id="driverPhone" class="swal2-input" placeholder="78901234 o 69123456" 
                               value="${driver ? driver.phone : ''}">
                        <small style="color: #64748b; font-size: 0.75rem;">8 dígitos sin espacios (celular o fijo)</small>
                    </div>
                    <div class="input-group">
                        <label>Email</label>
                        <input id="driverEmail" type="email" class="swal2-input" placeholder="conductor@email.com" 
                               value="${driver ? driver.email || '' : ''}">
                    </div>
                    <div class="input-group">
                        <label>Número de Licencia *</label>
                        <input id="driverLicense" class="swal2-input" placeholder="Ej: A-1234567, B-12345678, PROF-1234567" 
                               value="${driver ? driver.license : ''}">
                        <small style="color: #64748b; font-size: 0.75rem;">Categorías: A (Motos), B (Particulares), C (Carga), PROF (Profesional)</small>
                    </div>
                    <div class="input-group">
                        <label>Vencimiento de Licencia *</label>
                        <input id="driverExpiry" type="date" class="swal2-input" 
                               value="${driver ? driver.licenseExpiry : ''}">
                        <small style="color: #64748b; font-size: 0.75rem;">La licencia debe estar vigente (fecha futura)</small>
                    </div>
                    <div class="input-group">
                        <label>Estado</label>
                        <select id="driverStatus" class="swal2-select">
                            <option value="active" ${driver && driver.status === 'active' ? 'selected' : ''}>Activo</option>
                            <option value="inactive" ${driver && driver.status === 'inactive' ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: isEdit ? '✅ Actualizar' : '💾 Guardar',
            cancelButtonText: '❌ Cancelar',
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#64748b',
            width: '600px',
            preConfirm: () => {
                return {
                    ci: document.getElementById('driverCi').value,
                    fullName: document.getElementById('driverName').value,
                    phone: document.getElementById('driverPhone').value,
                    email: document.getElementById('driverEmail').value,
                    license: document.getElementById('driverLicense').value,
                    licenseExpiry: document.getElementById('driverExpiry').value,
                    status: document.getElementById('driverStatus').value
                };
            }
        });

        if (formValues) {
            if (isEdit) {
                await this.updateDriver(driver.id, formValues);
            } else {
                await this.createDriver(formValues);
            }
        }
    },

    async createDriver(data) {
        const validation = Validation.validateDriver(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        // Verificar CI duplicado
        const exists = this.drivers.find(d => d.ci === data.ci);
        if (exists) {
            Utils.showAlert('error', 'CI Duplicada', 'Ya existe un conductor con esta CI');
            return;
        }

        try {
            Utils.toggleLoading(true);
            data.id = Utils.generateId();
            data.hiredDate = Utils.getCurrentDateTime();

            const response = await Utils.request(this.storageKey, 'POST', data);
            if (response.success) {
                this.drivers.push(data);
                this.renderTable();
                Utils.showToast('success', '✅ Conductor registrado exitosamente');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo registrar el conductor');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async updateDriver(id, data) {
        const validation = Validation.validateDriver(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        try {
            Utils.toggleLoading(true);
            data.id = id;
            const response = await Utils.request(this.storageKey, 'PUT', data);
            if (response.success) {
                const index = this.drivers.findIndex(d => d.id === id);
                if (index !== -1) {
                    this.drivers[index] = { ...this.drivers[index], ...data };
                    this.renderTable();
                    Utils.showToast('success', '✅ Conductor actualizado exitosamente');
                }
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo actualizar el conductor');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async deleteDriver(id) {
        const confirmed = await Utils.confirmDialog(
            '¿Eliminar Conductor?',
            'Esta acción no se puede deshacer'
        );

        if (!confirmed) return;

        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'DELETE', id);
            if (response.success) {
                this.drivers = this.drivers.filter(d => d.id !== id);
                this.renderTable();
                Utils.showToast('success', '✅ Conductor eliminado');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo eliminar el conductor');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    renderTable() {
        const tbody = document.getElementById('driversTableBody');
        if (!tbody) return;

        if (this.drivers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-id-card"></i>
                        <h3>No hay conductores registrados</h3>
                        <p>Comienza agregando el primer conductor</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.drivers.map(driver => {
            const statusClass = driver.status === 'active' ? 'active' : 'inactive';
            const statusText = driver.status === 'active' ? 'Activo' : 'Inactivo';

            return `
                <tr class="animate-fadeIn">
                    <td><strong>${Utils.sanitize(driver.ci)}</strong></td>
                    <td>${Utils.sanitize(driver.fullName)}</td>
                    <td>${Utils.sanitize(driver.license)}</td>
                    <td>${Utils.formatPhone(driver.phone)}</td>
                    <td>
                        <span class="status-indicator status-${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <button class="btn btn-small btn-warning" onclick="Drivers.showForm(${JSON.stringify(driver).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="Drivers.deleteDriver('${driver.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.updateCount();
    },

    updateCount() {
        const counter = document.getElementById('totalDrivers');
        if (counter) {
            counter.textContent = this.drivers.length;
        }
    }
};

window.Drivers = Drivers;