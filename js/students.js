/**
 * GESTIÓN DE ESTUDIANTES - MOTOTRANSPORTE SATÉLITE
 * Versión LocalStorage - 100% RESPONSIVO
 */

const Students = {
    students: [],
    storageKey: 'students',
    
    init() {
        this.loadStudents();
        this.attachEventListeners();
    },

    async loadStudents() {
        try {
            Utils.toggleLoading(true);
            const response = await Utils.request(this.storageKey, 'GET');
            this.students = response.data || [];
            this.renderTable();
        } catch (error) {
            console.error('Error cargando estudiantes:', error);
            this.students = [];
            this.renderTable();
        } finally {
            Utils.toggleLoading(false);
        }
    },

    attachEventListeners() {
        const addBtn = document.getElementById('addStudentBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showForm());
        }

        const searchInput = document.getElementById('searchStudent');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.filterStudents(e.target.value);
            }, 300));
        }
    },

    async showForm(student = null) {
        const isEdit = student !== null;
        const isMobile = window.innerWidth < 768;
        
        const routes = Routes.routes || [];
        const routeOptions = routes.map(r => 
            `<option value="${r.id}" ${student && student.routeId === r.id ? 'selected' : ''}>
                ${r.name} - ${r.zone}
            </option>`
        ).join('');

        const { value: formValues } = await Swal.fire({
            title: isEdit ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante',
            html: `
                <div style="text-align: left; max-height: ${isMobile ? '60vh' : '70vh'}; overflow-y: auto; padding: 0.5rem;">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">CI *</label>
                        <input id="studentCi" type="text" 
                               placeholder="Ej: 12345678-CBBA" 
                               value="${student ? student.ci : ''}" 
                               ${isEdit ? 'disabled' : ''}
                               style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                        <small style="color: #64748b; font-size: 0.75rem; display: block; margin-top: 0.25rem;">
                            Formato: 7-8 números + extensión (SC, LP, CBBA, TJA, ORU, PTS, BNI, PND, SCZ)
                        </small>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">Nombre Completo *</label>
                        <input id="studentName" type="text" 
                               placeholder="Nombre y Apellido" 
                               value="${student ? student.fullName : ''}"
                               style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">Fecha de Nacimiento *</label>
                        <input id="studentBirth" type="date" 
                               value="${student ? student.birthDate : ''}"
                               style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">Dirección *</label>
                        <input id="studentAddress" type="text" 
                               placeholder="Dirección completa" 
                               value="${student ? student.address : ''}"
                               style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">Teléfono de Contacto *</label>
                        <input id="studentPhone" type="tel" 
                               placeholder="78901234 o 69123456" 
                               value="${student ? student.phone : ''}"
                               style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                        <small style="color: #64748b; font-size: 0.75rem; display: block; margin-top: 0.25rem;">
                            8 dígitos sin espacios (celular o fijo)
                        </small>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">Email de Padres</label>
                        <input id="studentEmail" type="email" 
                               placeholder="padres@email.com" 
                               value="${student ? student.parentEmail || '' : ''}"
                               style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 0.5rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">Ruta Asignada</label>
                        <select id="studentRoute" 
                                style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 16px; box-sizing: border-box;">
                            <option value="">Sin asignar</option>
                            ${routeOptions}
                        </select>
                    </div>
                </div>
            `,
           width: '100%',
            padding: isMobile ? '1rem' : '1.5rem',
            showCancelButton: true,
            confirmButtonText: isEdit ? '✅ Actualizar' : '💾 Guardar',
            cancelButtonText: '❌ Cancelar',
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#64748b',
            customClass: {
                popup: 'form-modal-responsive',
                confirmButton: 'btn-responsive',
                cancelButton: 'btn-responsive'
            },
            preConfirm: () => {
                return {
                    ci: document.getElementById('studentCi').value.trim(),
                    fullName: document.getElementById('studentName').value.trim(),
                    birthDate: document.getElementById('studentBirth').value,
                    address: document.getElementById('studentAddress').value.trim(),
                    phone: document.getElementById('studentPhone').value.trim(),
                    parentEmail: document.getElementById('studentEmail').value.trim(),
                    routeId: document.getElementById('studentRoute').value
                };
            }
        });

        if (formValues) {
            if (isEdit) {
                await this.updateStudent(student.id, formValues);
            } else {
                await this.createStudent(formValues);
            }
        }
    },

    async createStudent(data) {
        const validation = Validation.validateStudent(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        const exists = this.students.find(s => s.ci === data.ci);
        if (exists) {
            Utils.showAlert('error', 'CI Duplicada', 'Ya existe un estudiante con esta CI');
            return;
        }

        try {
            Utils.toggleLoading(true);
            
            data.id = Utils.generateId();
            data.registrationDate = Utils.getCurrentDateTime();
            data.status = 'active';

            const response = await Utils.request(this.storageKey, 'POST', data);
            
            if (response.success) {
                this.students.push(data);
                this.renderTable();
                Utils.showToast('success', '✅ Estudiante registrado exitosamente');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo registrar el estudiante');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async updateStudent(id, data) {
        const validation = Validation.validateStudent(data);
        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        try {
            Utils.toggleLoading(true);
            
            data.id = id;
            const response = await Utils.request(this.storageKey, 'PUT', data);
            
            if (response.success) {
                const index = this.students.findIndex(s => s.id === id);
                if (index !== -1) {
                    this.students[index] = { ...this.students[index], ...data };
                    this.renderTable();
                    Utils.showToast('success', '✅ Estudiante actualizado exitosamente');
                }
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo actualizar el estudiante');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    async deleteStudent(id) {
        const confirmed = await Utils.confirmDialog(
            '¿Eliminar Estudiante?',
            'Esta acción no se puede deshacer'
        );

        if (!confirmed) return;

        try {
            Utils.toggleLoading(true);
            
            const response = await Utils.request(this.storageKey, 'DELETE', id);
            
            if (response.success) {
                this.students = this.students.filter(s => s.id !== id);
                this.renderTable();
                Utils.showToast('success', '✅ Estudiante eliminado');
            }
        } catch (error) {
            Utils.showAlert('error', 'Error', 'No se pudo eliminar el estudiante');
        } finally {
            Utils.toggleLoading(false);
        }
    },

    filterStudents(searchTerm) {
        const filtered = Utils.filterBySearch(
            this.students,
            searchTerm,
            ['ci', 'fullName', 'address', 'phone']
        );
        this.renderTable(filtered);
    },

    renderTable(students = null) {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;

        const data = students || this.students;

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-user-graduate"></i>
                        <h3>No hay estudiantes registrados</h3>
                        <p>Comienza agregando el primer estudiante</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(student => {
            const age = Utils.calculateAge(student.birthDate);
            const route = Routes.routes?.find(r => r.id === student.routeId);
            const routeName = route ? route.name : 'Sin asignar';

            return `
                <tr class="animate-fadeIn">
                    <td><strong>${Utils.sanitize(student.ci)}</strong></td>
                    <td>${Utils.sanitize(student.fullName)}</td>
                    <td>${age} años</td>
                    <td>${Utils.sanitize(student.address)}</td>
                    <td>${Utils.formatPhone(student.phone)}</td>
                    <td><span class="card-badge badge-${route ? 'active' : 'inactive'}">${routeName}</span></td>
                    <td class="action-buttons">
                        <button class="btn btn-small btn-warning" onclick="Students.showForm(${JSON.stringify(student).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="Students.deleteStudent('${student.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.updateCount();
    },

    updateCount() {
        const counter = document.getElementById('totalStudents');
        if (counter) {
            counter.textContent = this.students.length;
        }
    }
};

window.Students = Students;
