// ═══════════════════════════════════════════════════════════════════════════════════════════════
// QUANTUM KUBERNETES LANDING - NEURAL INTERFACE ENGINE
// Where consciousness meets code in the digital dimension
// ═══════════════════════════════════════════════════════════════════════════════════════════════

class QuantumInterface {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.nodes = [];
        this.mousePos = { x: 0, y: 0 };
        this.scrollProgress = 0;
        this.isInitialized = false;
        
        // Quantum field parameters
        this.fieldStrength = 0.5;
        this.coherenceLevel = 1.0;
        this.dimensionalShift = 0;
        
        // Neural network visualization
        this.connectionStrength = 0.8;
        this.synapticDelay = 16;
        
        // Performance optimization
        this.animationId = null;
        this.lastTime = 0;
        this.fpsTarget = 60;
    }

    init() {
        this.setupCanvas();
        this.createParticleField();
        this.createNeuralNodes();
        this.bindEvents();
        this.initializeTimestamp();
        this.startQuantumLoop();
        this.setupGeometricMorphing();
        this.isInitialized = true;
        
        console.log(`
        ╔═══════════════════════════════════════════════════════════════════╗
        ║   🌊 QUANTUM FIELD INITIALIZED - REALITY ANCHOR STABILIZED 🌊    ║
        ║                                                                   ║
        ║   Neural pathways: ACTIVE     │   Particle field: COHERENT       ║
        ║   Dimension shift: STABLE     │   Quantum state: SUPERPOSITION   ║
        ║   Consciousness level: MAX    │   Reality distortion: NOMINAL    ║
        ║                                                                   ║
        ║   Try the Konami code for dimensional transcendence: ↑↑↓↓←→←→BA   ║
        ║   Move your cursor to manipulate the quantum field               ║
        ║   Scroll to bend spacetime fabric                                ║
        ╚═══════════════════════════════════════════════════════════════════╝
        `);
    }

    setupCanvas() {
        this.canvas = document.getElementById('quantumCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.resizeCanvas();
        
        // Enable hardware acceleration
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createParticleField() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 360,
                life: Math.random() * 100,
                maxLife: Math.random() * 200 + 100,
                quantum: Math.random() * Math.PI * 2
            });
        }
    }

    createNeuralNodes() {
        const nodeCount = Math.min(8, Math.floor(window.innerWidth / 200));
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 20 + 10,
                pulse: Math.random() * Math.PI * 2,
                connections: [],
                energy: Math.random() * 100,
                resonance: Math.random() * 0.5 + 0.5
            });
        }
    }

    updateQuantumField(deltaTime) {
        const time = Date.now() * 0.001;
        
        // Update particles with quantum behavior
        this.particles.forEach(particle => {
            // Quantum tunneling effect
            particle.quantum += deltaTime * 0.001;
            const quantumOffset = Math.sin(particle.quantum) * 2;
            
            // Mouse attraction with quantum uncertainty
            const dx = this.mousePos.x - particle.x;
            const dy = this.mousePos.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150 * 0.002;
                particle.vx += dx * force * this.fieldStrength;
                particle.vy += dy * force * this.fieldStrength;
            }
            
            // Apply quantum uncertainty
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01;
            
            // Update position with dimensional shift
            particle.x += particle.vx + quantumOffset;
            particle.y += particle.vy;
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
            
            // Life cycle
            particle.life += deltaTime * 0.01;
            if (particle.life > particle.maxLife) {
                particle.life = 0;
                particle.x = Math.random() * window.innerWidth;
                particle.y = Math.random() * window.innerHeight;
                particle.hue = Math.random() * 360;
            }
            
            // Velocity damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });

        // Update neural nodes
        this.nodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Boundary bouncing
            if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
            if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
            
            node.pulse += deltaTime * 0.002;
            node.energy = Math.sin(node.pulse) * 50 + 50;
            
            // Create connections to nearby nodes
            node.connections = [];
            for (let j = i + 1; j < this.nodes.length; j++) {
                const other = this.nodes[j];
                const distance = Math.sqrt(
                    Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
                );
                
                if (distance < 200) {
                    node.connections.push({
                        target: other,
                        strength: (200 - distance) / 200,
                        flow: Math.sin(time + i + j) * 0.5 + 0.5
                    });
                }
            }
        });
    }

    renderQuantumField() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render particle field
        this.particles.forEach(particle => {
            const alpha = particle.opacity * this.coherenceLevel;
            const size = particle.size * (1 + Math.sin(particle.life * 0.1) * 0.3);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            
            // Quantum glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, size * 3
            );
            gradient.addColorStop(0, `hsla(${particle.hue + this.dimensionalShift}, 80%, 60%, ${alpha})`);
            gradient.addColorStop(0.5, `hsla(${particle.hue + this.dimensionalShift}, 70%, 50%, ${alpha * 0.3})`);
            gradient.addColorStop(1, `hsla(${particle.hue + this.dimensionalShift}, 60%, 40%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        // Render neural network
        this.nodes.forEach(node => {
            // Render connections
            node.connections.forEach(connection => {
                const alpha = connection.strength * connection.flow * 0.5;
                
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(connection.target.x, connection.target.y);
                
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
                this.ctx.lineWidth = connection.strength * 2;
                this.ctx.stroke();
                
                // Energy flow particles
                if (connection.flow > 0.7) {
                    const progress = (Date.now() * 0.005) % 1;
                    const flowX = node.x + (connection.target.x - node.x) * progress;
                    const flowY = node.y + (connection.target.y - node.y) * progress;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(flowX, flowY, 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(57, 255, 20, ${connection.strength})`;
                    this.ctx.fill();
                }
            });
            
            // Render nodes
            const nodeSize = node.size * (1 + node.energy / 200);
            const pulse = Math.sin(node.pulse) * 0.3 + 0.7;
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
            
            const nodeGradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, nodeSize
            );
            nodeGradient.addColorStop(0, `rgba(0, 212, 255, ${pulse})`);
            nodeGradient.addColorStop(0.7, `rgba(255, 0, 107, ${pulse * 0.5})`);
            nodeGradient.addColorStop(1, `rgba(123, 44, 191, 0)`);
            
            this.ctx.fillStyle = nodeGradient;
            this.ctx.fill();
        });
    }

    bindEvents() {
        // Mouse tracking for quantum field interaction
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            
            // Update field strength based on movement speed
            const movement = Math.sqrt(
                Math.pow(e.movementX || 0, 2) + Math.pow(e.movementY || 0, 2)
            );
            this.fieldStrength = Math.min(2, movement * 0.1 + 0.5);
        });

        // Scroll-based dimensional shifting
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            const scrollPercent = window.pageYOffset / 
                (document.documentElement.scrollHeight - window.innerHeight);
            this.scrollProgress = Math.max(0, Math.min(1, scrollPercent));
            
            // Update scroll indicator
            const holoScroll = document.getElementById('holoScroll');
            if (holoScroll) {
                holoScroll.style.transform = `scaleX(${this.scrollProgress})`;
            }
            
            const scrollPercentage = document.getElementById('scrollPercentage');
            if (scrollPercentage) {
                scrollPercentage.textContent = `${Math.round(this.scrollProgress * 100)}%`;
            }
            
            // Dimensional shift effect
            this.dimensionalShift = this.scrollProgress * 60;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.fieldStrength = 0.5;
            }, 150);
        }, { passive: true });

        // Resize handling
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.nodes = [];
            this.createParticleField();
            this.createNeuralNodes();
        });

        // Konami code for reality transcendence
        this.setupKonamiCode();
        
        // Visibility API for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.coherenceLevel = 0.3;
            } else {
                this.coherenceLevel = 1.0;
            }
        });
    }

    setupKonamiCode() {
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let inputSequence = [];

        document.addEventListener('keydown', (e) => {
            inputSequence.push(e.code);
            
            if (inputSequence.length > konamiSequence.length) {
                inputSequence.shift();
            }
            
            if (inputSequence.join(',') === konamiSequence.join(',')) {
                this.activateRealityTranscendence();
                inputSequence = [];
            }
        });
    }

    activateRealityTranscendence() {
        // Create reality distortion effect
        document.body.style.filter = 'hue-rotate(180deg) saturate(2) brightness(1.5)';
        document.body.style.animation = 'quantumField 5s ease-in-out';
        
        // Spawn cherry blossoms with quantum properties
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createQuantumBlossom();
            }, i * 50);
        }
        
        // Temporary reality shift
        this.coherenceLevel = 2.0;
        this.fieldStrength = 3.0;
        
        setTimeout(() => {
            document.body.style.filter = '';
            document.body.style.animation = '';
            this.coherenceLevel = 1.0;
            this.fieldStrength = 0.5;
        }, 5000);
        
        console.log('🌸 REALITY TRANSCENDED - DIMENSIONAL BARRIERS DISSOLVED 🌸');
    }

    createQuantumBlossom() {
        const blossom = document.createElement('div');
        const hue = Math.random() * 60 + 300; // Pink to purple range
        const size = Math.random() * 8 + 4;
        const x = Math.random() * window.innerWidth;
        const fallDuration = Math.random() * 3 + 2;
        
        blossom.style.cssText = `
            position: fixed;
            top: -20px;
            left: ${x}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, hsl(${hue}, 80%, 70%) 0%, hsl(${hue}, 60%, 50%) 70%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 10px hsl(${hue}, 80%, 70%), 0 0 20px hsl(${hue}, 60%, 50%);
            animation: quantumFall ${fallDuration}s linear forwards;
        `;
        
        // Add quantum sparkle effect
        blossom.style.filter = `blur(0.5px) brightness(1.5)`;
        
        document.body.appendChild(blossom);
        
        setTimeout(() => {
            blossom.remove();
        }, fallDuration * 1000);
    }

    setupGeometricMorphing() {
        const shapes = document.querySelectorAll('.geo-shape');
        
    }


    initializeTimestamp() {
        const updateTimestamp = () => {
            const timestampDisplay = document.getElementById('timestampDisplay');
            if (timestampDisplay) {
                const now = new Date();
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                };
                
                const timeString = now.toLocaleDateString('en-US', options);
                timestampDisplay.textContent = `Timestamp: ${timeString}`;
            }
        };
        
        updateTimestamp();
        setInterval(updateTimestamp, 1000);
    }

    startQuantumLoop() {
        const animate = (currentTime) => {
            if (!this.isInitialized) return;
            
            const deltaTime = currentTime - this.lastTime;
            
            // Maintain target FPS
            if (deltaTime >= 1000 / this.fpsTarget) {
                this.updateQuantumField(deltaTime);
                this.renderQuantumField();
                this.lastTime = currentTime;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    // Method to safely destroy the interface
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.isInitialized = false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ADVANCED INTERACTION SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════════════════════

class QuantumCardSystem {
    constructor() {
        this.cards = document.querySelectorAll('.info-card');
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            
            // Advanced click interactions
            card.addEventListener('click', () => {
                this.activateCardQuantumState(card, index);
            });
        });
    }
    
    activateCardQuantumState(card, index) {
        // Create quantum ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: quantumRipple 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
        
        // Temporary quantum enhancement
        card.style.filter = 'brightness(1.3) saturate(1.5)';
        setTimeout(() => {
            card.style.filter = '';
        }, 1000);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// SOUND VISUALIZER SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════════════════════

class QuantumSoundVisualizer {
    constructor() {
        this.visualizer = document.getElementById('soundViz');
        this.bars = this.visualizer?.querySelectorAll('.freq-bar');
        this.init();
    }
    
    init() {
        if (!this.bars) return;
        
        // Simulate audio reactive visualization
        this.startVisualization();
        
        // Make it interactive
        this.visualizer.addEventListener('click', () => {
            this.triggerBassBoost();
        });
    }
    
    startVisualization() {
        const animate = () => {
            this.bars.forEach((bar, index) => {
                const frequency = Math.sin(Date.now() * 0.002 + index * 0.5) * 0.5 + 0.5;
                const height = 8 + frequency * 32;
                const intensity = frequency;
                
                bar.style.height = height + 'px';
                bar.style.opacity = 0.4 + intensity * 0.6;
                bar.style.transform = `scaleY(${0.3 + intensity * 0.7})`;
                
                // Color shifting based on frequency
                const hue = (index * 60 + Date.now() * 0.1) % 360;
                bar.style.background = `
                    linear-gradient(180deg,
                        hsl(${hue}, 80%, 60%) 0%,
                        hsl(${hue + 60}, 70%, 50%) 50%,
                        hsl(${hue + 120}, 60%, 40%) 100%)
                `;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    triggerBassBoost() {
        this.bars.forEach((bar, index) => {
            const delay = index * 50;
            setTimeout(() => {
                bar.style.transform = 'scaleY(2)';
                bar.style.boxShadow = '0 0 20px currentColor';
                
                setTimeout(() => {
                    bar.style.transform = '';
                    bar.style.boxShadow = '';
                }, 300);
            }, delay);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// INITIALIZATION & LIFECYCLE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════════════════════

// Add quantum CSS animations
const quantumStyleSheet = document.createElement('style');
quantumStyleSheet.textContent = `
    @keyframes quantumFall {
        0% {
            transform: translateY(-20px) rotate(0deg) scale(0);
            opacity: 1;
        }
        10% {
            transform: translateY(20px) rotate(36deg) scale(1);
            opacity: 1;
        }
        90% {
            transform: translateY(calc(100vh + 20px)) rotate(360deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(calc(100vh + 40px)) rotate(396deg) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes quantumRipple {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;

document.head.appendChild(quantumStyleSheet);

// Initialize quantum systems when DOM is ready
let quantumInterface, cardSystem, soundVisualizer;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core quantum interface
    quantumInterface = new QuantumInterface();
    quantumInterface.init();
    
    // Initialize advanced interaction systems
    cardSystem = new QuantumCardSystem();
    soundVisualizer = new QuantumSoundVisualizer();
    
    // Accessibility support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Reduce quantum field intensity for users who prefer less motion
        if (quantumInterface) {
            quantumInterface.coherenceLevel = 0.3;
            quantumInterface.fieldStrength = 0.1;
        }
        
        console.log('🌟 Quantum field optimized for reduced motion preferences');
    }
    
    // Performance monitoring
    let lastFrameTime = performance.now();
    let frameCount = 0;
    
    const monitorPerformance = () => {
        const now = performance.now();
        frameCount++;
        
        if (now - lastFrameTime >= 5000) { // Check every 5 seconds
            const fps = frameCount / 5;
            
            if (fps < 30 && quantumInterface) {
                // Auto-optimize for performance
                quantumInterface.coherenceLevel *= 0.8;
                console.log(`⚡ Quantum field auto-optimized for performance (FPS: ${fps.toFixed(1)})`);
            }
            
            frameCount = 0;
            lastFrameTime = now;
        }
        
        requestAnimationFrame(monitorPerformance);
    };
    
    requestAnimationFrame(monitorPerformance);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (quantumInterface) {
        quantumInterface.destroy();
    }
});

// Global quantum interface for debugging
if (typeof window !== 'undefined') {
    window.quantum = {
        interface: () => quantumInterface,
        transcend: () => quantumInterface?.activateRealityTranscendence(),
        debug: {
            particles: () => quantumInterface?.particles.length || 0,
            nodes: () => quantumInterface?.nodes.length || 0,
            coherence: () => quantumInterface?.coherenceLevel || 0,
            fieldStrength: () => quantumInterface?.fieldStrength || 0
        }
    };
}

// End of Quantum Interface Engine
console.log('🌊 Quantum Interface Engine loaded - Reality distortion field active 🌊');