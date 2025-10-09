// ========================================
// 🎮 NAVEGACIÓN DE CERTIFICACIONES
// ========================================

const certGrid = document.getElementById('certGrid');
const certScrollLeft = document.getElementById('certScrollLeft');
const certScrollRight = document.getElementById('certScrollRight');

// Scroll suave con los botones laterales
if (certScrollLeft && certScrollRight) {
    certScrollLeft.addEventListener('click', () => {
        certGrid.scrollBy({
            left: -320, // Ancho de la tarjeta + gap
            behavior: 'smooth'
        });
    });

    certScrollRight.addEventListener('click', () => {
        certGrid.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
    });
}

// Scroll horizontal con rueda del mouse (opcional pero útil)
certGrid.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
        e.preventDefault();
        certGrid.scrollBy({
            left: e.deltaY,
            behavior: 'smooth'
        });
    }
});

// ========================================
// EFECTO MATRIX - LLUVIA DE CARACTERES
// ========================================

function createMatrixRain() {
    const container = document.getElementById('matrixBg');

    // 🎨 PERSONALIZACIÓN: Caracteres que van a llover
    const chars = '010101</>{}();';

    // 📏 CONFIGURACIÓN: Cantidad de columnas
    const screenWidth = window.innerWidth;
    const columnWidth = 35;
    const columns = Math.floor(screenWidth / columnWidth);

    container.innerHTML = '';

    for (let i = 0; i < columns; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        drop.textContent = chars[Math.floor(Math.random() * chars.length)];
        drop.style.left = (i * columnWidth) + Math.random() * 20 + 'px';

        const minSpeed = 3;
        const maxSpeed = 7;
        drop.style.animationDuration = (Math.random() * (maxSpeed - minSpeed) + minSpeed) + 's';

        const maxDelay = 5;
        drop.style.animationDelay = (Math.random() * maxDelay) + 's';

        container.appendChild(drop);
    }
}

createMatrixRain();

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createMatrixRain();
    }, 250);
});

// ========================================
// CONFIGURACIÓN GENERAL
// ========================================

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
const toggle = document.getElementById('themeToggle');
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');

const setTheme = (mode) => {
    if (mode === 'light') {
        document.documentElement.style.colorScheme = 'light';
        document.documentElement.classList.add('light');
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
    } else {
        document.documentElement.style.colorScheme = 'dark';
        document.documentElement.classList.remove('light');
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
    }
};

const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDark ? 'dark' : 'light');

toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('light');
    setTheme(isDark ? 'dark' : 'light');
});

// Copy full name
document.getElementById('copyName').addEventListener('click', async () => {
    const text = 'Eduardo Cruz García';
    try {
        await navigator.clipboard.writeText(text);
        flash('Nombre copiado');
    } catch (e) {
        flash('No se pudo copiar');
    }
});

// Tilt effect on card
const card = document.getElementById('card');
let tiltEnabled = true;

const map = (n, a, b, c, d) => (n - a) * (d - c) / (b - a) + c;

function handleTilt(e) {
    if (!tiltEnabled) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = map(y, 0, rect.height, 6, -6);
    const ry = map(x, 0, rect.width, -10, 10);
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
}

card.addEventListener('mousemove', handleTilt);
card.addEventListener('mouseleave', () => card.style.transform = 'translateZ(0)');

const tiltBtn = document.getElementById('tiltToggle');

try {
    const coarse = matchMedia('(pointer: coarse)').matches;
    if (coarse || window.innerWidth < 720) {
        tiltEnabled = false;
        tiltBtn.textContent = 'Efecto tilt: OFF';
        tiltBtn.classList.add('disabled');
    }
} catch (_) {
}

tiltBtn.addEventListener('click', () => {
    tiltEnabled = !tiltEnabled;
    tiltBtn.textContent = `Efecto tilt: ${tiltEnabled ? 'ON' : 'OFF'}`;
    if (!tiltEnabled) {
        card.style.transform = 'none';
    }
});

// Toast notification
function flash(message) {
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = 'position:fixed;left:50%;top:22px;transform:translateX(-50%);padding:10px 14px;border-radius:12px;border:1px solid var(--border);background:rgba(0,0,0,.65);color:white;backdrop-filter:blur(8px);z-index:50;box-shadow:var(--shadow);font-weight:600;letter-spacing:.2px';
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.transition = 'opacity .4s ease, transform .4s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) translateY(-6px)';
    }, 900);
    setTimeout(() => el.remove(), 1400);
}

// ========================================
// 🔒 PROTECCIÓN DE CERTIFICACIONES
// ========================================

// Modal de certificaciones
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certClose = document.getElementById('certClose');

// Abrir modal al hacer clic en una certificación
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', function () {
        const certSrc = this.getAttribute('data-cert');
        certModalImg.src = certSrc;
        certModal.classList.add('active');
    });
});

// Cerrar modal
certClose.addEventListener('click', () => {
    certModal.classList.remove('active');
});

certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
        certModal.classList.remove('active');
    }
});

// Bloquear menú contextual en certificaciones y modal
document.querySelectorAll('.cert-image, .cert-modal img').forEach(img => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
    img.setAttribute('draggable', 'false');
});

// Bloquear clic derecho en las tarjetas de certificaciones
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('contextmenu', (e) => e.preventDefault());
});

// Protección adicional: interceptar intentos de guardar imágenes
document.addEventListener('keydown', (e) => {
    // Bloquear Ctrl+S / Cmd+S en modal de certificaciones
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (certModal.classList.contains('active')) {
            e.preventDefault();
            flash('Las certificaciones están protegidas');
        }
    }
});

// Bloquear menú contextual global, excepto en el botón de copiar nombre
document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('#copyName')) e.preventDefault();
});

// Forzar que cualquier intento de copiar, ponga tu nombre
document.addEventListener('copy', (e) => {
    // No bloquear si están seleccionando texto dentro de certificaciones info
    if (e.target.closest('.cert-info')) return;

    e.preventDefault();
    e.clipboardData.setData('text/plain', 'Eduardo Cruz García');
});

// Proteger foto de perfil
document.querySelectorAll('.avatar img').forEach(img => {
    img.setAttribute('draggable', 'false');
});