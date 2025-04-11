/**
 * Fluid Simulation for Cursor Effects
 * Based on the implementation of the SplashCursor component
 */

class FluidSimulation {
    constructor(canvas, config = {}) {
        console.log('FluidSimulation: Initializing');
        this.canvas = canvas;
        
        // Ensure canvas captures all mouse events
        this.canvas.style.pointerEvents = 'auto';
        
        // Default configuration with optimal settings
        this.config = {
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 1440,
            DENSITY_DISSIPATION: 3.5,  // Higher values make the fluid fade faster
            VELOCITY_DISSIPATION: 2,   // Higher values reduce motion persistence
            PRESSURE: 1,
            PRESSURE_ITERATIONS: 20,
            CURL: 3,                   // Lower values create less swirling
            SPLAT_RADIUS: 0.2,         // Controls the size of fluid splats
            SPLAT_FORCE: 6000,         // Controls the energy of fluid movement
            SHADING: true,
            COLOR_UPDATE_SPEED: 10,
            BACK_COLOR: { r: 0, g: 0, b: 0 }, // Deep black background
            TRANSPARENT: true,
            ...config
        };
        
        // Pointers for tracking mouse/touch
        this.pointers = [new Pointer()];
        
        // Timing variables
        this.lastTime = Date.now();
        this.colorUpdateTimer = 0;
        
        try {
            // Initialize WebGL
            this.initWebGL();
            
            // Create shader programs
            this.createShaderPrograms();
            
            // Initialize framebuffers
            this.initFramebuffers();
            
            // Set up event listeners
            this.initEventListeners();
            
            // Start animation loop
            console.log('FluidSimulation: Starting animation loop');
            this.animate();
        } catch (error) {
            console.error('FluidSimulation: Error during initialization', error);
        }
    }
    
