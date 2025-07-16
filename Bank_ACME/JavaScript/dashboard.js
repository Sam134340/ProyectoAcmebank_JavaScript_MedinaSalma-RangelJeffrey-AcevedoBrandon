// Módulo del dashboard

const Dashboard = {
    currentUser: null,

    // Inicializar dashboard
    init: () => {
        Dashboard.currentUser = Auth.getCurrentUser();
        if (!Dashboard.currentUser) {
            Utils.showPage('login-page');
            return;
        }

        Dashboard.setupNavigation();
        Dashboard.setupLogout();
        Dashboard.setupUserProfile();
        Dashboard.setupMobileMenu();
        Dashboard.loadUserData();
        Dashboard.showSection('dashboard');
    },

    // Configurar navegación
    setupNavigation: () => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                Dashboard.showSection(section);
                
                // Actualizar navegación activa
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    // Configurar logout
    setupLogout: () => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', Auth.logout);
        }
    },

    // Configurar menú móvil
    setupMobileMenu: () => {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (mobileMenuToggle && sidebar && sidebarOverlay) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-visible');
                sidebarOverlay.classList.toggle('active');
            });

            // Cerrar menú con clic
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-visible');
                sidebarOverlay.classList.remove('active');
            });

            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('mobile-visible');
                        sidebarOverlay.classList.remove('active');
                    }
                });
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove('mobile-visible');
                    sidebarOverlay.classList.remove('active');
                }
            });
        }
    },

    // Configurar perfil de usuario
    setupUserProfile: () => {
        const userNameElement = document.getElementById('user-name-header');
        if (userNameElement) {
            userNameElement.textContent = `${Dashboard.currentUser.firstName} ${Dashboard.currentUser.lastName}`;
            
            // Hacer clickeable para ir al perfil
            const userProfile = document.querySelector('.user-profile');
            if (userProfile) {
                userProfile.addEventListener('click', () => {
                    Dashboard.showSection('profile');
                    
                    // Actualizar navegación activa
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    document.querySelector('.nav-item[data-section="profile"]').classList.add('active');
                });
            }
        }
    },

    // Cargar datos del usuario
    loadUserData: () => {
        // Actualizar saldo del usuario desde localStorage
        const users = Utils.getFromStorage('users', []);
        const updatedUser = users.find(u => u.id === Dashboard.currentUser.id);
        if (updatedUser) {
            Dashboard.currentUser = updatedUser;
            Utils.saveToStorage('currentUser', updatedUser);
        }

        // Actualizar elementos del dashboard
        const balanceDisplay = document.getElementById('balance-display');
        if (balanceDisplay) {
            balanceDisplay.textContent = Utils.formatCurrency(Dashboard.currentUser.balance);
        }

        const accountNumberDisplay = document.getElementById('account-number-display');
        if (accountNumberDisplay) {
            accountNumberDisplay.textContent = Dashboard.currentUser.accountNumber;
        }

        const accountHolderDisplay = document.getElementById('account-holder-display');
        if (accountHolderDisplay) {
            accountHolderDisplay.textContent = `${Dashboard.currentUser.firstName} ${Dashboard.currentUser.lastName}`;
        }

        const accountCreatedDisplay = document.getElementById('account-created-display');
        if (accountCreatedDisplay) {
            accountCreatedDisplay.textContent = Utils.formatDate(Dashboard.currentUser.createdDate);
        }

        // Actualizar todas las secciones con información del usuario
        Dashboard.updateAllSections();
    },

    // Actualizar todas las secciones
    updateAllSections: () => {
        const fullName = `${Dashboard.currentUser.firstName} ${Dashboard.currentUser.lastName}`;
        const accountNumber = Dashboard.currentUser.accountNumber;
        const balance = Utils.formatCurrency(Dashboard.currentUser.balance);

        // Actualizar sección de depósitos
        const depositAccountNumber = document.getElementById('deposit-account-number');
        const depositAccountHolder = document.getElementById('deposit-account-holder');
        if (depositAccountNumber) depositAccountNumber.textContent = accountNumber;
        if (depositAccountHolder) depositAccountHolder.textContent = fullName;

        // Actualizar sección de retiros
        const withdrawAccountNumber = document.getElementById('withdraw-account-number');
        const withdrawAccountHolder = document.getElementById('withdraw-account-holder');
        const withdrawBalance = document.getElementById('withdraw-balance');
        if (withdrawAccountNumber) withdrawAccountNumber.textContent = accountNumber;
        if (withdrawAccountHolder) withdrawAccountHolder.textContent = fullName;
        if (withdrawBalance) withdrawBalance.textContent = balance;

        // Actualizar sección de pagos
        const paymentsAccountNumber = document.getElementById('payments-account-number');
        const paymentsAccountHolder = document.getElementById('payments-account-holder');
        if (paymentsAccountNumber) paymentsAccountNumber.textContent = accountNumber;
        if (paymentsAccountHolder) paymentsAccountHolder.textContent = fullName;

        // Actualizar sección de extractos
        const statementsAccountNumber = document.getElementById('statements-account-number');
        const statementsAccountHolder = document.getElementById('statements-account-holder');
        if (statementsAccountNumber) statementsAccountNumber.textContent = accountNumber;
        if (statementsAccountHolder) statementsAccountHolder.textContent = fullName;

        // Actualizar perfil
        Dashboard.updateProfileSection();
    },

    // Actualizar sección de perfil
    updateProfileSection: () => {
        const user = Dashboard.currentUser;
        
        // Información principal
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
        if (profileEmail) profileEmail.textContent = user.email;

        // Detalles personales
        const profileIdType = document.getElementById('profile-id-type');
        const profileIdNumber = document.getElementById('profile-id-number');
        const profilePhone = document.getElementById('profile-phone');
        const profileGender = document.getElementById('profile-gender');
        const profileCity = document.getElementById('profile-city');
        const profileAddress = document.getElementById('profile-address');
        
        if (profileIdType) profileIdType.textContent = Utils.formatDocumentType(user.idType);
        if (profileIdNumber) profileIdNumber.textContent = user.idNumber;
        if (profilePhone) profilePhone.textContent = user.phone;
        if (profileGender) profileGender.textContent = user.gender;
        if (profileCity) profileCity.textContent = user.city;
        if (profileAddress) profileAddress.textContent = user.address;

        // Información de cuenta
        const profileAccountNumber = document.getElementById('profile-account-number');
        const profileBalance = document.getElementById('profile-balance');
        const profileCreatedDate = document.getElementById('profile-created-date');
        
        if (profileAccountNumber) profileAccountNumber.textContent = user.accountNumber;
        if (profileBalance) profileBalance.textContent = Utils.formatCurrency(user.balance);
        if (profileCreatedDate) profileCreatedDate.textContent = Utils.formatDate(user.createdDate);
    },

    // Mostrar sección
    showSection: (sectionName) => {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Inicializar funcionalidad específica de la sección
        switch (sectionName) {
            case 'dashboard':
                Dashboard.loadRecentTransactions();
                break;
            case 'transactions':
                Transactions.loadAllTransactions();
                Transactions.setupTransactionsTable();
                break;
            case 'deposit':
                Transactions.setupDepositForm();
                break;
            case 'withdraw':
                Transactions.setupWithdrawForm();
                break;
            case 'payments':
                Transactions.setupPaymentsForm();
                break;
            case 'statements':
                Reports.setupStatementsForm();
                break;
            case 'certificate':
                Reports.setupCertificate();
                break;
            case 'profile':
                Dashboard.updateProfileSection();
                break;
        }
    },

    // Cargar transacciones recientes para el dashboard
    loadRecentTransactions: () => {
        const transactions = Utils.getFromStorage('transactions', []);
        const userTransactions = transactions
            .filter(t => t.userId === Dashboard.currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5); // Últimas 5 transacciones

        const tbody = document.getElementById('recent-transactions-tbody');
        if (tbody) {
            if (userTransactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="no-data">No hay transacciones registradas</td></tr>';
            } else {
                tbody.innerHTML = userTransactions.map(transaction => `
                    <tr>
                        <td>${Utils.formatDate(transaction.date)}</td>
                        <td>${transaction.reference}</td>
                        <td>${transaction.type}</td>
                        <td>${transaction.description}</td>
                        <td style="color: ${transaction.type === 'Depósito' ? '#10b981' : '#ef4444'}">
                            ${transaction.type === 'Depósito' ? '+' : '-'}${Utils.formatCurrency(transaction.amount)}
                        </td>
                    </tr>
                `).join('');
            }
        }
    },

    // Actualizar saldo del usuario
    updateUserBalance: (newBalance) => {
        // Actualizar usuario actual
        Dashboard.currentUser.balance = newBalance;
        Utils.saveToStorage('currentUser', Dashboard.currentUser);

        // Actualizar en la lista de usuarios
        const users = Utils.getFromStorage('users', []);
        const userIndex = users.findIndex(u => u.id === Dashboard.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].balance = newBalance;
            Utils.saveToStorage('users', users);
        }

        // Actualizar interfaz
        Dashboard.loadUserData();
    }
};
