// Módulo de transacciones

const Transactions = {
    // Configurar formulario de depósito
    setupDepositForm: () => {
        const form = document.getElementById('deposit-form');
        if (form) {
            // Remover listeners previos
            form.removeEventListener('submit', Transactions.handleDeposit);
            form.addEventListener('submit', Transactions.handleDeposit);
        }
    },

    // Configurar formulario de retiro
    setupWithdrawForm: () => {
        const form = document.getElementById('withdraw-form');
        if (form) {
            form.removeEventListener('submit', Transactions.handleWithdraw);
            form.addEventListener('submit', Transactions.handleWithdraw);
        }
    },

    // Configurar formulario de pagos
    setupPaymentsForm: () => {
        const form = document.getElementById('payments-form');
        if (form) {
            form.removeEventListener('submit', Transactions.handlePayment);
            form.addEventListener('submit', Transactions.handlePayment);
        }
    },

    // Configurar tabla de transacciones
    setupTransactionsTable: () => {
        const printBtn = document.getElementById('print-transactions');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                Utils.printElement('transactions-table');
            });
        }
    },

    // Manejar depósito
    handleDeposit: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const amount = parseInt(formData.get('amount'));
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            amount: {
                required: true,
                custom: (value) => {
                    const numValue = parseInt(value);
                    if (isNaN(numValue) || numValue <= 0) {
                        return 'El monto debe ser mayor a 0';
                    }
                    if (numValue > 50000000) {
                        return 'El monto máximo para depósitos es $50,000,000';
                    }
                    return true;
                },
                requiredMessage: 'Debe ingresar el monto a consignar'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Inválidos', validation.errors.join('\n'));
            return;
        }

        // Mostrar confirmación
        const result = await Utils.showConfirmation(
            'Confirmar Depósito',
            `¿Está seguro que desea consignar ${Utils.formatCurrency(amount)} en su cuenta?\n\nEsta operación no se puede deshacer.`
        );

        if (result.isConfirmed) {
            try {
                const currentUser = Auth.getCurrentUser();
                const newBalance = currentUser.balance + amount;
                
                // Crear transacción
                const transaction = {
                    id: Date.now(),
                    userId: currentUser.id,
                    reference: Utils.generateReferenceNumber(),
                    type: 'Depósito',
                    description: 'Consignación electrónica',
                    amount: amount,
                    date: new Date().toISOString(),
                    balanceAfter: newBalance
                };

                // Guardar transacción
                const transactions = Utils.getFromStorage('transactions', []);
                transactions.push(transaction);
                Utils.saveToStorage('transactions', transactions);
                
                // Actualizar saldo
                Dashboard.updateUserBalance(newBalance);

                // Actualizar tablas de transacciones
                Transactions.refreshTransactionTables();

                // Mostrar éxito
                await Utils.showSuccess(
                    'Depósito Exitoso',
                    `Su depósito ha sido procesado exitosamente.\n\nMonto: ${Utils.formatCurrency(amount)}\nReferencia: ${transaction.reference}\nSaldo actual: ${Utils.formatCurrency(newBalance)}`
                );

                // Limpiar formulario
                e.target.reset();
                
                // Mostrar toast
                Utils.showToast('Depósito realizado con éxito');

            } catch (error) {
                console.error('Error al procesar depósito:', error);
                Utils.showError('Error', 'Ocurrió un error al procesar su depósito. Intente nuevamente.');
            }
        }
    },

    // Manejar retiro
    handleWithdraw: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const amount = parseInt(formData.get('amount'));
        const currentUser = Auth.getCurrentUser();
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            amount: {
                required: true,
                custom: (value) => {
                    const numValue = parseInt(value);
                    if (isNaN(numValue) || numValue <= 0) {
                        return 'El monto debe ser mayor a 0';
                    }
                    if (numValue > 2000000) {
                        return 'El monto máximo para retiros es $2,000,000';
                    }
                    if (numValue > currentUser.balance) {
                        return 'Saldo insuficiente para realizar esta operación';
                    }
                    return true;
                },
                requiredMessage: 'Debe ingresar el monto a retirar'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Inválidos', validation.errors.join('\n'));
            return;
        }

        // Mostrar confirmación
        const result = await Utils.showConfirmation(
            'Confirmar Retiro',
            `¿Está seguro que desea retirar ${Utils.formatCurrency(amount)} de su cuenta?\n\nSaldo actual: ${Utils.formatCurrency(currentUser.balance)}\nSaldo después del retiro: ${Utils.formatCurrency(currentUser.balance - amount)}`
        );

        if (result.isConfirmed) {
            try {
                const newBalance = currentUser.balance - amount;
                
                // Crear transacción
                const transaction = {
                    id: Date.now(),
                    userId: currentUser.id,
                    reference: Utils.generateReferenceNumber(),
                    type: 'Retiro',
                    description: 'Retiro de efectivo',
                    amount: amount,
                    date: new Date().toISOString(),
                    balanceAfter: newBalance
                };

                // Guardar transacción
                const transactions = Utils.getFromStorage('transactions', []);
                transactions.push(transaction);
                Utils.saveToStorage('transactions', transactions);

                // Actualizar saldo
                Dashboard.updateUserBalance(newBalance);

                // Actualizar tablas de transacciones
                Transactions.refreshTransactionTables();

                // Mostrar éxito
                await Utils.showSuccess(
                    'Retiro Exitoso',
                    `Su retiro ha sido procesado exitosamente.\n\nMonto: ${Utils.formatCurrency(amount)}\nReferencia: ${transaction.reference}\nSaldo actual: ${Utils.formatCurrency(newBalance)}`
                );

                // Limpiar formulario
                e.target.reset();
                
                // Mostrar toast
                Utils.showToast('Retiro realizado con éxito');

            } catch (error) {
                console.error('Error al procesar retiro:', error);
                Utils.showError('Error', 'Ocurrió un error al procesar su retiro. Intente nuevamente.');
            }
        }
    },

    // Manejar pago de servicios
    handlePayment: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const serviceType = formData.get('service');
        const reference = formData.get('reference');
        const amount = parseInt(formData.get('amount'));
        const currentUser = Auth.getCurrentUser();
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            service: {
                required: true,
                requiredMessage: 'Debe seleccionar un tipo de servicio'
            },
            reference: {
                required: true,
                minLength: 3,
                requiredMessage: 'Debe ingresar la referencia del servicio'
            },
            amount: {
                required: true,
                custom: (value) => {
                    const numValue = parseInt(value);
                    if (isNaN(numValue) || numValue <= 0) {
                        return 'El monto debe ser mayor a 0';
                    }
                    if (numValue > 5000000) {
                        return 'El monto máximo para pagos es $5,000,000';
                    }
                    if (numValue > currentUser.balance) {
                        return 'Saldo insuficiente para realizar este pago';
                    }
                    return true;
                },
                requiredMessage: 'Debe ingresar el monto a pagar'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Inválidos', validation.errors.join('\n'));
            return;
        }

        // Formatear tipo de servicio
        const serviceNames = {
            'energia': 'Recibo de la luz - CENS',
            'agua': 'Aguas Kapital Cúcuta',
            'gas': 'Gases del Oriente',
            'internet': 'Servicio de Internet - CLARO'
        };

        const serviceName = serviceNames[serviceType];

        // Mostrar confirmación
        const result = await Utils.showConfirmation(
            'Confirmar Pago',
            `¿Está seguro que desea pagar el servicio?\n\nServicio: ${serviceName}\nReferencia: ${reference}\nMonto: ${Utils.formatCurrency(amount)}\n\nSaldo actual: ${Utils.formatCurrency(currentUser.balance)}`
        );

        if (result.isConfirmed) {
            try {
                const newBalance = currentUser.balance - amount;
                
                // Crear transacción
                const transaction = {
                    id: Date.now(),
                    userId: currentUser.id,
                    reference: Utils.generateReferenceNumber(),
                    type: 'Pago',
                    description: `Pago de ${serviceName} - Ref: ${reference}`,
                    amount: amount,
                    date: new Date().toISOString(),
                    balanceAfter: newBalance
                };

                // Guardar transacción
                const transactions = Utils.getFromStorage('transactions', []);
                transactions.push(transaction);
                Utils.saveToStorage('transactions', transactions);

                // Actualizar saldo
                Dashboard.updateUserBalance(newBalance);

                // Actualizar tablas de transacciones
                Transactions.refreshTransactionTables();

                // Mostrar éxito
                await Utils.showSuccess(
                    'Pago Exitoso',
                    `Su pago ha sido procesado exitosamente.\n\nServicio: ${serviceName}\nReferencia del servicio: ${reference}\nMonto: ${Utils.formatCurrency(amount)}\nReferencia de transacción: ${transaction.reference}\nSaldo actual: ${Utils.formatCurrency(newBalance)}`
                );

                // Limpiar formulario
                e.target.reset();
                
                // Mostrar toast
                Utils.showToast('Pago realizado con éxito');

            } catch (error) {
                console.error('Error al procesar pago:', error);
                Utils.showError('Error', 'Ocurrió un error al procesar su pago. Intente nuevamente.');
            }
        }
    },

    // Cargar todas las transacciones
    loadAllTransactions: () => {
        const currentUser = Auth.getCurrentUser();
        const transactions = Utils.getFromStorage('transactions', []);
        const userTransactions = transactions
            .filter(t => t.userId === currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('transactions-tbody');
        if (tbody) {
            if (userTransactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="no-data">No hay transacciones registradas</td></tr>';
            } else {
                tbody.innerHTML = userTransactions.map(transaction => `
                    <tr>
                        <td>${Utils.formatDateTime(transaction.date)}</td>
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

    // Obtener transacciones por período
    getTransactionsByPeriod: (year, month) => {
        const currentUser = Auth.getCurrentUser();
        const transactions = Utils.getFromStorage('transactions', []);
        
        return transactions.filter(transaction => {
            if (transaction.userId !== currentUser.id) return false;
            
            const transactionDate = new Date(transaction.date);
            const transactionYear = transactionDate.getFullYear();
            const transactionMonth = transactionDate.getMonth() + 1;
            
            return transactionYear === parseInt(year) && transactionMonth === parseInt(month);
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Actualizar tablas de transacciones
    refreshTransactionTables: () => {
        // Actualizar tabla de transacciones recientes en el dashboard
        Dashboard.loadRecentTransactions();
        
        // Actualizar tabla de historial completo
        Transactions.loadAllTransactions();
    }
};