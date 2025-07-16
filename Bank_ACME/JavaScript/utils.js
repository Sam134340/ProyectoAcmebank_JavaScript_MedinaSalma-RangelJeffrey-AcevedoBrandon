// Utilidades para ACME Bank

const Utils = {
    // Generar número de cuenta único
    generateAccountNumber: () => {
        const prefix = '4400';
        const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        return prefix + random;
    },

    // Generar número de referencia para transacciones
    generateReferenceNumber: () => {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return 'REF' + timestamp + random;
    },

    // Formatear moneda
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Formatear fecha
    formatDate: (date) => {
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    },

    // Formatear fecha y hora
    formatDateTime: (date) => {
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Validar email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar teléfono
    validatePhone: (phone) => {
        const re = /^\d{10}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Validar contraseña
    validatePassword: (password) => {
        return password.length >= 6;
    },

    // Mostrar alerta de éxito con SweetAlert2
    showSuccess: (title, message) => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1e40af'
        });
    },

    // Mostrar alerta de error con SweetAlert2
    showError: (title, message) => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1e40af'
        });
    },

    // Mostrar alerta de información
    showInfo: (title, message) => {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1e40af'
        });
    },

    // Mostrar confirmación
    showConfirmation: (title, message) => {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1e40af',
            cancelButtonColor: '#ef4444'
        });
    },

    // Mostrar toast notification
    showToast: (title, icon = 'success') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: icon,
            title: title
        });
    },

    // Validar formulario
    validateForm: (formData, rules) => {
        let isValid = true;
        let errors = [];

        Object.keys(rules).forEach(fieldName => {
            const fieldValue = formData.get(fieldName);
            const rule = rules[fieldName];
            
            // Validar campo requerido
            if (rule.required && (!fieldValue || fieldValue.trim() === '')) {
                isValid = false;
                errors.push(rule.requiredMessage || `El campo ${fieldName} es obligatorio`);
                return;
            }

            if (fieldValue && fieldValue.trim() !== '') {
                // Validar longitud mínima
                if (rule.minLength && fieldValue.length < rule.minLength) {
                    isValid = false;
                    errors.push(rule.minLengthMessage || `${fieldName} debe tener al menos ${rule.minLength} caracteres`);
                    return;
                }

                // Validar email
                if (rule.email && !Utils.validateEmail(fieldValue)) {
                    isValid = false;
                    errors.push(rule.emailMessage || 'Ingrese un email válido');
                    return;
                }

                // Validar teléfono
                if (rule.phone && !Utils.validatePhone(fieldValue)) {
                    isValid = false;
                    errors.push(rule.phoneMessage || 'Ingrese un teléfono válido (10 dígitos)');
                    return;
                }

                // Validar contraseña
                if (rule.password && !Utils.validatePassword(fieldValue)) {
                    isValid = false;
                    errors.push(rule.passwordMessage || 'La contraseña debe tener al menos 6 caracteres');
                    return;
                }

                // Validar función personalizada
                if (rule.custom) {
                    const customResult = rule.custom(fieldValue);
                    if (customResult !== true) {
                        isValid = false;
                        errors.push(customResult);
                        return;
                    }
                }
            }
        });

        return {
            isValid,
            errors
        };
    },

    // Cambiar página
    showPage: (pageId) => {
        // Ocultar todas las páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar la página seleccionada
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    },

    // Obtener datos del localStorage
    getFromStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error al obtener datos del localStorage:', error);
            return defaultValue;
        }
    },

    // Guardar datos en localStorage
    saveToStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error al guardar datos en localStorage:', error);
            return false;
        }
    },

    // Generar años para extractos
    generateYears: () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= currentYear - 10; year--) {
            years.push(year);
        }
        return years;
    },

    // Obtener nombre del mes
    getMonthName: (monthNumber) => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[parseInt(monthNumber) - 1];
    },

    // Imprimir elemento
    printElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Impresión - ACME Bank</title>
                        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                        <style>
                            body {
                                font-family: 'Poppins', sans-serif;
                                margin: 0;
                                padding: 20px;
                                color: #1f2937;
                                line-height: 1.6;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 20px 0;
                            }
                            th, td {
                                border: 1px solid #e5e7eb;
                                padding: 12px;
                                text-align: left;
                            }
                            th {
                                background-color: #1f2937;
                                color: white;
                                font-weight: 600;
                            }
                            .certificate {
                                border: 2px solid #1f2937;
                                padding: 40px;
                                max-width: 800px;
                                margin: 0 auto;
                            }
                            .certificate-header {
                                text-align: center;
                                margin-bottom: 40px;
                                border-bottom: 2px solid #1e40af;
                                padding-bottom: 20px;
                            }
                            .cert-title h1 {
                                color: #1f2937;
                                font-size: 32px;
                                margin-bottom: 10px;
                            }
                            .cert-title p {
                                color: #1e40af;
                                font-size: 16px;
                                font-weight: 600;
                            }
                            .cert-details {
                                background: #f3f4f6;
                                padding: 20px;
                                border-radius: 8px;
                                margin: 20px 0;
                            }
                            .detail-item {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 12px;
                            }
                            .signature-space {
                                width: 200px;
                                height: 2px;
                                background: #1f2937;
                                margin-bottom: 10px;
                            }
                            .logo-image {
                                width: 60px;
                                height: 60px;
                                object-fit: contain;
                            }
                            .logo-container {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        ${element.outerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        }
    },

    // Formatear tipo de documento
    formatDocumentType: (type) => {
        const types = {
            'cedula': 'Cédula de Ciudadanía',
            'cedula-extranjeria': 'Cédula de Extranjería',
            'pasaporte': 'Pasaporte',
            'tarjeta': 'Tarjeta de Identidad'
        };
        return types[type] || type;
    }
};