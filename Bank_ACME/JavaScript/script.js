// Script principal para ACME Bank
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    init();
});

function init() {
    // Verificar si hay usuario logueado
    if (Auth.isLoggedIn()) {
        Utils.showPage('dashboard-page');
        Dashboard.init();
    } else {
        Utils.showPage('login-page');
    }
    
    // Inicializar módulos
    Auth.init();
    
    // Configurar logo clickeable en dashboard
    setupClickableLogo();
}

function setupClickableLogo() {
    const logoClickable = document.getElementById('logo-clickable');
    if (logoClickable) {
        logoClickable.addEventListener('click', () => {
            // Solo funciona si el usuario está logueado
            if (Auth.isLoggedIn()) {
                Dashboard.showSection('dashboard');
                
                // Actualizar navegación activa
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                document.querySelector('.nav-item[data-section="dashboard"]').classList.add('active');
                
                // Mostrar toast de confirmación
                Utils.showToast('Navegando al dashboard', 'info');
            }
        });
    }
}