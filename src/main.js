
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const container = document.querySelector('#scene-container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

container.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 2));

const mainLight = new THREE.DirectionalLight(0xffe0b5, 3);
mainLight.position.set(4, 6, 5);
scene.add(mainLight);

const orangeLight = new THREE.PointLight(0xff641f, 35, 15);
orangeLight.position.set(-4, 1, 3);
scene.add(orangeLight);

const rimLight = new THREE.PointLight(0xffbd62, 25, 15);
rimLight.position.set(3, -3, -3);
scene.add(rimLight);

// Burger container
const burgerGroup = new THREE.Group();
scene.add(burgerGroup);

// Mouse movement
let mouseX = 0;
let mouseY = 0;

window.addEventListener('pointermove', (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// Animation settings
const clock = new THREE.Clock();

let baseY = 0;
let introProgress = 0;
const introDuration = 1.5;

// Responsive layout
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  if (width < 700) {
    burgerGroup.position.x = 0;
    baseY = -1.4;
  } else {
    burgerGroup.position.x = -3.2;
    baseY = -1.3;
  }
}

// Load GLB model
const loader = new GLTFLoader();

let burgerModel = null;

loader.load(
  '/models/burger.glb',

  (gltf) => {
    burgerModel = gltf.scene;

    // Calculate model dimensions
    const box = new THREE.Box3().setFromObject(burgerModel);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the model
    burgerModel.position.sub(center);

    // Fit model into the scene
    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetScale = 3.5 / maxDimension;

    burgerModel.scale.setScalar(targetScale);

    // Improve model material appearance
    burgerModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material) => {
          material.color.set('#b87942');
          material.roughness = 0.72;
          material.metalness = 0;
          material.needsUpdate = true;
        });
      }
    });

    burgerGroup.add(burgerModel);

    // Start entrance animation after model loads
    introProgress = 0;

    resize();
  },

  undefined,

  (error) => {
    console.error('خطا در بارگذاری مدل همبرگر:', error);
  }
);

// Animation
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.elapsedTime;

  // Burger entrance animation
  introProgress = Math.min(
    introProgress + delta / introDuration,
    1
  );

  // Smooth entrance easing
  const introEase = 1 - Math.pow(1 - introProgress, 3);

  // Responsive scale
  const responsiveScale = window.innerWidth < 700 ? 0.72 : 1;

  burgerGroup.scale.setScalar(
    responsiveScale * introEase
  );

  // Floating movement + entrance movement
  burgerGroup.position.y =
    baseY -
    (1 - introEase) * 1.2 +
    Math.sin(time * 1.2) * 0.09;

  // Mouse interaction
  burgerGroup.rotation.y +=
    (mouseX * 0.35 - burgerGroup.rotation.y) * 0.035;

  burgerGroup.rotation.x +=
    (-mouseY * 0.16 - burgerGroup.rotation.x) * 0.035;

  renderer.render(scene, camera);
}

animate();

// Resize events
window.addEventListener('resize', resize);

resize();


// Features scroll reveal

const featureCards = document.querySelectorAll('.feature-card');

const featureObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        featureObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

featureCards.forEach((card) => {
  featureObserver.observe(card);
});
