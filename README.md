# 📦 SISTEMA COMPLETO - MOTOTRANSPORTE SATÉLITE

# 🚐 Sistema de Gestión Mototransporte Satélite

Sistema web profesional para la gestión de transporte escolar local **100% HTML + CSS + JavaScript** - Sin necesidad de servidor ni base de datos.

---

## 📋 Descripción

Sistema completo para **Mototransporte Satélite - Transporte Escolar Local** que permite administrar estudiantes, rutas, conductores y vehículos de manera eficiente, moderna y organizada.

### ✨ Características Principales

- 🎨 **Diseño Moderno** con gradientes y animaciones suaves
- 📱 **100% Responsivo** - Funciona perfectamente en móviles, tablets y desktop
- 💾 **Sin Servidor** - Usa localStorage del navegador
- 🇧🇴 **Validaciones Bolivianas** - CI (hasta 4 caracteres), placas, licencias
- 🔒 **Seguro** - Sanitización y validación de datos
- ⚡ **Rápido** - Carga instantánea y operaciones en tiempo real
- 📤 **Exportar/Importar** - Backup completo de datos en JSON

---

## 🎯 Requerimientos Funcionales

### RF001 - Gestión de Estudiantes
- ✅ Registrar estudiantes con información completa (CI, nombre, fecha nacimiento, dirección)
- ✅ Editar datos existentes
- ✅ Eliminar registros con confirmación
- ✅ Búsqueda en tiempo real por nombre, CI o dirección
- ✅ Asignación automática a rutas
- ✅ Validación de edad (3-18 años)

### RF002 - Gestión de Rutas
- ✅ Crear rutas con horarios específicos
- ✅ Definir zonas de recogida y entrega
- ✅ Asignar conductor y vehículo
- ✅ Visualizar cantidad de estudiantes por ruta
- ✅ Estado activo/inactivo

### RF003 - Gestión de Conductores
- ✅ Registro con licencia profesional boliviana
- ✅ Control de vencimiento de licencias
- ✅ Alertas de renovación (30 días antes)
- ✅ Estado activo/inactivo
- ✅ Historial de contratación

### RF004 - Gestión de Vehículos
- ✅ Registro con placa boliviana (formato 1234ABC)
- ✅ Control de capacidad y ocupación
- ✅ Estados: Disponible, Mantenimiento, Inactivo
- ✅ Asignación a rutas específicas

### RF005 - Validaciones Bolivianas
- ✅ **CI:** 7-8 dígitos + extensión (SC, LP, CBBA, TJA, ORU, PTS, BNI, PND, SCZ)
- ✅ **Licencia:** A-1234567, B-12345678, PROF-1234567
- ✅ **Placa:** 1234ABC o 123ABC (formatos actual y antiguo)
- ✅ **Teléfono:** 8 dígitos (78901234)
- ✅ Prevención de duplicados

### RF006 - Dashboard y Reportes
- ✅ Estadísticas en tiempo real
- ✅ Notificaciones inteligentes
- ✅ Exportación de datos a JSON
- ✅ Importación desde backup

---

## 🔧 Requerimientos No Funcionales

### RNF001 - Usabilidad
- 🎯 Interfaz intuitiva tipo "Material Design"
- 📖 Botón de documentación integrado
- 💬 Mensajes claros con SweetAlert2
- 🎨 Paleta de colores moderna (púrpura/violeta)

### RNF002 - Performance
- ⚡ Carga instantánea (< 1 segundo)
- 🚀 Operaciones CRUD inmediatas
- 🎭 Animaciones fluidas 60fps
- 📦 Código optimizado y modular

### RNF003 - Seguridad
- 🔒 Sanitización de entradas (XSS prevention)
- ✅ Validación doble (cliente)
- 🛡️ Datos seguros en localStorage

### RNF004 - Compatibilidad
- ✅ Chrome/Edge (100%)
- ✅ Firefox (100%)
- ✅ Safari (100%)
- ✅ Opera (100%)
- 📱 iOS Safari y Chrome Mobile

