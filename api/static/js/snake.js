import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Score Board
const scoreBoard = document.createElement('div');
scoreBoard.id = 'score-board';
document.getElementById('viewport').appendChild(scoreBoard);
const maxScoreElement = document.createElement('div');
maxScoreElement.id = 'max-score';
scoreBoard.appendChild(maxScoreElement);
const scoreElement = document.createElement('div');
scoreElement.id = 'score';
scoreBoard.appendChild(scoreElement);

const levelUpElement = document.createElement('div');
levelUpElement.id = 'level-up';
document.getElementById('viewport').appendChild(levelUpElement);
const staminaElement = document.createElement('div');
staminaElement.id = 'stamina';
document.getElementById('viewport').appendChild(staminaElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('viewport').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Game constants
const boundarySize = 1000;
const halfBoundary = boundarySize / 2;
const blockSize = 20;
const initSpeed = 5;
let baseSpeed = initSpeed;
const boostMultiplier = 3;
const maxStaminaBlocks = 4;
const staminaDepletionRate = 2500; // ms per block
let level = 1;

// Stamina system
let staminaBlocks = 0;
let staminaTimer = null;
let staminaUsed = 0;

// Fruit count to track when stamina increases
let fruitCollectedCount = 0;


// Game state
let bodyParts = [];
let fruits = [];
let fruitCount = 1;
let score = 0;
const initMaxScore = 50;
let maxScore = initMaxScore;
let speed = baseSpeed;
let isBoosting = false;
const keys = {};

function updateStaminaDisplay() {
  staminaElement.innerHTML = '';
  for (let i = 0; i < staminaBlocks; i++) {
    const block = document.createElement('div');
    block.className = 'stamina-block';
    staminaElement.appendChild(block);
  }
}

function useStamina() {
  if (staminaBlocks > 0) {
    staminaBlocks--;
    staminaUsed++;
    updateStaminaDisplay();
  }
  if (staminaBlocks === 0) {
    stopBoost();
  }
}

function startStaminaTimer() {
  if (staminaTimer) return;
  staminaTimer = setInterval(() => {
    useStamina();
  }, staminaDepletionRate);
}

function stopStaminaTimer() {
  if (staminaTimer) {
    clearInterval(staminaTimer);
    staminaTimer = null;
  }
}

function startBoost() {
  if (staminaBlocks > 0) {
    speed = baseSpeed * boostMultiplier;
    isBoosting = true;
    startStaminaTimer();
  }
}

function stopBoost() {
  speed = baseSpeed;
  isBoosting = false;
  stopStaminaTimer();
}
function showLevelUp() {
  levelUpElement.textContent = `LEVEL ${level}!`;
  levelUpElement.style.opacity = '1';
  setTimeout(() => {
    levelUpElement.style.opacity = '0';
  }, 2000);
}



document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'Shift') startBoost();
});
document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  if (e.key === 'Shift') stopBoost();
});

// Boundary
const boundaryGeometry = new THREE.BoxGeometry(boundarySize, 0.1, boundarySize);
const boundaryMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
boundary.position.y = -10;
scene.add(boundary);

// Head
const head = new THREE.Mesh(
  new THREE.BoxGeometry(blockSize, blockSize, blockSize),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
scene.add(head);

function spawnFruits() {
  fruits.forEach(f => scene.remove(f));
  fruits = [];
  for (let i = 0; i < fruitCount; i++) {
    const fruit = new THREE.Mesh(
      new THREE.BoxGeometry(blockSize, blockSize, blockSize),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    const dx = (Math.random() * boundarySize) - halfBoundary;
    const dz = (Math.random() * boundarySize) - halfBoundary;
    fruit.position.set(dx, 0, dz);
    scene.add(fruit);
    fruits.push(fruit);
  }
}

function growSnake() {
  for (let i = 0; i < 3; i++) {
    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(blockSize, blockSize, blockSize),
      new THREE.MeshBasicMaterial({ color: 0x00aa00 })
    );
    segment.position.copy(head.position);
    scene.add(segment);
    bodyParts.push(segment);
  }
}

function resetSnake() {
  bodyParts.forEach(segment => scene.remove(segment));
  bodyParts = [];
  growSnake();
  score = 0;
  baseSpeed = initSpeed;
  speed = initSpeed;
  fruitCount = 1;
  maxScore = initMaxScore;
  staminaBlocks = 0;
  staminaUsed = 0;
  stopBoost();
  updateStaminaDisplay();
  spawnFruits();
  updateScore();
}

function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
  maxScoreElement.textContent = `Max: ${maxScore}`;
}

camera.position.set(0, 1000, 0);
camera.lookAt(0, 0, 0);
controls.enableRotate = false;
controls.enablePan = false;
controls.enableZoom = false;

resetSnake();

function distance(a, b) {
  return a.position.distanceTo(b.position);
}

function animate() {
  requestAnimationFrame(animate);

  const velocity = new THREE.Vector3();
  if (keys['w']) velocity.z -= speed;
  if (keys['s']) velocity.z += speed;
  if (keys['a']) velocity.x -= speed;
  if (keys['d']) velocity.x += speed;

  head.position.add(velocity);

  let hitBoundary = false;
  if (head.position.x < -halfBoundary) { head.position.x = -halfBoundary; hitBoundary = true; }
  if (head.position.x > halfBoundary) { head.position.x = halfBoundary; hitBoundary = true; }
  if (head.position.z < -halfBoundary) { head.position.z = -halfBoundary; hitBoundary = true; }
  if (head.position.z > halfBoundary) { head.position.z = halfBoundary; hitBoundary = true; }

  if (hitBoundary) {
    resetSnake();
    console.log(fruits);
    console.log(fruitCount);
  }

  for (let i = bodyParts.length - 1; i > 0; i--) {
    bodyParts[i].position.copy(bodyParts[i - 1].position);
  }
  if (bodyParts.length > 0) {
    bodyParts[0].position.copy(head.position);
  }

  for (let i = 0; i < fruits.length; i++) {
    if (distance(head, fruits[i]) < blockSize) {
      scene.remove(fruits[i]);
      fruits.splice(i, 1);
      score += 5;
      growSnake();
      fruitCollectedCount++;
      if (fruitCollectedCount % 5 === 0 && staminaBlocks < maxStaminaBlocks) {
        staminaBlocks++;
        updateStaminaDisplay();
      }
      i--; 
    }
  }

  if (fruits.length === 0) {
    spawnFruits();
  }

  if (score >= maxScore) {
    level++;
    baseSpeed += 3;
    speed = isBoosting ? baseSpeed * boostMultiplier : baseSpeed;
    if (level % 3 == 0) fruitCount++;
    maxScore += initMaxScore;
    showLevelUp();
    updateScore();
    spawnFruits();
  }

  updateScore();
  controls.update();
  renderer.render(scene, camera);
}

animate();
