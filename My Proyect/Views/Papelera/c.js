///////////////////////////////////////////////////////////////////////////////////////

        // ------------------------------------------------------------
        // MATEMÁTICAS 3D
        // ------------------------------------------------------------
        
        class Punto3D {
            constructor(x, y, z) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
            }
        }
        
        function rotarPuntoY(punto, anguloRad) {
            const c = Math.cos(anguloRad);
            const s = Math.sin(anguloRad);
            return new Punto3D(
                punto.x * c + punto.z * s,
                punto.y,
                -punto.x * s + punto.z * c
            );
        }
        
        function rotarPuntoX(punto, anguloRad) {
            const c = Math.cos(anguloRad);
            const s = Math.sin(anguloRad);
            return new Punto3D(
                punto.x,
                punto.y * c - punto.z * s,
                punto.y * s + punto.z * c
            );
        }
        
        // ------------------------------------------------------------
        // DATOS DEL CUBO
        // ------------------------------------------------------------
        
        function crearCuboDatos(tam = 1.5) {
            const s = tam / 2.0;
            
            // Vértices
            const vertices = [
                new Punto3D(-s, -s, -s),  // 0
                new Punto3D( s, -s, -s),  // 1
                new Punto3D( s, -s,  s),  // 2
                new Punto3D(-s, -s,  s),  // 3
                new Punto3D(-s,  s, -s),  // 4
                new Punto3D( s,  s, -s),  // 5
                new Punto3D( s,  s,  s),  // 6
                new Punto3D(-s,  s,  s)   // 7
            ];
            
            // Triángulos con colores (cada cara son 2 triángulos)
            const triangulos = [
                // Cara FRONTAL (z = -s) - Rojo
                { i0: 0, i1: 1, i2: 4, color: '#ff4444' },
                { i0: 1, i1: 5, i2: 4, color: '#ff4444' },
                // Cara TRASERA (z = s) - Verde
                { i0: 2, i1: 3, i2: 6, color: '#44ff44' },
                { i0: 3, i1: 7, i2: 6, color: '#44ff44' },
                // Cara IZQUIERDA (x = -s) - Azul
                { i0: 0, i1: 4, i2: 3, color: '#4444ff' },
                { i0: 4, i1: 7, i2: 3, color: '#4444ff' },
                // Cara DERECHA (x = s) - Amarillo
                { i0: 1, i1: 2, i2: 5, color: '#ffff44' },
                { i0: 2, i1: 6, i2: 5, color: '#ffff44' },
                // Cara INFERIOR (y = -s) - Magenta
                { i0: 0, i1: 3, i2: 1, color: '#ff44ff' },
                { i0: 3, i1: 2, i2: 1, color: '#ff44ff' },
                // Cara SUPERIOR (y = s) - Cian
                { i0: 4, i1: 5, i2: 7, color: '#44ffff' },
                { i0: 5, i1: 6, i2: 7, color: '#44ffff' }
            ];
            
            return { vertices, triangulos };
        }
        
        // ------------------------------------------------------------
        // CÁMARA
        // ------------------------------------------------------------
        
        class Camara {
            constructor(x, y, z, fov = 80) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.fov = fov;
                this.factor = 1.0 / Math.tan(fov * Math.PI / 180.0 / 2.0);
            }
            
            proyectar(punto) {
                const dx = punto.x - this.x;
                const dy = punto.y - this.y;
                const dz = punto.z - this.z;
                
                if (dz <= 0.1) return null;
                
                const xProy = dx * this.factor / dz;
                const yProy = dy * this.factor / dz;
                
                return { x: xProy, y: yProy, z: dz };
            }
        }
        
        // ------------------------------------------------------------
        // RENDERIZADOR (Canvas 2D)
        // ------------------------------------------------------------
        
        class Renderer {
            constructor(canvas, ancho, alto) {
                this.canvas = canvas;
                this.ancho = ancho;
                this.alto = alto;
                this.ctx = canvas.getContext('2d');
                this.imageData = this.ctx.createImageData(ancho, alto);
                this.zbuffer = new Array(ancho * alto);
                this.verticesRotados = [];
            }
            
            limpiar() {
                // Limpiar framebuffer (negro)
                for (let i = 0; i < this.imageData.data.length; i += 4) {
                    this.imageData.data[i] = 0;     // R
                    this.imageData.data[i+1] = 0;   // G
                    this.imageData.data[i+2] = 0;   // B
                    this.imageData.data[i+3] = 255; // A
                }
                // Resetear Z-buffer
                for (let i = 0; i < this.zbuffer.length; i++) {
                    this.zbuffer[i] = Infinity;
                }
            }
            
            dibujarPixel(x, y, color, profundidad) {
                if (x >= 0 && x < this.ancho && y >= 0 && y < this.alto) {
                    const idx = y * this.ancho + x;
                    if (profundidad < this.zbuffer[idx]) {
                        this.zbuffer[idx] = profundidad;
                        // Convertir color hex a RGB
                        const r = parseInt(color.slice(1,3), 16);
                        const g = parseInt(color.slice(3,5), 16);
                        const b = parseInt(color.slice(5,7), 16);
                        const pixelIdx = idx * 4;
                        this.imageData.data[pixelIdx] = r;
                        this.imageData.data[pixelIdx+1] = g;
                        this.imageData.data[pixelIdx+2] = b;
                    }
                }
            }
            
            dibujarLinea(x0, y0, z0, x1, y1, z1, color) {
                const dx = Math.abs(x1 - x0);
                const dy = Math.abs(y1 - y0);
                const sx = x0 < x1 ? 1 : -1;
                const sy = y0 < y1 ? 1 : -1;
                let err = dx - dy;
                
                let x = x0;
                let y = y0;
                const longitud = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
                if (longitud === 0) {
                    this.dibujarPixel(x, y, color, z0);
                    return;
                }
                
                let paso = 0;
                while (true) {
                    const t = paso / longitud;
                    const z = z0 * (1 - t) + z1 * t;
                    this.dibujarPixel(x, y, color, z);
                    
                    if (x === x1 && y === y1) break;
                    
                    const e2 = 2 * err;
                    if (e2 > -dy) {
                        err -= dy;
                        x += sx;
                    }
                    if (e2 < dx) {
                        err += dx;
                        y += sy;
                    }
                    paso++;
                }
            }
            
            dibujarTriangulo(tri, camara) {
                const v0 = this.verticesRotados[tri.i0];
                const v1 = this.verticesRotados[tri.i1];
                const v2 = this.verticesRotados[tri.i2];
                
                const p0 = camara.proyectar(v0);
                const p1 = camara.proyectar(v1);
                const p2 = camara.proyectar(v2);
                
                if (!p0 || !p1 || !p2) return false;
                
                // Convertir a coordenadas de pantalla
                const x0 = Math.floor((p0.x + 1.0) * this.ancho / 2.0);
                const y0 = Math.floor((1.0 - p0.y) * this.alto / 2.0);
                const x1 = Math.floor((p1.x + 1.0) * this.ancho / 2.0);
                const y1 = Math.floor((1.0 - p1.y) * this.alto / 2.0);
                const x2 = Math.floor((p2.x + 1.0) * this.ancho / 2.0);
                const y2 = Math.floor((1.0 - p2.y) * this.alto / 2.0);
                
                // Dibujar aristas
                this.dibujarLinea(x0, y0, p0.z, x1, y1, p1.z, tri.color);
                this.dibujarLinea(x1, y1, p1.z, x2, y2, p2.z, tri.color);
                this.dibujarLinea(x2, y2, p2.z, x0, y0, p0.z, tri.color);
                
                return true;
            }
            
            presentar() {
                this.ctx.putImageData(this.imageData, 0, 0);
            }
        }
        
        // ------------------------------------------------------------
        // BUCLE PRINCIPAL
        // ------------------------------------------------------------
        
        function main() {
            const ANCHO = 900;
            const ALTO = 700;
            
            // Obtener canvas
            const canvas = document.getElementById('c');
            canvas.width = ANCHO;
            canvas.height = ALTO;
            
            // Crear renderer
            const renderer = new Renderer(canvas, ANCHO, ALTO);
            
            // Crear cámara
            const camara = new Camara(0, 0, -7, 75);
            
            // Crear datos del cubo
            const { vertices, triangulos } = crearCuboDatos(1.6);
            
            // Variables de rotación
            let anguloY = 0;
            let anguloX = 0.2;
            
            // ROTACIÓN: 1 GRADO POR FRAME (60 FPS = 1 vuelta cada 6 segundos)
            const VELOCIDAD_Y = 1.0 * Math.PI / 180.0;  // 1 grado por frame
            const VELOCIDAD_X = 0.2 * Math.PI / 180.0;  // 0.2 grados por frame
            
            // Control de FPS
            let frameCount = 0;
            let lastTime = performance.now();
            const fpsElement = document.getElementById('fps');
            
            // Array para vértices rotados
            let verticesRotados = new Array(8);
            
            function animar() {
                const inicioFrame = performance.now();
                
                // Limpiar buffers
                renderer.limpiar();
                
                // Rotar todos los vértices
                for (let i = 0; i < vertices.length; i++) {
                    let v = vertices[i];
                    // Rotar en Y
                    let vRot = rotarPuntoY(v, anguloY);
                    // Rotar en X
                    vRot = rotarPuntoX(vRot, anguloX);
                    verticesRotados[i] = vRot;
                }
                renderer.verticesRotados = verticesRotados;
                
                // Dibujar todos los triángulos
                for (let tri of triangulos) {
                    renderer.dibujarTriangulo(tri, camara);
                }
                
                // Actualizar ángulos
                anguloY += VELOCIDAD_Y;
                anguloX += VELOCIDAD_X;
                
                // Mantener en rango
                if (anguloY >= 2 * Math.PI) anguloY -= 2 * Math.PI;
                if (anguloX >= 2 * Math.PI) anguloX -= 2 * Math.PI;
                
                // Presentar en pantalla
                renderer.presentar();
                
                // Actualizar FPS cada segundo
                frameCount++;
                const ahora = performance.now();
                if (ahora - lastTime >= 1000) {
                    
                    frameCount = 0;
                    lastTime = ahora;
                }
                
                // Control de 60 FPS
                const tiempoEjecucion = performance.now() - inicioFrame;
                const tiempoEspera = (1000 / 60) - tiempoEjecucion;
                if (tiempoEspera > 0) {
                    setTimeout(() => {
                        requestAnimationFrame(animar);
                    }, tiempoEspera);
                } else {
                    requestAnimationFrame(animar);
                }
            }
            
            // Iniciar animación
            animar();
            
            // Manejar cierre
            window.addEventListener('beforeunload', () => {
                console.log('Cerrando aplicación...');
            });
        }
        
        // Iniciar cuando la página esté cargada
        window.addEventListener('load', main);
