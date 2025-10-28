// import gsap animation library
// import gsap from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js';
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

const cardsAmount = 20;
const flipGoal = cardsAmount / 2
const cardColumnsAmount = 2;
const cardRowAmount = cardsAmount / cardColumnsAmount;
const cardArray = new Array(cardsAmount);
const cardAssets = [{fileName : 'Battle_Ox.fbx'}, {fileName : 'Mesmeric_Control.fbx'}, {fileName : 'Mystical_Elf.fbx'}, {fileName : 'Monster_Reborn001.fbx'}, {fileName : 'Pot_of_Greed.fbx'}, {fileName : 'Stop_Defense.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_2.fbx'}, {fileName : 'Shadow_Spell.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_1.fbx'}, {fileName : 'Polymerization.fbx'}];


function createCards() {
    let posX = 0;
    let posY = 0;
    let cardsAmountIndex = 0

    for (let i = 0; i < cardArray.length; i++) {
        cardArray[i] = {alreadyPicked: false, isCard: true, posProperties : {positionX : posX, positionY : posY}, otherProperties : {isNotEmpty : false}}
    }
    function calculateCardsPosition() {
        for (let i = 0; i < cardColumnsAmount; i++) {
            for (let i = 0; i < Math.floor(cardRowAmount); i++) {
                cardArray[cardsAmountIndex].posProperties.positionX = posX
                cardArray[cardsAmountIndex].posProperties.positionY = posY
                posX += 2
                cardsAmountIndex++
            }
            posY -= 2
            posX = 0
        }
    }
    calculateCardsPosition()

    for (let i = 0; i < cardColumnsAmount; i++) {
        for (let i = 0; i < Math.floor(cardRowAmount); i += 2) {
            const randomCardAssetIndex = Math.floor(Math.random() * cardAssets.length);
            const randomCardAsset = cardAssets[randomCardAssetIndex].fileName;
            for (let i = 0; i < 2; i ++) {
                function insertRandomCard() {
                    const randomCardIndex = Math.floor(Math.random() * cardArray.length);
                    if (cardArray[randomCardIndex].otherProperties.isNotEmpty) {
                        insertRandomCard();
                    }
                    else {
                        cardArray[randomCardIndex].otherProperties = {isNotEmpty : true, fileName : randomCardAsset, object : ''}
                        loader.load(
                            `card_assets/${randomCardAsset}`,
                            (object) => {
                                object.scale.set(0.001, 0.001, 0.001)
                                object.position.y = 0
                                object.position.x = 0
                                object.position.z = -5
                                object.rotation.y = Math.PI / 180 * 180
                                object.rotation.z = -1
                                object.traverse((child) => {
                                    if (child.isMesh) [
                                        child.userData = {isCard : true, alreadyPicked : false, cardID: randomCardAsset}
                                    ]
                                })
                                scene.add(object)
                                gsap.to(object.position, {
                                    duration: .5,
                                    delay: 0.1 * 0.25 + Math.random() * 0.8,
                                    ease: 'expo.inOut',
                                    x: cardArray[randomCardIndex].posProperties.positionX,
                                    y: cardArray[randomCardIndex].posProperties.positionY
                                })
                                gsap.to(object.rotation, {
                                    duration: .5,
                                    delay: 0.1 * 0.25 + Math.random() * 0.8,
                                    ease: 'expo.inOut',
                                    z: 0
                                })
                                console.log(object)
                                cardArray[randomCardIndex].otherProperties.object = object
                            },
                            () => {},
                            (error) => {
                                console.log(error)
                        });
                    };
                };
                insertRandomCard();
            };
        };
        posY -= 2
    };
};

createCards();







function tets(){console.log(cardArray[1].isCard)}

tets()


const testGeometry = new THREE.BoxGeometry(1, 1, 1);
const testsMaterial = new THREE.MeshBasicMaterial({color:'rgba(198, 88, 88, 0.88)'});
const testObject = new THREE.Mesh(testGeometry, testsMaterial);
scene.add(testObject);


