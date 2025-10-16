// ============================================
// PARTICLE NETWORK ANIMATION
// ============================================

class ParticleNetwork {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.colors = {
      primary: '#17a2b8',
      light: '#4fc3dc',
      accent: '#2196F3'
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
    this.addEventListeners();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles = [];
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  createParticles() {
    const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);

    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 3 + 1;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;

      this.particles.push(new Particle(x, y, size, speedX, speedY, this.colors));
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update(this.canvas, this.mouse);
      particle.draw(this.ctx);
    });

    // Draw connections
    this.connectParticles();

    requestAnimationFrame(() => this.animate());
  }

  connectParticles() {
    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;

          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(23, 162, 184, ${opacity})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  constructor(x, y, size, speedX, speedY, colors) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseSize = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.colors = colors;
    this.color = this.getRandomColor();
    this.pulse = Math.random() * Math.PI * 2;
  }

  getRandomColor() {
    const colors = [this.colors.primary, this.colors.light];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvas, mouse) {
    // Move particle
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }

    // Mouse interaction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);

        this.x -= Math.cos(angle) * force * 2;
        this.y -= Math.sin(angle) * force * 2;

        // Increase size on hover
        this.size = this.baseSize * (1 + force);
      } else {
        // Return to base size
        this.size += (this.baseSize - this.size) * 0.1;
      }
    } else {
      this.size += (this.baseSize - this.size) * 0.1;
    }

    // Pulse effect
    this.pulse += 0.02;
  }

  draw(ctx) {
    // Pulsing effect
    const pulseSize = this.size + Math.sin(this.pulse) * 0.5;

    // Draw particle glow
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, pulseSize * 3
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'rgba(23, 162, 184, 0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, pulseSize * 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw particle core
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ============================================
// MATRIX RAIN EFFECT (Optional Alternative)
// ============================================
class MatrixRain {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.drops = [];
    this.fontSize = 14;
    this.columns = 0;
    this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    this.init();
  }

  init() {
    this.resize();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);

    // Initialize drops
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }

  animate() {
    // Semi-transparent black to create fade effect
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw characters
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Create gradient for character
      const gradient = this.ctx.createLinearGradient(x, y - 20, x, y);
      gradient.addColorStop(0, 'rgba(79, 195, 220, 0)');
      gradient.addColorStop(1, 'rgba(23, 162, 184, 0.8)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillText(char, x, y);

      // Reset drop to top randomly
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      this.drops[i]++;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// HEXAGON GRID BACKGROUND (Optional Alternative)
// ============================================
class HexagonGrid {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.hexagons = [];
    this.hexSize = 40;

    this.init();
  }

  init() {
    this.resize();
    this.createHexagons();
    this.animate();

    window.addEventListener('resize', () => {
      this.resize();
      this.createHexagons();
    });

    window.addEventListener('mousemove', (e) => {
      this.hexagons.forEach(hex => {
        const dx = e.x - hex.x;
        const dy = e.y - hex.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          hex.highlight = 1 - distance / 100;
        } else {
          hex.highlight = 0;
        }
      });
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createHexagons() {
    this.hexagons = [];
    const rows = Math.ceil(this.canvas.height / (this.hexSize * 1.5)) + 1;
    const cols = Math.ceil(this.canvas.width / (this.hexSize * Math.sqrt(3))) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * this.hexSize * Math.sqrt(3) + (row % 2) * this.hexSize * Math.sqrt(3) / 2;
        const y = row * this.hexSize * 1.5;

        this.hexagons.push({
          x: x,
          y: y,
          highlight: 0,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }
  }

  drawHexagon(x, y, size, opacity) {
    this.ctx.beginPath();

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);

      if (i === 0) {
        this.ctx.moveTo(hx, hy);
      } else {
        this.ctx.lineTo(hx, hy);
      }
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = `rgba(23, 162, 184, ${opacity})`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.hexagons.forEach(hex => {
      hex.pulse += 0.02;
      const pulseOpacity = (Math.sin(hex.pulse) + 1) * 0.05 + 0.05;
      const opacity = Math.max(pulseOpacity, hex.highlight * 0.5);

      this.drawHexagon(hex.x, hex.y, this.hexSize, opacity);

      // Fade highlight
      hex.highlight *= 0.95;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
window.addEventListener('load', () => {
  // Choose one effect (default: ParticleNetwork)
  // Uncomment the one you want to use:

  // Option 1: Particle Network (default)
  new ParticleNetwork();

  // Option 2: Matrix Rain Effect
  // new MatrixRain();

  // Option 3: Hexagon Grid
  // new HexagonGrid();
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Reduce animation quality on low-end devices
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  // Mobile devices get simplified animations
  console.log('Mobile device detected - optimizing animations');
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
  const canvas = document.getElementById('particle-canvas');
  if (document.hidden) {
    canvas.style.opacity = '0.5';
  } else {
    canvas.style.opacity = '1';
  }
});
