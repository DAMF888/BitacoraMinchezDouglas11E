document.addEventListener('DOMContentLoaded', () => {
    // Array optimizado con los nuevos nombres de archivo limpios (Sin espacios ni caracteres especiales)
    const curatedLandscapes = [
        { type: 'pdf', url: 'Documentos y capturas/arduinoDM.pdf', title: 'Introducción a Arduino', date: 'Semana 1' },
        { type: 'video', url: 'recursos/CircuitoLedRGB.mp4', title: 'Circuito LED RGB', date: 'Semana 4' },
        { type: 'video', url: 'recursos/CircuitoFisico1.mp4', title: 'Circuito Físico 1', date: 'Semana 5' },
        { type: 'video', url: 'recursos/Encender y apagar 3LEDs.MOV', title: 'Circuito Físico 2', date: 'Semana 6' }

    ];

    const filmStrip = document.getElementById('film-strip');
    const modal = document.getElementById('lightbox');
    const modalMediaWrapper = document.getElementById('modal-media-wrapper');

    // Inyección de elementos en la cinta cinemática
    curatedLandscapes.forEach((item, i) => {
        const article = document.createElement('article');
        article.className = 'film-item';
        
        if (item.type === 'video') {
            // Miniatura visual con soporte de carga nativa y fallback
            article.innerHTML = `
                <video class="preview-video" muted loop playsinline preload="metadata">
                    <source src="${item.url}" type="video/mp4">
                </video>
                <div class="film-item__info">
                    <h3>${item.title}</h3>
                </div>
            `;
            
            // Intento seguro de reproducción en hover de la cinta
            article.addEventListener('mouseenter', () => {
                const vid = article.querySelector('video');
                if (vid) vid.play().catch(() => {});
            });
            article.addEventListener('mouseleave', () => {
                const vid = article.querySelector('video');
                if (vid) {
                    vid.pause();
                    vid.currentTime = 0;
                }
            });
        } else {
            // Estética simétrica para el documento PDF
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

        // Evento interactivo para desplegar el recurso en pantalla completa
        article.onclick = () => {
            modalMediaWrapper.innerHTML = ''; // Limpieza de memoria
            
            if (item.type === 'pdf') {
                modalMediaWrapper.innerHTML = `<embed src="${item.url}" type="application/pdf" />`;
            } else if (item.type === 'video') {
                // Atributos forzados para garantizar la reproducción automática tras la acción del usuario
                modalMediaWrapper.innerHTML = `
                    <video controls autoplay playsinline style="width:100%; height:100%;">
                        <source src="${item.url}" type="video/mp4">
                        Tu navegador no soporta video adaptativo.
                    </video>
                `;
            }

            document.getElementById('modal-title').textContent = item.title;
            document.getElementById('modal-date').textContent = item.date;
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        };

        filmStrip.appendChild(article);
        
        // Animación de entrada cinemática fluida
        setTimeout(() => {
            article.style.opacity = '1';
            article.style.transform = 'translateY(0)';
        }, i * 150);
    });

    // FUNCIÓN DE DESPLAZAMIENTO FLUIDO (EaseInOutQuad)
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

    // CONMUTADOR MODO CLARO / OSCURO (Mantiene persistencia en caché)
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

    // INTERRUPTOR DE CIERRE PARA LA VENTANA MODAL
    const closeModal = () => {
        modal.style.display = 'none';
        modalMediaWrapper.innerHTML = ''; // Destruye el nodo para detener audios en segundo plano
        document.body.classList.remove('modal-open');
    };

    document.querySelector('.modal__close').onclick = closeModal;
    window.onclick = (e) => { if (e.target === modal) closeModal(); };
});
