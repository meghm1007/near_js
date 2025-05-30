/**
 * Card Effect - Creates 3D interactive cards for the Higher Lower game
 */

export class CardEffect {
  constructor() {
    this.cards = [];
    this.initialized = false;
    this.THREE = null;
    this.loadThreeJs();
  }
  
  async loadThreeJs() {
    try {
      // Check if Three.js is already loaded
      if (window.THREE) {
        this.THREE = window.THREE;
        this.initialize();
        return;
      }
      
      // Wait for Three.js to be loaded
      const checkInterval = setInterval(() => {
        if (window.THREE) {
          this.THREE = window.THREE;
          clearInterval(checkInterval);
          this.initialize();
        }
      }, 100);
      
      // Set a timeout to stop checking after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!this.initialized) {
          console.warn('Three.js not loaded after waiting. Card effects will be limited.');
          // Initialize basic effects without Three.js
          this.initializeBasic();
        }
      }, 5000);
    } catch (error) {
      console.error('Error loading Three.js:', error);
      this.initializeBasic();
    }
  }
  
  initializeBasic() {
    // Initialize cards with basic effects
    const cardElements = document.querySelectorAll('.term-card');
    cardElements.forEach(card => this.setupCardBasic(card));
    this.initialized = true;
  }
  
  setupCardBasic(cardElement) {
    // Add crypto styling to cards
    this.addCryptoStyling(cardElement);
    
    // Add basic hover animation
    cardElement.addEventListener('mouseenter', () => {
      cardElement.style.transform = 'translateY(-10px)';
      cardElement.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(93, 171, 252, 0.3)';
    });
    
    cardElement.addEventListener('mouseleave', () => {
      cardElement.style.transform = 'translateY(0)';
      cardElement.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(93, 171, 252, 0.2)';
    });
    
    this.cards.push(cardElement);
  }
  
  initialize() {
    if (!this.THREE) {
      console.error('Three.js not available');
      this.initializeBasic();
      return;
    }
    
    try {
      this.initialized = true;
      
      // Initialize cards
      const cardElements = document.querySelectorAll('.term-card');
      cardElements.forEach(card => this.setupCard(card));
    } catch (error) {
      console.error('Error initializing card effects:', error);
      this.initializeBasic();
    }
  }
  
  setupCard(cardElement) {
    // Add crypto styling to cards
    this.addCryptoStyling(cardElement);
    
    // Add hover animation
    cardElement.addEventListener('mouseenter', () => {
      this.animateCard(cardElement, true);
    });
    
    cardElement.addEventListener('mouseleave', () => {
      this.animateCard(cardElement, false);
    });
    
    // Add mousemove effect for 3D tilt
    cardElement.addEventListener('mousemove', (e) => {
      this.tiltCard(cardElement, e);
    });
    
    this.cards.push(cardElement);
  }
  
  addCryptoStyling(cardElement) {
    // Add a subtle gradient background
    cardElement.style.background = 'linear-gradient(135deg, #1a2b47 0%, #0a1525 100%)';
    cardElement.style.border = '2px solid rgba(125, 180, 240, 0.3)';
    cardElement.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(93, 171, 252, 0.2)';
    cardElement.style.transition = 'all 0.3s ease';
    cardElement.style.borderRadius = '12px';
    cardElement.style.overflow = 'hidden';
    
    // Add a subtle crypto grid pattern
    const gridOverlay = document.createElement('div');
    gridOverlay.style.position = 'absolute';
    gridOverlay.style.top = '0';
    gridOverlay.style.left = '0';
    gridOverlay.style.right = '0';
    gridOverlay.style.bottom = '0';
    gridOverlay.style.backgroundImage = `
      radial-gradient(circle at 10px 10px, rgba(93, 171, 252, 0.15) 2px, transparent 0),
      linear-gradient(to right, rgba(93, 171, 252, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(93, 171, 252, 0.08) 1px, transparent 1px)
    `;
    gridOverlay.style.backgroundSize = '20px 20px, 20px 20px, 20px 20px';
    gridOverlay.style.pointerEvents = 'none';
    gridOverlay.style.zIndex = '0';
    
    // Add a crypto glow
    const glowEffect = document.createElement('div');
    glowEffect.className = 'card-glow';
    glowEffect.style.position = 'absolute';
    glowEffect.style.top = '0';
    glowEffect.style.left = '0';
    glowEffect.style.right = '0';
    glowEffect.style.bottom = '0';
    glowEffect.style.opacity = '0';
    glowEffect.style.transition = 'opacity 0.5s ease';
    glowEffect.style.boxShadow = 'inset 0 0 40px rgba(93, 171, 252, 0.5)';
    glowEffect.style.borderRadius = '12px';
    glowEffect.style.pointerEvents = 'none';
    glowEffect.style.zIndex = '0';
    
    // Create a relative positioned container for the card content
    const cardBody = cardElement.querySelector('.card-body');
    if (cardBody) {
      cardBody.style.position = 'relative';
      cardBody.style.zIndex = '1';
      cardBody.style.color = 'white';
      cardBody.style.padding = '25px';
      
      // Add cryptocurrency symbols as backgrounds
      const symbolOverlay = document.createElement('div');
      symbolOverlay.style.position = 'absolute';
      symbolOverlay.style.top = '50%';
      symbolOverlay.style.left = '50%';
      symbolOverlay.style.transform = 'translate(-50%, -50%)';
      symbolOverlay.style.fontSize = '150px';
      symbolOverlay.style.opacity = '0.05';
      symbolOverlay.style.color = 'white';
      symbolOverlay.style.pointerEvents = 'none';
      symbolOverlay.style.zIndex = '0';
      
      const symbols = ['Ⓝ', '₿', 'Ξ', '◎', '⟠', '₳', '⚡'];
      symbolOverlay.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      
      cardBody.prepend(symbolOverlay);
      
      // Style text elements inside card
      const title = cardBody.querySelector('h3');
      if (title) {
        title.style.position = 'relative';
        title.style.zIndex = '2';
      }
      
      const searches = cardBody.querySelector('h2');
      if (searches) {
        searches.style.position = 'relative';
        searches.style.zIndex = '2';
        searches.style.fontSize = '2.5rem';
      }
    }
    
    // Insert the grid and glow
    cardElement.style.position = 'relative';
    cardElement.prepend(gridOverlay);
    cardElement.prepend(glowEffect);
    
    // Add a shine effect
    const shineEffect = document.createElement('div');
    shineEffect.className = 'card-shine';
    shineEffect.style.position = 'absolute';
    shineEffect.style.top = '-100%';
    shineEffect.style.right = '-100%';
    shineEffect.style.bottom = '-100%';
    shineEffect.style.left = '-100%';
    shineEffect.style.transform = 'translateY(100%)';
    shineEffect.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)';
    shineEffect.style.pointerEvents = 'none';
    shineEffect.style.zIndex = '2';
    
    cardElement.prepend(shineEffect);
  }
  
  animateCard(cardElement, isHovering) {
    if (isHovering) {
      cardElement.style.transform = 'translateY(-15px) scale(1.05)';
      cardElement.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(93, 171, 252, 0.4)';
      
      // Activate glow
      const glow = cardElement.querySelector('.card-glow');
      if (glow) glow.style.opacity = '1';
      
      // Trigger shine animation
      const shine = cardElement.querySelector('.card-shine');
      if (shine) {
        shine.style.transition = 'transform 0.7s ease-in-out';
        shine.style.transform = 'translateY(-100%)';
        
        // Reset shine for next hover
        setTimeout(() => {
          shine.style.transition = 'none';
          shine.style.transform = 'translateY(100%)';
          
          // Re-enable transition after reset
          setTimeout(() => {
            shine.style.transition = 'transform 0.7s ease-in-out';
          }, 50);
        }, 700);
      }
    } else {
      cardElement.style.transform = 'translateY(0) scale(1)';
      cardElement.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(93, 171, 252, 0.2)';
      
      // Deactivate glow
      const glow = cardElement.querySelector('.card-glow');
      if (glow) glow.style.opacity = '0';
    }
  }
  
  tiltCard(cardElement, event) {
    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    const tiltX = deltaY * 10; // Tilt around X-axis
    const tiltY = -deltaX * 10; // Tilt around Y-axis
    
    cardElement.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-15px) scale(1.03)`;
  }
  
  // Update cards when new ones are added
  updateCards() {
    if (!this.initialized) return;
    
    const cardElements = document.querySelectorAll('.term-card');
    cardElements.forEach(card => {
      if (!this.cards.includes(card)) {
        this.setupCard(card);
      }
    });
  }
  
  // Animate card reveal for the right card
  revealCard(cardElement, correct) {
    if (!cardElement) return;
    
    // Flash effect
    cardElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    if (correct) {
      cardElement.style.boxShadow = '0 0 30px rgba(46, 204, 113, 0.8)';
      
      // Add particle effect for correct answer
      this.createParticles(cardElement, true);
    } else {
      cardElement.style.boxShadow = '0 0 30px rgba(231, 76, 60, 0.8)';
      
      // Add particle effect for wrong answer
      this.createParticles(cardElement, false);
    }
    
    // Flip animation
    cardElement.style.transform = 'rotateY(180deg)';
    
    // Reset after animation
    setTimeout(() => {
      cardElement.style.transform = 'rotateY(0deg)';
      
      setTimeout(() => {
        cardElement.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(65, 120, 255, 0.2)';
      }, 500);
    }, 500);
  }
  
  createParticles(cardElement, correct) {
    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '9999';
    
    document.body.appendChild(particleContainer);
    
    // Create particles
    const color = correct ? '#2ecc71' : '#e74c3c';
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Particle styling
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.opacity = Math.random() * 0.5 + 0.5;
      
      // Position at center of card
      particle.style.top = `${centerY}px`;
      particle.style.left = `${centerX}px`;
      
      // Animation
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 100 + 50;
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;
      
      // Add to container
      particleContainer.appendChild(particle);
      
      // Animate
      let posX = centerX;
      let posY = centerY;
      let opacity = 1;
      let size = parseFloat(particle.style.width);
      
      const animate = () => {
        if (opacity <= 0) {
          particle.remove();
          return;
        }
        
        posX += speedX * 0.02;
        posY += speedY * 0.02;
        opacity -= 0.02;
        size *= 0.99;
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    // Remove container after animation
    setTimeout(() => {
      particleContainer.remove();
    }, 2000);
  }
} 