### RNF005 - Escalabilidad
- 📈 Soporta cientos de registros
- 🔄 Fácil migración a Firebase/Supabase
- 🧩 Código modular y reutilizable

---

## 📁 Estructura del Proyecto

```
Mototransporte-Satelite/
│
├── index.html                    # 🏠 Página principal
├── README.md                     # 📖 Esta documentación
│
├── img/
│   └── grupo.jpeg               # 👥 Foto del equipo
│
├── css/
│   ├── styles.css               # 🎨 Estilos principales y variables
│   ├── components.css           # 🧩 Tarjetas, tablas, modales
│   ├── responsive.css           # 📱 Media queries móvil/tablet
│   └── animations.css           # ✨ Efectos y transiciones
│
└── js/
    ├── main.js                  # 🚀 Inicialización y navegación
    ├── utils.js                 # 🛠️ Funciones utilitarias (localStorage)
    ├── validation.js            # ✅ Validaciones bolivianas
    ├── students.js              # 👨‍🎓 CRUD de estudiantes
    ├── routes.js                # 🚌 CRUD de rutas
    ├── drivers.js               # 👨‍✈️ CRUD de conductores
    └── vehicles.js              # 🚐 CRUD de vehículos
```

---

## 🚀 Instalación y Uso

### ✅ **Método 1: Abrir Directamente (Más Fácil)**

1. Descarga todos los archivos del proyecto
2. Mantén la estructura de carpetas intacta
3. Haz **doble clic** en `index.html`
4. ¡Listo! El sistema funciona inmediatamente

### 💻 **Método 2: Live Server en VS Code (Recomendado)**

1. Abre la carpeta del proyecto en **Visual Studio Code**
2. Instala la extensión **"Live Server"**
3. Click derecho en `index.html` → **"Open with Live Server"**
4. Se abrirá automáticamente en `http://127.0.0.1:5500`

### 🌐 **Método 3: GitHub Pages (Hosting Gratuito)**

1. Sube el proyecto a tu repositorio de GitHub
2. Ve a **Settings** → **Pages**
3. Selecciona la rama **main** como fuente
4. Tu sitio estará disponible en: `https://tu-usuario.github.io/mototransporte-satelite`

### 🐍 **Método 4: Servidor Local Simple**

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server -p 8000