scene.background = new THREE.Color( 'rgba(189, 122, 93, 1)' );
const directionalLight = new THREE.DirectionalLight('rgba(255, 255, 255, 1)', 1, 0);
const ambientLight = new THREE.AmbientLight('rgba(255, 255, 255, 1)', 100, 0);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);
scene.add(ambientLight);

camera.position.z = 5;
camera.position.x = 8;
camera.position.y = -2;
camera.rotation.y = 0;

const textureLoader = new THREE.TextureLoader();

const cardTexture = textureLoader.load('card_assets/Card Back.jpeg')



function playFlipAnimationTHREEJS() {

};

function playFlipAnimationCSS() {

};


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

function flipUpdater(objectToFlip) {
    flipsDOM.innerHTML = `flips: ${successfullFlips}`;
    playFlipAnimationCSS();
    playFlipAnimationTHREEJS();
    }


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
for (let i = 0; i < 2; i++) {
    flipsPlayed[i] = {cardID : '', object: '', alreadyPicked : false}
}


function objectOnClick() {
    rayCaster.setFromCamera(pointer, camera);

    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(`${intersects[0].object.userData.isCard} ${intersects[0].object.userData.alreadyPicked}`)

    if ((0 < intersects.length) && (intersects[0].object.userData.isCard) && (!intersects[0].object.userData.alreadyPicked) && ((!flipsPlayed[0].alreadyPicked) || (!flipsPlayed[1].alreadyPicked))) {
        console.log(`working`)
        console.log(intersects[0].object)

        if (picker < 2) {
            intersects[0].object.userData.alreadyPicked = true
            flipsPlayed[picker] = {cardID : intersects[0].object.userData.cardID, object: intersects[0], alreadyPicked : true}
            gsap.to(intersects[0].object.rotation, {
                y: Math.PI / 180 * 180,
                duration: 0.4
            })
            picker++
            if (picker === 2) {
                console.log("run")
                if (flipsPlayed[0].cardID == flipsPlayed[1].cardID) {
                    console.log(`removing both cards...`)
                    flipCounter++
                    flipsDOM.innerHTML = `flips: ${flipCounter}`;
                    setTimeout(() => {for (let i = 0; i < flipsPlayed.length; i++) {


                        scene.remove(flipsPlayed[i].object)
                        flipsPlayed[i].object.object.position.x += 1000000000
                        flipsPlayed[i].object = ''
                        flipsPlayed[i].cardID = ''
                        flipsPlayed[i].alreadyPicked = false
                    };}, 2000)

                    if (flipCounter === flipGoal) {
                        winScreen();
                    };
                    picker = 0;
                }
                else {
                    console.log("reseting cards")
                    setTimeout
                    (() => {for (let i = 0; i < flipsPlayed.length; i++) {
                        flipsPlayed[i].cardID = ''
                        flipsPlayed[i].alreadyPicked = false
                        flipsPlayed[i].object.object.userData.alreadyPicked = false
                        // flipsPlayed[i].object.object.rotation.y -= 3.3
                        gsap.to(flipsPlayed[i].object.object.rotation, {
                            y: Math.PI / 180 * 0,
                            duration: 0.4
                        })
                    };}, 2000)
                    picker = 0
                };  
            }
            
        
        }

        }
    else {
        console.log('invalid')
    }
};



const winScreenRef = document.getElementById(`win_screen`)
const buttonRef = document.getElementById(`play_again_button`)
buttonRef.addEventListener('click', () => {
    winScreenRef.style = `display: none; pointer-events: none;`;
    flipCounter = 0;
    flipsDOM.innerHTML = `flips: ${flipCounter}`;
    clockSystem.stop();
    clockSystem.start();
    createCards();
})

// function shows win screen, with a play again button
function winScreen() {
    winScreenRef.style = `display: block; pointer-events: all;`
}

// setup clock system
const clockSystem = new THREE.Clock()


window.addEventListener('click', calculatePointerPosition)
clockSystem.start()
function animate() {
    timerDOM.innerHTML = `timer: ${Math.floor(clockSystem.getElapsedTime())}`
    renderer.render(scene, camera);
    testObject.rotation.x += 0.01
    testObject.rotation.y += 0.01
};

renderer.setAnimationLoop(animate);
