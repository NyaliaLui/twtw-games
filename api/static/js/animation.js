import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 10, 5);
scene.add(dirLight);

// Controls (disable OrbitControls camera control)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Background (sky)
textureLoader.load('/static/textures/sky.jpg', (skyTexture) => {
  scene.background = skyTexture;
});

// Grass ground
textureLoader.load('/static/textures/grass.jpg', (grassTexture) => {
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ map: grassTexture })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
});

// Soldier and animation
let soldier;
let mixer;
let animations = {};
let currentAction = null;

const clock = new THREE.Clock();
const keys = { w: false, a: false, s: false, d: false, shift: false };
const baseSpeed = 0.05;
const runMultiplier = 2.5;

const loader = new GLTFLoader();
loader.load('/static/models/Soldier.glb', (gltf) => {
  console.log(gltf.animations.map(anim => anim.name));
  soldier = gltf.scene;
  soldier.scale.set(1, 1, 1);
  soldier.position.set(0, 0, 0);
  scene.add(soldier);

  mixer = new THREE.AnimationMixer(soldier);
  gltf.animations.forEach((clip) => {
    animations[clip.name.toLowerCase()] = mixer.clipAction(clip);
  });

  if (animations['idle']) {
    currentAction = animations['idle'];
    currentAction.play();
  }
}, undefined, (error) => {
  console.error('Error loading Soldier:', error);
});

// Input listeners
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) keys[key] = true;
});
document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) keys[key] = false;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  let moving = false;
  let moveDir = new THREE.Vector3();

  if (soldier) {
    const speed = baseSpeed * (keys.shift ? runMultiplier : 1);

    if (keys.w) { moveDir.z -= 1; }
    if (keys.s) { moveDir.z += 1; }
    if (keys.a) { moveDir.x -= 1; }
    if (keys.d) { moveDir.x += 1; }

    if (moveDir.length() > 0) {
      moveDir.normalize();
      soldier.position.add(moveDir.clone().multiplyScalar(speed));
      moving = true;

      // Rotate soldier to face movement direction
      const angle = Math.atan2(moveDir.x, moveDir.z);
      soldier.rotation.y = angle + Math.PI;
    }

    // Animation transition
    const targetAnim = moving
      ? (keys.shift && animations['run'] ? 'run' : 'walk')
      : 'idle';

    if (animations[targetAnim] && currentAction !== animations[targetAnim]) {
      if (currentAction) currentAction.fadeOut(0.2);
      currentAction = animations[targetAnim];
      currentAction.reset().fadeIn(0.2).play();
    }

    let controlsTarget = new THREE.Vector3();
    controlsTarget.x = soldier.position.x;
    controlsTarget.y = soldier.position.y + 1;
    controlsTarget.z = soldier.position.z;
    controls.target = controlsTarget;
  }

  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
