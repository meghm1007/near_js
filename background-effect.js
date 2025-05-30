/**
 * Three.js background effect for the Higher Lower game
 * Creates a crypto-themed particle background
 */

export class BackgroundEffect {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.initialized = false;
    this.container = null;
    this.THREE = null;
    
    // Load Three.js from CDN
    this.loadThreeJs();
  }
  
  async loadThreeJs() {
    try {
      return new Promise((resolve) => {
        // Check if Three.js is already loaded
        if (window.THREE) {
          this.THREE = window.THREE;
          this.initialize();
          resolve();
          return;
        }
        
        // Load Three.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
          if (window.THREE) {
            this.THREE = window.THREE;
            this.initialize();
            resolve();
          } else {
            console.error('Three.js loaded but not available as window.THREE');
            resolve();
          }
        };
        script.onerror = () => {
          console.error('Failed to load Three.js');
          resolve();
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Error loading Three.js:', error);
    }
  }
  
  initialize() {
    if (!this.THREE) {
      console.error('Three.js not available');
      return;
    }
    
    try {
      // Create container
      this.container = document.createElement('div');
      this.container.id = 'background-canvas';
      document.body.prepend(this.container);
      
      // Set container style
      Object.assign(this.container.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      });
      
      // Create scene
      this.scene = new this.THREE.Scene();
      
      // Create camera
      this.camera = new this.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 30;
      
      // Create renderer
      this.renderer = new this.THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x0a0a1a, 1);
      this.container.appendChild(this.renderer.domElement);
      
      // Create particles
      this.createParticles();
      
      // Add resize event listener
      window.addEventListener('resize', () => this.onWindowResize());
      
      // Start animation
      this.animate();
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing background effect:', error);
    }
  }
  
  createParticles() {
    const THREE = this.THREE;
    if (!THREE) return;
    
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const types = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x3498db); // Blue
    const color2 = new THREE.Color(0x1abc9c); // Teal
    const color3 = new THREE.Color(0xf1c40f); // Yellow
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Size
      sizes[i] = Math.random() * 0.5 + 0.1;
      
      // Color
      const colorChoice = Math.random();
      let color;
      
      if (colorChoice < 0.33) {
        color = color1;
      } else if (colorChoice < 0.66) {
        color = color2;
      } else {
        color = color3;
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Type (for animation)
      types[i] = Math.floor(Math.random() * 3);
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('type', new THREE.BufferAttribute(types, 1));
    
    // Create shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        pointTexture: { value: this.createParticleTexture(THREE) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float type;
        
        varying vec3 vColor;
        
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Different movement based on particle type
          vec3 pos = position;
          
          if (type < 1.0) {
            // Type 0: Gentle floating
            pos.y += sin(time * 0.2 + position.x * 0.5) * 0.5;
            pos.x += cos(time * 0.2 + position.y * 0.5) * 0.5;
          } else if (type < 2.0) {
            // Type 1: Circular motion
            float angle = time * 0.1 + position.z * 0.05;
            pos.x += sin(angle) * 0.3;
            pos.z += cos(angle) * 0.3;
          } else {
            // Type 2: Pulsating
            pos.x += sin(time * 0.3 + position.z) * 0.2;
            pos.z += cos(time * 0.2 + position.x) * 0.2;
            pos.y += sin(time * 0.3 + position.y) * 0.2;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        uniform sampler2D pointTexture;
        
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
          if (gl_FragColor.a < 0.3) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    
    this.particles = new THREE.Points(particles, shaderMaterial);
    this.scene.add(this.particles);
    
    // Add some crypto symbols
    this.addCryptoSymbols(THREE);
  }
  
  createParticleTexture(THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(240,240,240,0.8)');
    gradient.addColorStop(0.4, 'rgba(200,200,200,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  
  addCryptoSymbols(THREE) {
    const symbols = [
      { symbol: 'Ⓝ', color: 0x5dabfc }, // NEAR symbol
      { symbol: '₿', color: 0xf7931a }, // Bitcoin
      { symbol: 'Ξ', color: 0x627eea }  // Ethereum
    ];
    
    const loader = new THREE.FontLoader();
    
    // Use a default THREE.js font as we can't load external fonts without fetch
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      
      // Create a simple mesh for each symbol
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: symbol.color,
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position randomly
      mesh.position.x = (Math.random() - 0.5) * 80;
      mesh.position.y = (Math.random() - 0.5) * 80;
      mesh.position.z = (Math.random() - 0.5) * 80;
      
      this.scene.add(mesh);
      
      // Animate
      const speed = 0.2 + Math.random() * 0.3;
      const distance = 5 + Math.random() * 5;
      const startY = mesh.position.y;
      
      // Store animation data
      mesh.userData = {
        startY,
        speed,
        distance,
        time: Math.random() * Math.PI * 2
      };
    }
  }
  
  onWindowResize() {
    if (!this.THREE) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (!this.initialized) return;
    
    const time = performance.now() * 0.001;
    
    // Update particle animation
    if (this.particles && this.particles.material.uniforms) {
      this.particles.material.uniforms.time.value = time;
    }
    
    // Rotate the entire scene slightly
    if (this.scene) {
      this.scene.rotation.y = time * 0.05;
    }
    
    // Animate crypto symbols
    if (this.scene) {
      this.scene.children.forEach(child => {
        if (child.userData && child.userData.startY !== undefined) {
          const { startY, speed, distance, time: startTime } = child.userData;
          child.position.y = startY + Math.sin(time * speed + startTime) * distance;
          child.rotation.y += 0.01;
          child.rotation.z += 0.005;
        }
      });
    }
    
    // Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  // Method to respond to correct/incorrect guesses
  triggerEffect(correct) {
    if (!this.initialized) return;
    
    const THREE = this.THREE;
    
    // Create a flash effect
    const color = correct ? 0x2ecc71 : 0xe74c3c;
    const flash = new THREE.AmbientLight(color, 2);
    this.scene.add(flash);
    
    // Remove the flash after a short time
    setTimeout(() => {
      this.scene.remove(flash);
    }, 300);
  }
} 