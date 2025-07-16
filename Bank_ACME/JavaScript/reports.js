// Módulo de reportes

const Reports = {
    // Configurar formulario de extractos
    setupStatementsForm: () => {
        const form = document.getElementById('statements-form');
        if (form) {
            form.removeEventListener('submit', Reports.handleGenerateStatement);
            form.addEventListener('submit', Reports.handleGenerateStatement);
        }

        // Configurar años disponibles
        Reports.setupYearOptions();

        // Configurar botón de imprimir
        const printBtn = document.getElementById('print-statement');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                Utils.printElement('statement-table');
            });
        }
    },

    // Configurar opciones de años
    setupYearOptions: () => {
        const yearSelect = document.getElementById('statement-year');
        if (yearSelect) {
            yearSelect.innerHTML = '<option value="">Seleccionar año</option>';
            const years = Utils.generateYears();
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
        }
    },

    // Configurar certificado
    setupCertificate: () => {
        const printBtn = document.getElementById('print-certificate');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                Utils.printElement('certificate-document');
            });
        }

        // Actualizar datos del certificado
        Reports.updateCertificateData();
    },

    // Actualizar datos del certificado
    updateCertificateData: () => {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return;

        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        
        // Actualizar elementos del certificado
        const certHolderName = document.getElementById('cert-holder-name');
        const certHolderId = document.getElementById('cert-holder-id');
        const certAccountNumber = document.getElementById('cert-account-number');
        const certAccountDate = document.getElementById('cert-account-date');
        const certIssueDate = document.getElementById('cert-issue-date');

        if (certHolderName) certHolderName.textContent = fullName;
        if (certHolderId) certHolderId.textContent = currentUser.idNumber;
        if (certAccountNumber) certAccountNumber.textContent = currentUser.accountNumber;
        if (certAccountDate) certAccountDate.textContent = Utils.formatDate(currentUser.createdDate);
        if (certIssueDate) certIssueDate.textContent = Utils.formatDate(new Date());
    },

    // Manejar generación de extracto
    handleGenerateStatement: async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const year = formData.get('year');
        const month = formData.get('month');
        
        // Validar formulario
        const validation = Utils.validateForm(formData, {
            year: {
                required: true,
                requiredMessage: 'Debe seleccionar un año'
            },
            month: {
                required: true,
                requiredMessage: 'Debe seleccionar un mes'
            }
        });

        if (!validation.isValid) {
            Utils.showError('Datos Incompletos', validation.errors.join('\n'));
            return;
        }

        try {
            // Obtener transacciones del período
            const transactions = Transactions.getTransactionsByPeriod(year, month);
            
            // Mostrar período seleccionado
            const periodElement = document.getElementById('statement-period');
            if (periodElement) {
                periodElement.textContent = `${Utils.getMonthName(month)} ${year}`;
            }

            // Mostrar resultados
            const resultsDiv = document.getElementById('statement-results');
            if (resultsDiv) {
                resultsDiv.style.display = 'block';
            }

            // Llenar tabla con transacciones
            const tbody = document.getElementById('statement-tbody');
            if (tbody) {
                if (transactions.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No hay transacciones en este período</td></tr>';
                } else {
                    tbody.innerHTML = transactions.map(transaction => `
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

            // Mostrar notificación de éxito
            if (transactions.length > 0) {
                Utils.showToast(`Extracto generado: ${transactions.length} transacciones encontradas`);
            } else {
                Utils.showInfo('Sin Transacciones', `No se encontraron transacciones para ${Utils.getMonthName(month)} ${year}.`);
            }

        } catch (error) {
            console.error('Error al generar extracto:', error);
            Utils.showError('Error', 'Ocurrió un error al generar el extracto. Intente nuevamente.');
        }
    },

    // Obtener resumen de transacciones
    getTransactionSummary: (transactions) => {
        const summary = {
            total: transactions.length,
            deposits: 0,
            withdrawals: 0,
            payments: 0,
            totalDeposits: 0,
            totalWithdrawals: 0,
            totalPayments: 0
        };

        transactions.forEach(transaction => {
            switch (transaction.type) {
                case 'Depósito':
                    summary.deposits++;
                    summary.totalDeposits += transaction.amount;
                    break;
                case 'Retiro':
                    summary.withdrawals++;
                    summary.totalWithdrawals += transaction.amount;
                    break;
                case 'Pago':
                    summary.payments++;
                    summary.totalPayments += transaction.amount;
                    break;
            }
        });

        return summary;
    }
};