# Abrir navegador en:
http://localhost:8000
```

---

## 💾 Almacenamiento de Datos

### **¿Dónde se guardan los datos?**

Los datos se almacenan en el **localStorage** de tu navegador web:

- ✅ Se guardan automáticamente en tu computadora
- ✅ Persisten al cerrar y reabrir el navegador
- ✅ Capacidad: ~5-10MB (suficiente para cientos de registros)
- ⚠️ Datos locales por navegador/dispositivo
- ⚠️ Se pierden si limpias el caché del navegador

### **Backup y Restauración**

El sistema incluye funciones integradas:

- 📥 **Exportar:** Click en el botón ⬇️ del header para descargar backup en JSON
- 📤 **Importar:** Click en el botón ⬆️ del header para restaurar desde JSON
- 💡 **Recomendación:** Realiza backups periódicos

---

## 🎨 Características Destacadas

- ✨ **SweetAlert2** - Notificaciones elegantes y modernas
- 📱 **Diseño Responsivo** - Adaptado a móviles, tablets y desktop
- 🎯 **Validaciones Completas** - Formato boliviano (CI, placas, licencias)
- 🎨 **Interfaz Moderna** - Gradientes púrpura/violeta, sombras 3D
- 💾 **Sin Base de Datos** - Todo en localStorage
- 🔒 **Seguro** - Sanitización y prevención XSS
- 📊 **Dashboard Interactivo** - Estadísticas en tiempo real
- 🎭 **Animaciones Suaves** - Transiciones de 300ms
- 📖 **Documentación Integrada** - Botón de ayuda en el header

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript ES6+ (Vanilla JS, sin frameworks)

### **Librerías**
- [SweetAlert2](https://sweetalert2.github.io/) - Modales y alertas
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts (Poppins)](https://fonts.google.com/) - Tipografía

### **Almacenamiento**
- LocalStorage API (Navegador)

### **Sin Backend**
- ❌ No requiere PHP, Node.js, Python
- ❌ No requiere servidor web
- ❌ No requiere base de datos

---

## 📱 Compatibilidad y Responsividad

### **Navegadores Soportados**
- ✅ Google Chrome (v90+)
- ✅ Microsoft Edge (v90+)
- ✅ Mozilla Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)
- ✅ Navegadores móviles (iOS Safari, Chrome Mobile)

### **Resoluciones**
- 📱 **Móvil:** < 768px (diseño vertical optimizado)
- 📱 **Tablet:** 768px - 1023px (2 columnas)
- 💻 **Desktop:** 1024px - 1919px (3-4 columnas)
- 🖥️ **Large Desktop:** ≥ 1920px (4+ columnas)

---

## 🔐 Seguridad

### **Medidas Implementadas**

- ✅ **Sanitización de entradas** - Prevención de XSS
- ✅ **Validación doble** - Cliente (JavaScript)
- ✅ **Prevención de duplicados** - CI, placas, licencias únicas
- ✅ **Confirmación de eliminación** - Evita borrado accidental
- ✅ **Datos locales** - No se envían a servidores externos

### **Limitaciones**

- ⚠️ Los datos están en el navegador del usuario
- ⚠️ No hay autenticación de usuarios
- ⚠️ No hay encriptación de datos en localStorage
- 💡 **Para producción:** Considera migrar a Firebase o Supabase

---

## 🐛 Solución de Problemas

### **Los datos no se guardan**
- Verifica que el navegador permita localStorage
- Desactiva modo incógnito/privado
- Verifica espacio disponible del navegador

### **SweetAlert2 no carga**
- Verifica conexión a internet (usa CDN)
- Abre la consola (F12) y busca errores

### **La imagen del grupo no aparece**
- Verifica que existe `img/grupo.jpeg`
- Verifica la ruta relativa `./img/grupo.jpeg`

### **El sistema no funciona**
- Abre la consola del navegador (F12)
- Verifica errores en rojo
- Asegúrate de que todos los archivos estén en su lugar

---

## 📈 Futuras Mejoras

- [ ] 🔔 Sistema de notificaciones por email/SMS
- [ ] 📍 Integración con GPS para tracking en tiempo real
- [ ] 📱 Progressive Web App (PWA) - Instalable en móvil
- [ ] 💳 Sistema de pagos en línea
- [ ] 👨‍👩‍👧 Panel para padres de familia
- [ ] 📄 Reportes en PDF
- [ ] ☁️ Migración a Firebase/Supabase para datos compartidos
- [ ] 🌙 Modo oscuro
- [ ] 🌐 Múltiples idiomas (ES/EN)

---

## 📄 Licencia

© 2025 Mototransporte Satélite. Todos los derechos reservados.

Este proyecto es de uso educativo y comercial para Mototransporte Satélite.

---

## 📞 Contacto y Soporte

Para consultas, soporte técnico o información:

- 📧 **Email:** soporte@mototransportesatelite.com
- 📱 **Teléfono:** +591 XXX-XXXXX
- 📍 **Ubicación:** Warnes, Santa Cruz, Bolivia

**Horarios de Atención:**
- Lunes a Viernes: 7:00 AM - 6:00 PM
- Sábados: 7:00 AM - 12:00 PM

---

## 🙏 Agradecimientos

Este proyecto no sería posible sin:

- 💙 **SweetAlert2** - Por las hermosas alertas
- 🌐 **La comunidad de código abierto**
- 👥 **Todos los usuarios del sistema**
- 🎓 **Estudiantes y familias que confían en nosotros**

---

### 📸 Nuestro Equipo

![Foto del Grupo](./img/grupo.jpeg)

---

<div align="center">

**Desarrollado con ❤️ para Mototransporte Satélite**

🚐 **Transporte Escolar Local de Confianza** 🚐

---
</div>