    initWebGL() {
        const params = { 
            alpha: true, 
            depth: false, 
            stencil: false, 
            antialias: false, 
            preserveDrawingBuffer: false 
        };
        
        // Try WebGL2 first, then WebGL1
        this.gl = this.canvas.getContext('webgl2', params);
        const isWebGL2 = !!this.gl;
        
        if (!isWebGL2) {
            this.gl = this.canvas.getContext('webgl', params) || this.canvas.getContext('experimental-webgl', params);
        }
        
        // Get extensions
        if (isWebGL2) {
            this.gl.getExtension('EXT_color_buffer_float');
            this.ext = {
                supportLinearFiltering: this.gl.getExtension('OES_texture_float_linear'),
                halfFloatTexType: this.gl.HALF_FLOAT,
                formatRGBA: {
                    internalFormat: this.gl.RGBA16F,
                    format: this.gl.RGBA
                },
                formatRG: {
                    internalFormat: this.gl.RG16F,
                    format: this.gl.RG
                },
                formatR: {
                    internalFormat: this.gl.R16F,
                    format: this.gl.RED
                }
            };
        } else {
            const halfFloat = this.gl.getExtension('OES_texture_half_float');
            this.ext = {
                supportLinearFiltering: this.gl.getExtension('OES_texture_half_float_linear'),
                halfFloatTexType: halfFloat ? halfFloat.HALF_FLOAT_OES : null,
                formatRGBA: {
                    internalFormat: this.gl.RGBA,
                    format: this.gl.RGBA
                },
                formatRG: {
                    internalFormat: this.gl.RGBA,
                    format: this.gl.RGBA
                },
                formatR: {
                    internalFormat: this.gl.RGBA,
                    format: this.gl.RGBA
                }
            };
        }
        
        // If no linear filtering support, reduce resolution
        if (!this.ext.supportLinearFiltering) {
            this.config.DYE_RESOLUTION = 512;
            this.config.SHADING = false;
        }
        
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        // Create vertex buffer and element buffer
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), this.gl.STATIC_DRAW);
        
        const elementBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), this.gl.STATIC_DRAW);
        
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);
    }
    
    getShaderSource(id) {
        return document.getElementById(id).textContent;
    }
    
    createShader(type, source, keywords) {
        source = this.addKeywords(source, keywords);
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    addKeywords(source, keywords) {
        if (!keywords) return source;
        
        let keywordsString = '';
        keywords.forEach(keyword => {
            keywordsString += '#define ' + keyword + '\n';
        });
        
        return keywordsString + source;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    getUniforms(program) {
        const uniforms = {};
        const uniformCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniformCount; i++) {
            const uniformName = this.gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = this.gl.getUniformLocation(program, uniformName);
        }
        
        return uniforms;
    }
    
    createShaderPrograms() {
        // Get vertex shader source
        const baseVertexSource = this.getShaderSource('base-vertex-shader');
        const baseVertexShader = this.createShader(this.gl.VERTEX_SHADER, baseVertexSource);
        
        // Get fragment shader sources
        const displayFragmentSource = this.getShaderSource('display-shader');
        const advectionFragmentSource = this.getShaderSource('advection-shader');
        const divergenceFragmentSource = this.getShaderSource('divergence-shader');
        const curlFragmentSource = this.getShaderSource('curl-shader');
        const vorticityFragmentSource = this.getShaderSource('vorticity-shader');
        const pressureFragmentSource = this.getShaderSource('pressure-shader');
        const gradientFragmentSource = this.getShaderSource('gradient-shader');
        const splatFragmentSource = this.getShaderSource('splat-shader');
        
        // Create fragment shaders
        const displayFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, displayFragmentSource);
        const splatFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, splatFragmentSource);
        const advectionFragmentShader = this.createShader(
            this.gl.FRAGMENT_SHADER, 
            advectionFragmentSource,
            this.ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
        );
        const divergenceFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, divergenceFragmentSource);
        const curlFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, curlFragmentSource);
        const vorticityFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, vorticityFragmentSource);
        const pressureFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, pressureFragmentSource);
        const gradientFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, gradientFragmentSource);
        
        // Create programs
        this.displayProgram = this.createProgramWithUniforms(baseVertexShader, displayFragmentShader);
        this.splatProgram = this.createProgramWithUniforms(baseVertexShader, splatFragmentShader);
        this.advectionProgram = this.createProgramWithUniforms(baseVertexShader, advectionFragmentShader);
        this.divergenceProgram = this.createProgramWithUniforms(baseVertexShader, divergenceFragmentShader);
        this.curlProgram = this.createProgramWithUniforms(baseVertexShader, curlFragmentShader);
        this.vorticityProgram = this.createProgramWithUniforms(baseVertexShader, vorticityFragmentShader);
        this.pressureProgram = this.createProgramWithUniforms(baseVertexShader, pressureFragmentShader);
        this.gradientProgram = this.createProgramWithUniforms(baseVertexShader, gradientFragmentShader);
    }
    
    createProgramWithUniforms(vertexShader, fragmentShader) {
        const program = this.createProgram(vertexShader, fragmentShader);
        return {
            program,
            uniforms: this.getUniforms(program),
            bind: () => this.gl.useProgram(program)
        };
    }
    
    initFramebuffers() {
        const simRes = this.getResolution(this.config.SIM_RESOLUTION);
        const dyeRes = this.getResolution(this.config.DYE_RESOLUTION);
        
        const texType = this.ext.halfFloatTexType;
        const rgba = this.ext.formatRGBA;
        const rg = this.ext.formatRG;
        const r = this.ext.formatR;
        const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;
        
        this.gl.disable(this.gl.BLEND);
        
        // Dye
        this.dye = null;
        this.dye = this.createDoubleFBO(
            dyeRes.width, 
            dyeRes.height, 
            rgba.internalFormat, 
            rgba.format, 
            texType, 
            filtering
        );
        
        // Velocity
        this.velocity = null;
        this.velocity = this.createDoubleFBO(
            simRes.width, 
            simRes.height, 
            rg.internalFormat, 
            rg.format, 
            texType, 
            filtering
        );
        
        // Divergence
        this.divergence = this.createFBO(
            simRes.width, 
            simRes.height, 
            r.internalFormat, 
            r.format, 
            texType, 
            this.gl.NEAREST
        );
        
        // Curl
        this.curl = this.createFBO(
            simRes.width, 
            simRes.height, 
            r.internalFormat, 
            r.format, 
            texType, 
            this.gl.NEAREST
        );
        
        // Pressure
        this.pressure = this.createDoubleFBO(
            simRes.width, 
            simRes.height, 
            r.internalFormat, 
            r.format, 
            texType, 
            this.gl.NEAREST
        );
    }
    
    createFBO(w, h, internalFormat, format, type, param) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, param);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, param);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
        
        const fbo = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
        this.gl.viewport(0, 0, w, h);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        return {
            texture,
            fbo,
            width: w,
            height: h,
            texelSizeX: 1.0 / w,
            texelSizeY: 1.0 / h,
            attach: id => {
                this.gl.activeTexture(this.gl.TEXTURE0 + id);
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                return id;
            }
        };
    }
    
    createDoubleFBO(w, h, internalFormat, format, type, param) {
        let fbo1 = this.createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = this.createFBO(w, h, internalFormat, format, type, param);
        
        return {
            width: w,
            height: h,
            texelSizeX: fbo1.texelSizeX,
            texelSizeY: fbo1.texelSizeY,
            get read() {
                return fbo1;
            },
            set read(value) {
                fbo1 = value;
            },
            get write() {
                return fbo2;
            },
            set write(value) {
                fbo2 = value;
            },
            swap() {
                const temp = fbo1;
                fbo1 = fbo2;
                fbo2 = temp;
            }
        };
    }
    
    updateKeywords() {
        const displayKeywords = [];
        if (this.config.SHADING) displayKeywords.push('SHADING');
        
        this.displayMaterial = this.createProgramWithUniforms(
            this.baseVertexShader,
            this.createShader(this.gl.FRAGMENT_SHADER, this.displayShaderSource, displayKeywords)
        );
    }
    
    initEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.onResize.bind(this));
    }
    
    onMouseDown(e) {
        const pointer = this.pointers[0];
        this.updatePointerDownData(pointer, -1, e.offsetX, e.offsetY);
        this.canvas.style.pointerEvents = 'none';
    }
    
    onMouseMove(e) {
        const pointer = this.pointers[0];
        // Always update pointer data regardless of mouse button state
        this.updatePointerMoveData(pointer, e.offsetX, e.offsetY);
    }
    
    onMouseUp() {
        const pointer = this.pointers[0];
        pointer.down = false;
        this.canvas.style.pointerEvents = 'auto';
    }
    
    onTouchStart(e) {
        e.preventDefault();
        const touches = e.targetTouches;
        
        for (let i = 0; i < touches.length; i++) {
            if (i >= this.pointers.length) {
                this.pointers.push(new Pointer());
            }
            
            const pointer = this.pointers[i];
            const touch = touches[i];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            this.updatePointerDownData(pointer, touch.identifier, x, y);
        }
    }
    
    onTouchMove(e) {
        e.preventDefault();
        const touches = e.targetTouches;
        
        for (let i = 0; i < touches.length; i++) {
            const pointer = this.pointers[i];
            const touch = touches[i];
            
            if (pointer.id === touch.identifier) {
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                this.updatePointerMoveData(pointer, x, y);
            }
        }
    }
    
    onTouchEnd(e) {
        const touches = e.changedTouches;
        
        for (let i = 0; i < touches.length; i++) {
            const pointer = this.pointers.find(p => p.id === touches[i].identifier);
            if (pointer) {
                pointer.down = false;
            }
        }
    }
    
    onResize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.initFramebuffers();
    }
    
    updatePointerDownData(pointer, id, x, y) {
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = x / this.canvas.width;
        pointer.texcoordY = 1.0 - y / this.canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.color = this.generateColor();
        
        // Create an initial splat
        this.splat(pointer.texcoordX, pointer.texcoordY, pointer.deltaX, pointer.deltaY, pointer.color);
    }
    
    updatePointerMoveData(pointer, x, y) {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = x / this.canvas.width;
        pointer.texcoordY = 1.0 - y / this.canvas.height;
        pointer.deltaX = this.correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
        pointer.deltaY = this.correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }
    
    correctDeltaX(delta) {
        const aspectRatio = this.canvas.width / this.canvas.height;
        if (aspectRatio < 1) delta *= aspectRatio;
        return delta;
    }
    
    correctDeltaY(delta) {
        const aspectRatio = this.canvas.width / this.canvas.height;
        if (aspectRatio > 1) delta /= aspectRatio;
        return delta;
    }
    
    generateColor() {
        const c = HSVtoRGB(Math.random(), 1.0, 1.0);
        // Increase color intensity
        c.r *= 0.5;
        c.g *= 0.5;
        c.b *= 0.5;
        return c;
    }
    
    splat(x, y, dx, dy, color) {
        console.log(`Creating splat at (${x}, ${y}) with delta (${dx}, ${dy}) and color (${color.r}, ${color.g}, ${color.b})`);
        
        try {
            this.splatProgram.bind();
            
            // Velocity splat
            this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
            this.gl.uniform1f(this.splatProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
            this.gl.uniform2f(this.splatProgram.uniforms.point, x, y);
            this.gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0.0);
            
            const radius = this.correctRadius(this.config.SPLAT_RADIUS / 100.0);
            console.log(`Splat radius: ${radius}`);
            this.gl.uniform1f(this.splatProgram.uniforms.radius, radius);
            
            this.blit(this.velocity.write);
            this.velocity.swap();
            
            // Color splat
            this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.dye.read.attach(0));
            this.gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
            this.blit(this.dye.write);
            this.dye.swap();
            
            console.log('Splat created successfully');
        } catch (error) {
            console.error('Error creating splat:', error);
        }
    }
    
    correctRadius(radius) {
        const aspectRatio = this.canvas.width / this.canvas.height;
        if (aspectRatio > 1) {
            radius *= aspectRatio;
        }
        return radius;
    }
    
    getResolution(resolution) {
        let aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
        if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
        
        let min = Math.round(resolution);
        let max = Math.round(resolution * aspectRatio);
        
        if (this.gl.drawingBufferWidth > this.gl.drawingBufferHeight) {
            return { width: max, height: min };
        } else {
            return { width: min, height: max };
        }
    }
    
    blit(target) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.fbo);
        this.gl.viewport(0, 0, target.width, target.height);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    }
    
    render(target) {
        if (target == null) {
            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        } else {
            this.gl.viewport(0, 0, target.width, target.height);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.fbo);
        }
        
        this.displayProgram.bind();
        if (this.config.SHADING) {
            this.gl.uniform2f(
                this.displayProgram.uniforms.texelSize, 
                1.0 / this.gl.drawingBufferWidth, 
                1.0 / this.gl.drawingBufferHeight
            );
        }
        this.gl.uniform1i(this.displayProgram.uniforms.uTexture, this.dye.read.attach(0));
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    }
    
    update() {
        const dt = this.calcDeltaTime();
        if (this.resizeCanvas()) {
            this.initFramebuffers();
        }
        
        this.updateColors(dt);
        this.applyInputs();
        this.step(dt);
        this.render(null);
        requestAnimationFrame(this.update.bind(this));
    }
    
    calcDeltaTime() {
        const now = Date.now();
        let dt = (now - this.lastTime) / 1000;
        dt = Math.min(dt, 0.016666);
        this.lastTime = now;
        return dt;
    }
    
    resizeCanvas() {
        const width = this.scaleByPixelRatio(this.canvas.clientWidth);
        const height = this.scaleByPixelRatio(this.canvas.clientHeight);
        
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            return true;
        }
        
        return false;
    }
    
    updateColors(dt) {
        this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED;
        if (this.colorUpdateTimer >= 1) {
            this.colorUpdateTimer = 0;
            this.pointers.forEach(p => {
                p.color = this.generateColor();
            });
        }
    }
    
    applyInputs() {
        this.pointers.forEach(pointer => {
            if (pointer.moved) {
                pointer.moved = false;
                this.splat(
                    pointer.texcoordX, 
                    pointer.texcoordY, 
                    pointer.deltaX * this.config.SPLAT_FORCE, 
                    pointer.deltaY * this.config.SPLAT_FORCE, 
                    pointer.color
                );
            }
        });
    }
    
    step(dt) {
        this.gl.disable(this.gl.BLEND);
        
        // Curl
        this.curlProgram.bind();
        this.gl.uniform2f(this.curlProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
        this.gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.blit(this.curl);
        
        // Vorticity
        this.vorticityProgram.bind();
        this.gl.uniform2f(
            this.vorticityProgram.uniforms.texelSize, 
            this.velocity.texelSizeX, 
            this.velocity.texelSizeY
        );
        this.gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl.attach(1));
        this.gl.uniform1f(this.vorticityProgram.uniforms.curl, this.config.CURL);
        this.gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
        this.blit(this.velocity.write);
        this.velocity.swap();
        
        // Divergence
        this.divergenceProgram.bind();
        this.gl.uniform2f(
            this.divergenceProgram.uniforms.texelSize, 
            this.velocity.texelSizeX, 
            this.velocity.texelSizeY
        );
        this.gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.blit(this.divergence);
        
        // Clear pressure
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pressure.write.fbo);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Pressure
        this.pressureProgram.bind();
        this.gl.uniform2f(
            this.pressureProgram.uniforms.texelSize, 
            this.velocity.texelSizeX, 
            this.velocity.texelSizeY
        );
        this.gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
        
        for (let i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
            this.gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressure.read.attach(1));
            this.blit(this.pressure.write);
            this.pressure.swap();
        }
        
        // Gradient
        this.gradientProgram.bind();
        this.gl.uniform2f(
            this.gradientProgram.uniforms.texelSize, 
            this.velocity.texelSizeX, 
            this.velocity.texelSizeY
        );
        this.gl.uniform1i(this.gradientProgram.uniforms.uPressure, this.pressure.read.attach(0));
        this.gl.uniform1i(this.gradientProgram.uniforms.uVelocity, this.velocity.read.attach(1));
        this.blit(this.velocity.write);
        this.velocity.swap();
        
        // Advection
        this.advectionProgram.bind();
        this.gl.uniform2f(
            this.advectionProgram.uniforms.texelSize, 
            this.velocity.texelSizeX, 
            this.velocity.texelSizeY
        );
        
        if (!this.ext.supportLinearFiltering) {
            this.gl.uniform2f(
                this.advectionProgram.uniforms.dyeTexelSize, 
                this.velocity.texelSizeX, 
                this.velocity.texelSizeY
            );
        }
        
        const velocityId = this.velocity.read.attach(0);
        this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId);
        this.gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId);
        this.gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
        this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.VELOCITY_DISSIPATION);
        this.blit(this.velocity.write);
        this.velocity.swap();
        
        if (!this.ext.supportLinearFiltering) {
            this.gl.uniform2f(
                this.advectionProgram.uniforms.dyeTexelSize, 
                this.dye.texelSizeX, 
                this.dye.texelSizeY
            );
        }
        
        this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.dye.read.attach(1));
        this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.DENSITY_DISSIPATION);
        this.blit(this.dye.write);
        this.dye.swap();
    }
    
    scaleByPixelRatio(input) {
        const pixelRatio = window.devicePixelRatio || 1;
        return Math.floor(input * pixelRatio);
    }
    
    animate() {
        this.update();
    }
    
    reset() {
        this.initFramebuffers();
    }
    
    updateConfig(config) {
        Object.assign(this.config, config);
        
        if (!this.ext.supportLinearFiltering) {
            this.config.DYE_RESOLUTION = Math.min(this.config.DYE_RESOLUTION, 512);
            this.config.SHADING = false;
        }
        
        this.initFramebuffers();
    }
}

// Pointer class for tracking mouse/touch positions
class Pointer {
    constructor() {
        this.id = -1;
        this.texcoordX = 0;
        this.texcoordY = 0;
        this.prevTexcoordX = 0;
        this.prevTexcoordY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.down = false;
        this.moved = false;
        this.color = { r: 0, g: 0, b: 0 };
    }
}

// Helper function to convert HSV to RGB
function HSVtoRGB(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return { r, g, b };
}
