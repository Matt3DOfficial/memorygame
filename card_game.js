// import three library and external plugis
import * as THREE from 'three';
import { FBXLoader } from '/three.js-r180/examples/jsm/loaders/FBXLoader.js';
// Setup Scene, Camera, DOM and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Card Spawning System
// Setup Card Geometry and Material
const loader = new FBXLoader();
const geometry = new THREE.BoxGeometry(1, 1.4, 0.1);
const material = new THREE.MeshBasicMaterial({color : 'rgba(211, 76, 38, 1)'});
// Settings for Amount of Cards, Divided into Rows
const cardsAmount = 20;
const maxCardRows = 3;
// cardArray is used for storing each card inside itself, this way you have the ability to index through the array and pick any card which will be useful later
const cardArray = new Array(cardsAmount);
let posY = 0;
let currentIndex = 0;
// Essentially the cardSystem function goes through each row, and runs the cardSpawner() function for the amount of cardRows there are.
function cardSystem() {
    for (let i = 0; i < maxCardRows; i++) {
        cardSpawner()
        posY -= 2
    };
};
// Sets up the list of card files that you can access, this is essentialy a quick way of making a list of all of the .fbx card files, by assigning the number value, and an array index for each card. This creates a list of all the 3d card models which can be accessed later
let cardMeshArray = new Array(17);
for (let cardMeshArrayAmount = 1; cardMeshArrayAmount < 18; cardMeshArrayAmount++) {
    if (cardMeshArrayAmount > 9) {
        cardMeshArray[cardMeshArrayAmount] = `0${cardMeshArrayAmount}`
    }
    else {
        cardMeshArray[cardMeshArrayAmount] = `00${cardMeshArrayAmount}`
    };
};
// cardSpawner() function runs a for loop, and runs based on the cardsAmount variable, divided by the rows, logically creating equal rows for every time the function is run
function cardSpawner() {
    let posX = 0
    // i variable is local scoped and only used to keep track of how many times the loop is run
    for (let i = 0; i < Math.floor(cardsAmount / maxCardRows); i++) {
        // randomCard is used for picking a random FBX file from the list/array insided of the cardMeshArray variable we made earlier. Its uses math.random * 17 to pick a random number between 0 and 17, then uses math.floor to make a non-decimal number
        const randomCard = cardMeshArray[Math.floor(Math.random() * 17 + 1)]
        // addCardToFirstArray() function creates a mesh inside cardArray list index, based on the currentIndex variable number
        function addCardToFirstArray() {
            cardArray[currentIndex] = new THREE.Mesh(geometry, material);
            scene.add(cardArray[currentIndex]);
            loader.load(
                `cards_assets/Plane_${randomCard}.fbx`,
                (object = cardArray[currentIndex]) => {
                    object.scale.set(0.003, 0.003, 0.003)
                    scene.add(object)
                    object.rotation.y = 1.5
                },
                () => {},
                (error) => {
                    console.log(error)
            });
            cardArray[currentIndex].position.x = posX;
            cardArray[currentIndex].position.y = posY;
            posX += 1.5;
            currentIndex++
        };
        addCardToFirstArray();
    };
}
cardSystem();
scene.background = new THREE.Color( 'rgba(189, 122, 93, 1)' );
const light = new THREE.PointLight(0xff0000, 300, 0);
light.position.set(0, 0, 5);
scene.add(light);

camera.position.z = 6;
camera.position.x = 4;
camera.position.y = -1;
camera.rotation.y = 0;


// Setup background scene
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
// Setup raycasting and click events
const rayCaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function calculatePointerPosition() {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
};

function playFlipAnimation() {

};

function flipUpdater(objectToFlip) {

};

function objectOnClick() {
    rayCaster.setFromCamera(pointer, camera);

    const intersects = rayCaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        flipUpdater(intersects[i])
        intersects[i].object.material.color.set(0xff0000);
        console.log('working')
    };
};



function animate() {

    renderer.render(scene, camera);
};

function render() {
    cardArray[1].rotation.y += 0.01;
    objectOnClick();
    renderer.render(scene, camera);
};

window.addEventListener('pointermove', calculatePointerPosition)
window.addEventListener('click', objectOnClick)
window.requestAnimationFrame(render)