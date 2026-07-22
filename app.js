// ==========================================
// MARIAM MANUKYAN - HTML VERSION
// Pure Vanilla JS + Three.js + CSS
// ==========================================

// ===== UTILITIES =====
function lerp(a, b, n) { return (1 - n) * a + n * b; }

// ===== TYPEWRITER EFFECT =====
const bioText = "AI Engineer & Technical Product Manager with 12+ years of delivery experience. I bridge the gap between high-level business strategy and deep technical execution — from leading teams and defining product roadmaps to training models and deploying conversational UIs.";
let typeIndex = 0;
const bioEl = document.getElementById('heroBio');
const cursorEl = document.getElementById('typeCursor');

function typeWriter() {
  if (typeIndex < bioText.length) {
    const span = document.createElement('span');
    span.textContent = bioText.charAt(typeIndex);
    bioEl.insertBefore(span, cursorEl);
    typeIndex++;
    setTimeout(typeWriter, 25);
  } else {
    cursorEl.style.display = 'none';
  }
}

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;

function animateCursor() {
  cursorX = lerp(cursorX, targetX, 0.15);
  cursorY = lerp(cursorY, targetY, 0.15);
  cursorDot.style.left = cursorX + 'px';
  cursorDot.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}

if (!('ontouchstart' in window)) {
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .cursor-pointer, .discipline-card, .project-item')) {
      cursorDot.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', () => {
    cursorDot.classList.remove('hover');
  });
  animateCursor();
} else {
  cursorDot.style.display = 'none';
}

// ===== THREE.JS SPHERES =====
function createCodeTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#F0EDE8';
  ctx.font = 'bold 55px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#A78BFA';
  ctx.shadowBlur = 20;
  ctx.fillText('</>', size / 2, size / 2);
  ctx.shadowBlur = 0;
  ctx.fillText('</>', size / 2, size / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function initThreeScene(containerId, sphereCount) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return null;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A0A0F');
  scene.fog = new THREE.FogExp2(0x0A0A0F, 0.04);

  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  // Environment map
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#12121A');

  const envLight1 = new THREE.PointLight('#A78BFA', 3, 50);
  envLight1.position.set(5, 5, 5);
  envScene.add(envLight1);

  const envLight2 = new THREE.PointLight('#C4B5FD', 2, 50);
  envLight2.position.set(-5, -3, 5);
  envScene.add(envLight2);

  const envLight3 = new THREE.PointLight('#6B6570', 1.5, 50);
  envLight3.position.set(0, 5, -5);
  envScene.add(envLight3);

  const envGeom = new THREE.IcosahedronGeometry(2, 0);
  const envMesh1 = new THREE.Mesh(envGeom, new THREE.MeshBasicMaterial({ color: '#A78BFA', wireframe: true }));
  envMesh1.position.set(3, 2, -5);
  envScene.add(envMesh1);

  const envMesh2 = new THREE.Mesh(envGeom, new THREE.MeshBasicMaterial({ color: '#F0EDE8', wireframe: true }));
  envMesh2.position.set(-4, -2, -3);
  envMesh2.scale.set(0.5, 0.5, 0.5);
  envScene.add(envMesh2);

  cubeCamera.update(renderer, envScene);

  // Spheres with </> texture
  const codeTexture = createCodeTexture();
  const geometry = new THREE.SphereGeometry(0.12, 32, 16);
  const spheres = [];

  for (let i = 0; i < sphereCount; i++) {
    const mat = new THREE.MeshPhysicalMaterial({
      envMap: cubeRenderTarget.texture,
      map: codeTexture,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.45,
      thickness: 0.6,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    });

    const hue = 0.74 + Math.random() * 0.06;
    const sat = 0.25 + Math.random() * 0.2;
    const light = 0.45 + Math.random() * 0.25;
    mat.color.setHSL(hue, sat, light);
    mat.emissive.setHSL(hue, sat * 0.5, light * 0.15);

    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.x = (Math.random() - 0.5) * 16;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 8 - 2;
    const scale = Math.random() * 2 + 0.6;
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;

    scene.add(mesh);
    spheres.push(mesh);
  }

  scene.add(new THREE.AmbientLight(0x1a1a2e, 0.5));
  const dirLight = new THREE.DirectionalLight('#A78BFA', 0.3);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // Mouse
  const mouse = { x: 0, y: 0 };
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  // Animation loop
  let isVisible = true;
  let animTime = 0;

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }

    animTime += 0.005;
    const timer = 0.0001 * Date.now();

    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 1 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    for (let i = 0; i < spheres.length; i++) {
      const s = spheres[i];
      const offset = i * 0.1;
      s.position.x += Math.cos(timer + offset) * 0.005;
      s.position.y += Math.sin(timer + offset * 1.1) * 0.005;
      s.rotation.y += 0.004;
      s.rotation.x += 0.002;
    }

    envMesh1.rotation.x += 0.001;
    envMesh1.rotation.y += 0.002;
    envMesh2.rotation.x -= 0.002;
    envMesh2.rotation.y += 0.001;

    if (Math.floor(animTime * 100) % 10 === 0) {
      cubeCamera.update(renderer, envScene);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Visibility observer
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(container);

  // Resize
  window.addEventListener('resize', () => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
  return { renderer, scene };
}

// ===== HERO ANIMATIONS =====
function animateHero() {
  setTimeout(() => {
    document.getElementById('heroLabel').style.opacity = '1';
    document.getElementById('heroLabel').style.transform = 'translateY(0)';
    document.getElementById('heroLabel').style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  }, 300);

  setTimeout(() => {
    document.getElementById('heroTitle').style.opacity = '1';
    document.getElementById('heroTitle').style.transform = 'translateY(0)';
    document.getElementById('heroTitle').style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  }, 500);

  setTimeout(() => {
    document.getElementById('heroSubtitle').style.opacity = '1';
    document.getElementById('heroSubtitle').style.transform = 'translateY(0)';
    document.getElementById('heroSubtitle').style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  }, 800);

  setTimeout(() => {
    document.getElementById('heroButtons').style.opacity = '1';
    document.getElementById('heroButtons').style.transform = 'translateY(0)';
    document.getElementById('heroButtons').style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  }, 1200);

  setTimeout(() => {
    document.getElementById('heroProfile').style.opacity = '1';
    document.getElementById('heroProfile').style.transform = 'translateX(0) scale(1)';
    document.getElementById('heroProfile').style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  }, 900);

  // Start typewriter
  setTimeout(typeWriter, 1800);
}

// ===== SCROLL ANIMATIONS (IntersectionObserver) =====
function initScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 120);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));
}

// ===== NAVIGATION =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('show');
}

// ===== NAV SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ===== PAGE LOAD =====
window.addEventListener('load', () => {
  // Remove curtain
  setTimeout(() => {
    document.getElementById('pageCurtain').classList.add('loaded');
  }, 200);

  // Init Three.js scenes
  initThreeScene('heroCanvas', 150);
  initThreeScene('disciplinesCanvas', 80);

  // Hero entrance animations
  animateHero();

  // Scroll animations
  initScrollAnimations();
});
