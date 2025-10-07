import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1.4, 0.1);
const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
const cardsAmount = 20
const maxCardRows = 3
const cardArray = new Array(cardsAmount)
let posY = 0
let currentIndex = 0
function cardSystem() {
    for (let i = 0; i < maxCardRows; i++) {
        cardSpawner()
        posY -= 2
    }
}

function cardSpawner() {
    let posX = 0
    for (let i = 0; i < Math.floor(cardsAmount / maxCardRows); i++) {
        currentIndex++
        function addCardToFirstArray() {
        cardArray[currentIndex] = new THREE.Mesh(geometry, material);
        scene.add(cardArray[currentIndex]);
        cardArray[currentIndex].position.x = posX
        cardArray[currentIndex].position.y = posY
        posX += 1.5
        };
        addCardToFirstArray();
    };
}

cardSystem()


camera.position.z = 7;
camera.position.x = 3.5
camera.position.y = 0
function animate() {
    cardArray[1].rotation.x += 0.1
    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);