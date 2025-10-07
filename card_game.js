// import three library and external plugis
import * as THREE from 'three';
import { FBXLoader } from '/three.js-r180/examples/jsm/loaders/FBXLoader.js';

let testObject
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Card Spawning System
const loader = new FBXLoader();
const geometry = new THREE.BoxGeometry(1, 1.4, 0.1);
const material = new THREE.MeshBasicMaterial({color : 0x404040});
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
let cardMeshArray
for (i = 1; i < 18; i++) {
    if (i > 10) {
        cardMeshArray[i] = `0${i}`
    }
    else {
        cardMeshArray[i] = `00${i}`
    }
    
}
let cardsUsed
function cardSpawner() {
    let posX = 0
    for (let i = 0; i < Math.floor(cardsAmount / maxCardRows); i++) {
        currentIndex++
        const randomCard = cardMeshArray[Math.floor(Math.random() * 17)]
        function addCardToFirstArray() {
        cardArray[currentIndex] = new THREE.Mesh(geometry, material);
        scene.add(cardArray[currentIndex]);
        loader.load(
            `cards_assets/Plane_${randomCard}.fbx`,
            (object) => {
                object.scale.set(0.001, 0.001, 0.001)
                scene.add(object)
                testObject = object
            },
            () => {},
            (error) => {
                console.log(error)
        });
        cardArray[currentIndex].position.x = posX;
        cardArray[currentIndex].position.y = posY;
        posX += 1.5;
        };
        addCardToFirstArray();
    };
}

cardSystem()


const light = new THREE.AmbientLight(0x404040);
scene.add(light)

camera.position.z = 10;
camera.position.x = 4
camera.position.y = 0
camera.rotation.y = 0
function animate() {
    cardArray[1].rotation.y += 0.01
    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);