let mouse = { x: null, y: null };

document.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
});

document.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.0 + 1.2;
    this.speedX = Math.random() * 0.18 - 0.09;
    this.speedY = Math.random() * -0.24 - 0.1;
    this.opacity = Math.random() * 0.45 + 0.45;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        let force = (150 - dist) / 150;
        this.x -= (dx / dist) * force * 1.2;
        this.y -= (dy / dist) * force * 1.2;
      }
    }

    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }

    if (this.x < 0 || this.x > canvas.width) {
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 176, 32, ${this.opacity * 0.22})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 176, 32, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particleCount = Math.min(70, Math.floor(window.innerWidth / 16));

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  let maxDist = 135;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        let opacity = (1 - dist / maxDist) * 0.32;
        ctx.strokeStyle = `rgba(255, 176, 32, ${opacity})`;
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null && mouse.y !== null) {
      let dx = particles[i].x - mouse.x;
      let dy = particles[i].y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 160) {
        let opacity = (1 - dist / 160) * 0.45;
        ctx.strokeStyle = `rgba(255, 176, 32, ${opacity})`;
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

animate();
