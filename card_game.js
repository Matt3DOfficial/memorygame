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
const material = new THREE.MeshBasicMaterial({color : 'rgba(211, 76, 38, 1)'});
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
let cardMeshArray = new Array(17)
for (let cardMeshArrayAmount = 1; cardMeshArrayAmount < 18; cardMeshArrayAmount++) {
    if (cardMeshArrayAmount > 10) {
        cardMeshArray[cardMeshArrayAmount] = `0${cardMeshArrayAmount}`
    }
    else {
        cardMeshArray[cardMeshArrayAmount] = `00${cardMeshArrayAmount}`
    }
    
}




loader.load(
            `clen.fbx`,
            (object) => {
                object.scale.set(0.1, 0.1, 0.1)
                scene.add(object)
                object.rotation.y = 1.5
                object.position.x = 12
                object.position.y = -6
            },
            () => {},
            (error) => {
                console.log(error)
        });









let cardsUsed
function cardSpawner() {
    let posX = 0
    for (let i = 0; i < Math.floor(cardsAmount / maxCardRows); i++) {
        currentIndex++
        const randomCard = cardMeshArray[Math.floor(Math.random() * 17)]
        function addCardToFirstArray() {
        cardArray[currentIndex] = new THREE.Mesh(geometry, material);
        scene.add(cardArray[currentIndex]);
/*         loader.load(
            `cards_assets/Plane_${randomCard}.fbx`,
            (object = cardArray[currentIndex]) => {
                object.scale.set(0.003, 0.003, 0.003)
                scene.add(object)
                object.rotation.y = 1.5
            },
            () => {},
            (error) => {
                console.log(error)
        }); */
        cardArray[currentIndex].position.x = posX;
        cardArray[currentIndex].position.y = posY;
        posX += 1.5;
        };
        addCardToFirstArray();
    };
}

cardSystem()

scene.background = new THREE.Color( 'rgba(189, 122, 93, 1)' );
const light = new THREE.PointLight(0xff0000, 100, 100);
light.position.set(0, 0, 5);
scene.add(light);

camera.position.z = 6;
camera.position.x = 4;
camera.position.y = -1;
camera.rotation.y = 0;
function animate() {

    cardArray[1].rotation.y += 0.01
    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);