# ACME Bank 🏦

[![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Sistema bancario** de demostración, ligero y amigable, desarrollado con **HTML**, **CSS** y **JavaScript** puro.

---

## 📋 Tabla de Contenidos

- [📝 Introducción](#-introducción)
- [🚀 Características](#-características)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Instalación y Uso](#️-instalación-y-uso)

---

## 📝 Introducción

Bienvenido a **ACME Bank**, un prototipo de aplicación bancaria web diseñado para gestionar cuentas, transacciones y reportes de manera **interactiva** y **modular**. Ideal para fines educativos y demostraciones de front-end.


## 🚀 Características

- **Registro y Login** de usuarios con validación de formularios.
- **Dashboard** personalizado con resumen de estado de cuenta.
- Gestión de **Transacciones**: depósitos, retiros y transferencias.
- **Reportes** dinámicos en tiempo real.
- Notificaciones tipo **Toast** para feedback instantáneo.
- Interfaz responsive, compatible con dispositivos móviles.


## 📂 Estructura del Proyecto

```bash
ACME Bank/
├── assets/            # Imágenes y logos (SVG, JPG)
├── index.html         # Punto de entrada principal
├── styles.css         # Estilos globales y responsivos
├── script.js          # Lógica de inicialización
├── auth.js            # Módulo de autenticación
├── dashboard.js       # Módulo de dashboard y navegación
├── transactions.js    # Lógica de creación y manejo de transacciones
├── reports.js         # Generación de reportes interactivos
└── utils.js           # Funciones utilitarias (toasts, DOM helpers)
```


## ⚙️ Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/acme-bank.git
   cd acme-bank
   ```

2. **Abrir en el navegador**:
   - Abre `index.html` directamente.
   - O inicia un servidor local ligero:
     ```bash
     # Con Python 3
     python -m http.server 8000

     # Con Node.js (instala "serve" si es necesario)
     npx serve .
     ```
   - Navega a `http://localhost:8000`.

3. **¡Listo!** Regístrate o inicia sesión para explorar todas las funcionalidades.



> Hecho con ❤️ por **Salma Medina** | [LinkedIn](https://www.linkedin.com/in/salma-medina-b8965a375/) • [GitHub](https://github.com/Sam134340)
