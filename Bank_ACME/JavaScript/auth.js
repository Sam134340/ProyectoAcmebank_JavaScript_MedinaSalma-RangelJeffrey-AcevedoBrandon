// Módulo de autenticación

const Auth = {
    // Inicializar
    init: () => {
        Auth.setupLoginForm();
        Auth.setupRegisterForm();
        Auth.setupForgotPasswordForm();
        Auth.setupNavigation();
    },

    // Configurar formulario de login
    setupLoginForm: () => {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', Auth.handleLogin);
        }
    },

    // Configurar formulario de registro
    setupRegisterForm: () => {
        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', Auth.handleRegister);
        }

        const cancelBtn = document.getElementById('register-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                Utils.showPage('login-page');
            });
        }
    },

    // Configurar formulario de recuperación
    setupForgotPasswordForm: () => {
        const forgotForm = document.getElementById('forgot-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', Auth.handleForgotPassword);
        }

        const resetForm = document.getElementById('reset-form');
        if (resetForm) {
            resetForm.addEventListener('submit', Auth.handleResetPassword);
        }

        const cancelBtns = document.querySelectorAll('#forgot-cancel, #reset-cancel');
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.showPage('login-page');
            });
        });
    },

    // Configurar navegación
    setupNavigation: () => {
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.showPage('register-page');
            });
        }

        const forgotLink = document.getElementById('forgot-link');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.showPage('forgot-page');
            });
        }
    },

    // Manejar login
    handleLogin: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            idType: {
                required: true,
                requiredMessage: 'Debe seleccionar un tipo de documento'
            },
            idNumber: {
                required: true,
                requiredMessage: 'Debe ingresar el número de documento'
            },
            password: {
                required: true,
                requiredMessage: 'Debe ingresar la contraseña'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Incompletos', validation.errors.join('\n'));
            return;
        }

        // Verificar credenciales
        const users = Utils.getFromStorage('users', []);
        const user = users.find(u => 
            u.idType === formData.get('idType') && 
            u.idNumber === formData.get('idNumber') && 
            u.password === formData.get('password')
        );

        if (user) {
            Utils.saveToStorage('currentUser', user);
            Utils.showToast('Bienvenido a ACME Bank', 'success');
            Utils.showPage('dashboard-page');
            Dashboard.init();
        } else {
            Utils.showError('Acceso Denegado', 'Las credenciales ingresadas no son válidas. Verifique sus datos e intente nuevamente.');
        }
    },

    // Manejar registro
    handleRegister: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            idType: {
                required: true,
                requiredMessage: 'Debe seleccionar un tipo de documento'
            },
            idNumber: {
                required: true,
                requiredMessage: 'Debe ingresar el número de documento'
            },
            firstName: {
                required: true,
                requiredMessage: 'Debe ingresar los nombres'
            },
            lastName: {
                required: true,
                requiredMessage: 'Debe ingresar los apellidos'
            },
            email: {
                required: true,
                email: true,
                requiredMessage: 'Debe ingresar el correo electrónico'
            },
            phone: {
                required: true,
                phone: true,
                requiredMessage: 'Debe ingresar el teléfono'
            },
            gender: {
                required: true,
                requiredMessage: 'Debe seleccionar el género'
            },
            city: {
                required: true,
                requiredMessage: 'Debe ingresar la ciudad'
            },
            address: {
                required: true,
                requiredMessage: 'Debe ingresar la dirección'
            },
            password: {
                required: true,
                password: true,
                requiredMessage: 'Debe ingresar la contraseña'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Incompletos', validation.errors.join('\n'));
            return;
        }

        // Verificar si ya existe
        const users = Utils.getFromStorage('users', []);
        const existingUser = users.find(u => 
            u.idType === formData.get('idType') && 
            u.idNumber === formData.get('idNumber')
        );

        if (existingUser) {
            Utils.showError('Usuario Existente', 'Ya existe una cuenta con este documento de identidad.');
            return;
        }

        const existingEmail = users.find(u => u.email === formData.get('email'));
        if (existingEmail) {
            Utils.showError('Email Existente', 'Ya existe una cuenta con este correo electrónico.');
            return;
        }

        // Crear usuario
        const accountNumber = Utils.generateAccountNumber();
        const createdDate = new Date().toISOString();
        
        const newUser = {
            id: Date.now(),
            idType: formData.get('idType'),
            idNumber: formData.get('idNumber'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            gender: formData.get('gender'),
            city: formData.get('city'),
            address: formData.get('address'),
            password: formData.get('password'),
            accountNumber,
            createdDate,
            balance: 0
        };

        users.push(newUser);
        Utils.saveToStorage('users', users);

        // Mostrar éxito
        const result = await Utils.showSuccess(
            '¡Cuenta Creada!',
            `Su cuenta ha sido creada exitosamente.\n\nNúmero de cuenta: ${accountNumber}\nFecha de creación: ${Utils.formatDate(createdDate)}\n\nYa puede iniciar sesión con sus credenciales.`
        );

        // Limpiar formulario y redirigir
        e.target.reset();
        Utils.showPage('login-page');
    },

    // Manejar recuperación de contraseña
    handleForgotPassword: (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            idType: {
                required: true,
                requiredMessage: 'Debe seleccionar un tipo de documento'
            },
            idNumber: {
                required: true,
                requiredMessage: 'Debe ingresar el número de documento'
            },
            email: {
                required: true,
                email: true,
                requiredMessage: 'Debe ingresar el correo electrónico'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Incompletos', validation.errors.join('\n'));
            return;
        }

        // Verificar datos
        const users = Utils.getFromStorage('users', []);
        const user = users.find(u => 
            u.idType === formData.get('idType') && 
            u.idNumber === formData.get('idNumber') && 
            u.email === formData.get('email')
        );

        if (user) {
            // Guardar temporalmente
            Utils.saveToStorage('resetUser', user);
            
            // Mostrar formulario de nueva contraseña
            document.getElementById('forgot-step-1').style.display = 'none';
            document.getElementById('forgot-step-2').style.display = 'block';
        } else {
            Utils.showError('Datos No Encontrados', 'Los datos ingresados no coinciden con ninguna cuenta registrada.');
        }
    },

    // Manejar cambio de contraseña
    handleResetPassword: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Validar formulario
        const validation = Utils.validateForm(formData, {
            newPassword: {
                required: true,
                password: true,
                requiredMessage: 'Debe ingresar la nueva contraseña'
            },
            confirmPassword: {
                required: true,
                custom: (value) => {
                    if (value !== newPassword) {
                        return 'Las contraseñas no coinciden';
                    }
                    return true;
                },
                requiredMessage: 'Debe confirmar la nueva contraseña'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Incompletos', validation.errors.join('\n'));
            return;
        }

        // Obtener usuario temporal
        const resetUser = Utils.getFromStorage('resetUser');
        if (!resetUser) {
            Utils.showError('Error', 'Sesión expirada. Intente nuevamente.');
            Utils.showPage('login-page');
            return;
        }

        // Actualizar contraseña
        const users = Utils.getFromStorage('users', []);
        const userIndex = users.findIndex(u => u.id === resetUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            Utils.saveToStorage('users', users);
            
            // Limpiar datos temporales
            localStorage.removeItem('resetUser');
            
            // Mostrar éxito
            await Utils.showSuccess(
                'Contraseña Actualizada',
                'Su contraseña ha sido actualizada exitosamente. Ya puede iniciar sesión con su nueva contraseña.'
            );
            
            // Resetear formularios
            document.getElementById('forgot-form').reset();
            document.getElementById('reset-form').reset();
            document.getElementById('forgot-step-1').style.display = 'block';
            document.getElementById('forgot-step-2').style.display = 'none';
            
            Utils.showPage('login-page');
        } else {
            Utils.showError('Error', 'No se pudo actualizar la contraseña. Intente nuevamente.');
        }
    },

    // Cerrar sesión
    logout: async () => {
        const result = await Utils.showConfirmation(
            'Cerrar Sesión',
            '¿Está seguro que desea cerrar sesión?'
        );

        if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            Utils.showToast('Sesión cerrada', 'info');
            Utils.showPage('login-page');
        }
    },

    // Verificar si hay usuario logueado
    isLoggedIn: () => {
        return !!Utils.getFromStorage('currentUser');
    },

    // Obtener usuario actual
    getCurrentUser: () => {
        return Utils.getFromStorage('currentUser');
    }
};
