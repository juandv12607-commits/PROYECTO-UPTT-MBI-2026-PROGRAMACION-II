// Array de imágenes - Modifica esto con las rutas o URLs de tu base de datos
        const images = [
            {
                src: './V1.jpeg', //'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
                title: 'Portada' //'Biblioteca Central'
            },
            {
                src: './V2.jpeg', //'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
                title: 'Reseña Historica 1/3' //'Colección de Libros'
            },
            {
                src: './V3.jpeg', //'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=80',
                title: 'Reseña Historica 2/3' //'Sala de Lectura'
            },
            {
                src: './V4.jpeg', //'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80',
                title: 'Reseña Historica 3/3' //'Estanterías Históricas'
            },
            {
                src: './V5.jpeg', //'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80',
                title: 'Misión y Visión de la Organización' //'Estanterías Históricas'
            },
            {
                src: './V6.jpeg', //'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80',
                title: 'Naturaleza de la Organización' //'Estanterías Históricas'
            }
        ];

        class ImageViewer {
            constructor(images) {
                this.images = images;
                this.currentIndex = 0;
                this.isLoading = false;
                
                // Elementos del DOM
                this.currentImage = document.getElementById('currentImage');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.imageCounter = document.getElementById('imageCounter');
                this.imageTitle = document.getElementById('imageTitle');
                this.dotsContainer = document.getElementById('dotsContainer');
                this.loading = document.getElementById('loading');
                
                this.init();
            }

            init() {
                this.createDots();
                this.updateDisplay();
                this.bindEvents();
            }

            createDots() {
                this.dotsContainer.innerHTML = '';
                this.images.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.addEventListener('click', () => this.goToImage(index));
                    this.dotsContainer.appendChild(dot);
                });
            }

            updateDisplay() {
                const currentImageData = this.images[this.currentIndex];
                
                // Mostrar animación de carga
                this.loading.style.display = 'block';
                this.currentImage.style.opacity = '0';
                
                const img = new Image();
                
                img.onload = () => {
                    this.currentImage.src = currentImageData.src;
                    this.currentImage.alt = currentImageData.title;
                    this.currentImage.style.opacity = '1';
                    this.loading.style.display = 'none';
                    this.isLoading = false;
                };
                
                img.onerror = () => {
                    this.loading.textContent = 'ERROR AL CARGAR';
                    this.isLoading = false;
                };
                
                this.isLoading = true;
                img.src = currentImageData.src;
                
                // Actualizar textos
                this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
                this.imageTitle.textContent = currentImageData.title;
                
                // Estado de los botones
                this.prevBtn.disabled = this.currentIndex === 0;
                this.nextBtn.disabled = this.currentIndex === this.images.length - 1;
                
                this.updateDots();
            }

            updateDots() {
                const dots = this.dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }

            nextImage() {
                if (this.currentIndex < this.images.length - 1 && !this.isLoading) {
                    this.currentIndex++;
                    this.updateDisplay();
                }
            }

            prevImage() {
                if (this.currentIndex > 0 && !this.isLoading) {
                    this.currentIndex--;
                    this.updateDisplay();
                }
            }

            goToImage(index) {
                if (index >= 0 && index < this.images.length && index !== this.currentIndex && !this.isLoading) {
                    this.currentIndex = index;
                    this.updateDisplay();
                }
            }

            bindEvents() {
                this.nextBtn.addEventListener('click', () => this.nextImage());
                this.prevBtn.addEventListener('click', () => this.prevImage());
                
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prevImage();
                    if (e.key === 'ArrowRight') this.nextImage();
                });
                
                let touchStartX = 0;
                let touchEndX = 0;
                
                this.currentImage.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                });
                
                this.currentImage.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    const swipeThreshold = 50;
                    const diff = touchStartX - touchEndX;
                    
                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            this.nextImage();
                        } else {
                            this.prevImage();
                        }
                    }
                });
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new ImageViewer(images);
        });