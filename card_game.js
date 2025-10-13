// import three library and external plugins
import * as THREE from 'three';
import { FBXLoader } from '/three.js-r180/examples/jsm/loaders/FBXLoader.js';
// Setup Scene, Camera, DOM and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.body.appendChild(renderer.domElement);
// Card Spawning System
// Setup Card Geometry and Material
const loader = new FBXLoader();
const geometry = new THREE.BoxGeometry(1, 1.4, 0.1);
const material = new THREE.MeshBasicMaterial({color : 'rgba(211, 76, 38, 1)'});
// Settings for Amount of Cards, Divided into Rows
const cardsAmount = 30;
const maxCardRows = 4;
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

const cardAssets = [
    {fileName : 'Battle_Ox.fbx'}, {fileName : 'Mesmeric_Control.fbx'}, {fileName : 'Mystical_Elf.fbx'}, {fileName : 'Monster_Reborn001.fbx'}, {fileName : 'Pot_of_Greed.fbx'}, {fileName : 'Stop_Defense.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_2.fbx'}, {fileName : 'Shadow_Spell.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_1.fbx'}, {fileName : 'Polymerization.fbx'}
]

const outputList = []

const unavailableNames = new Array();
const unavailableSlots = new Array();

function applyTwoCardsToRandomIndex(listToApplyIndex, dataToApplyToIndex, posX, posY, indexRef) {
    function randomIndexGen() {
        const randomIndex = Math.floor(Math.random() * dataToApplyToIndex.length);
        return randomIndex;
    };
    function findAvailableSlot() {
        const i = randomIndexGen();
        if (unavailableSlots.includes(dataToApplyToIndex[i])) {
            findAvailableSlot();
        }
        else {
            return i;
        };
    };
    const randomIndex = findAvailableSlot();
    unavailableSlots[indexRef] = dataToApplyToIndex[randomIndex]

    for (let i = 0; i < 1; i++) {
        listToApplyIndex[randomIndex] = dataToApplyToIndex
        console.log(listToApplyIndex[randomIndex])
        console.log(dataToApplyToIndex)
        loader.load(
            `card_assets/${listToApplyIndex[randomIndex]}`,
            (object) => {
                object.scale.set(0.001, 0.001, 0.001)
                cardArray[indexRef] = object
                cardArray[indexRef].isCard = true
                cardArray[indexRef].userData.alreadyPicked = false
                scene.add(object)
                object.position.y = posY
                object.position.x = posX
                object.position.z = 1
                object.rotation.y = 0.1
            },
            () => {},
            (error) => {
                console.log(error)
            });
    }
}



// cardSpawner() function runs a for loop, and runs based on the cardsAmount variable, divided by the rows, logically creating equal rows for every time the function is run
function cardSpawner() {
    let posX = 0
    // i variable is local scoped and only used to keep track of how many times the loop is run
    for (let i = 0; i < Math.floor(cardsAmount / maxCardRows); i++) {
        // randomCard is used for picking a random FBX file from the list/array insided of the cardMeshArray variable we made earlier. Its uses math.random * 17 to pick a random number between 0 and 17, then uses math.floor to make a non-decimal number
        // const randomCard = cardMeshArray[Math.floor(Math.random() * 17 + 1)]
        // addCardToFirstArray() function creates a mesh inside cardArray list index, based on the currentIndex variable number
        function addCardToFirstArray() {
            const indexRef = i
            applyTwoCardsToRandomIndex(outputList, cardAssets[i].fileName, posX, posY, indexRef);
            // cardArray[currentIndex] = new THREE.Mesh(geometry, material);
            // cardArray[currentIndex].isCard = true
            // cardArray[currentIndex].userData.alreadyPicked = false
            // cardArray[currentIndex].userData.cardID = 1
            // scene.add(cardArray[currentIndex]);
            // cardArray[currentIndex].position.x = posX;
            // cardArray[currentIndex].position.y = posY;
            posX += 1.5;
            currentIndex++
        };
        addCardToFirstArray();
    };
}
cardSystem();
scene.background = new THREE.Color( 'rgba(189, 122, 93, 1)' );
const directionalLight = new THREE.DirectionalLight('rgba(255, 255, 255, 1)', 1, 0);
const ambientLight = new THREE.AmbientLight('rgba(255, 255, 255, 1)', 100, 0);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);
scene.add(ambientLight);

camera.position.z = 10;
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

loader.load(
            `clen.fbx`,
            (object) => {
                object.scale.set(0.1, 0.1, 0.1)
                scene.add(object)
                object.rotation.y = -2
                object.position.x = -3
                object.position.y = -6
                object.rotation.x = .1
            },
            () => {},
            (error) => {
                console.log(error)
        });

const textureLoader = new THREE.TextureLoader();

const cardTexture = textureLoader.load('card_assets/Card Back.jpeg')

// Setup raycasting and click events
const flipsDOM = document.getElementById("flips")
const timerDOM = document.getElementById("timer")
const timer = new THREE.Timer();
let flipCounter = 0
let successfullFlips = 0
let timeCounter = 0
const flipsPlayed = new Array(2);
const rayCaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function calculatePointerPosition(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    objectOnClick();
};

function playFlipAnimationTHREEJS() {

};

function playFlipAnimationCSS() {

};

function timerSystem() {
    // timeCounter += timer.update()
}

function flipUpdater(objectToFlip) {
    if (flipsPlayed[0] == flipsPlayed[1]) {
    flipsDOM.innerHTML = `flips: ${successfullFlips}`;
    playFlipAnimationCSS();
    playFlipAnimationTHREEJS();
    }
    else {
    flipsDOM.innerHTML = `flips: ${successfullFlips}`;
    };
};

function gameSystem() {
    if (flipCounter === 1) {
        flipCounter++;
        flipUpdater();
        flipCounter = 0;
    }
    else {
        flipCounter++;  
        flipUpdater();
    };
};
let picker = 0
function objectOnClick() {
    rayCaster.setFromCamera(pointer, camera);

    const intersects = rayCaster.intersectObjects(scene.children);

    if ((0 < intersects.length) && (intersects[0].object.userData.isCard) && (!intersects[0].object.alreadyPicked)) {
        intersects[0].object.alreadyPicked = true
        gameSystem();
        intersects[0].object.material.color.set(0xff0000);
        intersects[0].object.rotation.y += 0.6;
        if (picker < 2) {
            flipsPlayed[picker] = intersects[0].object.userData.cardID;
            console.log(`stored card data inside of ${flipsPlayed[picker]}`)
            picker++
            if (flipsPlayed[0] == flipsPlayed[1] ) {
                console.log('orking')
                console.log(flipsPlayed[1])
                scene.remove(cardArray[flipsPlayed[1]])
            }
        }
        else {

            picker = 0
        }
    };
};

window.addEventListener('click', calculatePointerPosition)
function animate() {
    cardArray[4].rotation.y += 0.01;
    cardArray[1].rotation.x += 0.01;

    timerSystem();
    // console.log(timeCounter)
    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
