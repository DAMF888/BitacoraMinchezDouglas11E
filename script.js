document.addEventListener('DOMContentLoaded', () => {
    // Array estructurado con el orden de prioridades y rutas exactas fijadas en tu GitHub
    const curatedLandscapes = [
        { type: 'pdf', url: 'Documentos y capturas/arduinoDM.pdf', title: 'Introducción a Arduino', date: 'Semana 1' },
        { type: 'video', url: 'recursos/Página Web  DM.mp4', title: 'Diseño de Página Web', date: 'Semana 2' },
        { type: 'video', url: 'recursos/Primer Circuito  DM.mp4', title: 'Primer Circuito', date: 'Semana 3' },
        { type: 'video', url: 'recursos/CircuitoLedRGB.mp4', title: 'Circuito LED RGB', date: 'Semana 4' },
        { type: 'video', url: 'recursos/CircuitoFisico1.mp4', title: 'Circuito Físico 1', date: 'Semana 5' }
    ];

    const filmStrip = document.getElementById('film-strip');
    const modal = document.getElementById('lightbox');
    const modalMediaWrapper = document.getElementById('modal-media-wrapper');

    // Inyección pura estilo "film-item" tal como la referencia
    curatedLandscapes.forEach((item, i) => {
        const article = document.createElement('article');
        article.className = 'film-item';
        
        // Renderiza el contenido correspondiente en miniatura cinemática
        if (item.type === 'video') {
            article.innerHTML = `
                <video class="preview-video" muted loop playsinline>
                    <source src="${item.url}" type="video/mp4">
                </video>
                <div class="film-item__info">
                    <h3>${item.title}</h3>
                </div>
            `;
            // Pequeña reproducción opcional al pasar el mouse por encima
            article.addEventListener('mouseenter', () => article.querySelector('video').play().catch(()=>{}));
            article.addEventListener('mouseleave', () => {
                const v = article.querySelector('video');
                v.pause();
                v.currentTime = 0;
            });
        } else {
            // Placeholder visual para mantener simétrica la tira de película con el PDF
            article.innerHTML = `
                <div class="preview-pdf-placeholder">
                    <span>📄</span>
                    <p style="font-size:0.75rem; margin:0; text-transform:uppercase; letter-spacing:1px;">Documento PDF</p>
                </div>
                <div class="film-item__info">
                    <h3>${item.title}</h3>
                </div>
            `;
        }

        // Evento de apertura idéntico asignando el viewport activo
        article.onclick = () => {
            modalMediaWrapper.innerHTML = ''; // Reset preventivo
            
            if (item.type === 'pdf') {
                modalMediaWrapper.innerHTML = `<embed src="${item.url}" type="application/pdf" />`;
            } else if (item.type === 'video') {
                modalMediaWrapper.innerHTML = `<video controls autoplay><source src="${item.url}" type="video/mp4"></video>`;
            }

            document.getElementById('modal-title').textContent = item.title;
            document.getElementById('modal-date').textContent = item.date;
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        };

        filmStrip.appendChild(article);
        
        setTimeout(() => {
            article.style.opacity = '1';
            article.style.transform = 'translateY(0)';
        }, i * 150);
    });

    /**
     * FUNCIÓN DE SCROLL PERSONALIZADA (EaseInOutQuad) - IDÉNTICA A LA REFERENCIA
     */
    function smoothScroll(element, distance, duration) {
        const start = element.scrollLeft;
        const startTime = performance.now();

        function animate(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            element.scrollLeft = start + distance * ease;

            if (timeElapsed < duration) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    const step = 420; 

    document.getElementById('nextBtn').onclick = () => {
        smoothScroll(filmStrip, step, 650); 
    };

    document.getElementById('prevBtn').onclick = () => {
        smoothScroll(filmStrip, -step, 650);
    };

    // Control del Switch de Modo Claro/Oscuro alternable
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    themeToggle.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        themeIcon.textContent = isDark ? '☀' : '☾';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀';
    }

    // Funciones de Cierre Limpias del Lightbox
    const closeModal = () => {
        modal.style.display = 'none';
        modalMediaWrapper.innerHTML = ''; // Corta de golpe audio/video
        document.body.classList.remove('modal-open');
    };

    document.querySelector('.modal__close').onclick = closeModal;
    window.onclick = (e) => { if (e.target === modal) closeModal(); };
});
