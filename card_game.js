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
// const geometry = new THREE.BoxGeometry(1, 1.4, 0.1); // DEPRECEATED
// const material = new THREE.MeshBasicMaterial({color : 'rgba(211, 76, 38, 1)'}); // DEPRECEATED
// Settings for Amount of Cards, Divided into Rows
/* const cardsAmount = 30;
const maxCardRows = 4;
// cardArray is used for storing each card inside itself, this way you have the ability to index through the array and pick any card which will be useful later
const cardArray = new Array(cardsAmount);
let posY = 0;
let currentIndex = 0;
// Essentially the cardSystem function goes through each row, and runs the cardSpawner() function for the amount of cardRows there are.
function cardSystem() {
    for (let i = 0; i < maxCardRows; i++) {
        cardSpawner();
        posY -= 2;
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
    unavailableSlots[currentIndex] = dataToApplyToIndex[randomIndex]

    for (let i = 0; i < 1; i++) {
        listToApplyIndex[randomIndex] = dataToApplyToIndex
        console.log(listToApplyIndex[randomIndex])
        console.log(dataToApplyToIndex)
        loader.load(
            `card_assets/${listToApplyIndex[randomIndex]}`,
            (object) => {
                object.scale.set(0.001, 0.001, 0.001)
                cardArray[currentIndex] = object
                cardArray[currentIndex].isCard = true
                cardArray[currentIndex].userData.alreadyPicked = false
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
        console.log(currentIndex)
        function addCardToFirstArray() {
            const indexRef = i;
            applyTwoCardsToRandomIndex(outputList, cardAssets[i].fileName, posX, posY, indexRef);
            posX += 1.5;

            currentIndex++
        };
        addCardToFirstArray();
    };
}
cardSystem(); */










const cardsAmount = 40;
const flipGoal = cardsAmount / 2
const cardColumnsAmount = 4;
const cardRowAmount = cardsAmount / cardColumnsAmount;
const cardArray = new Array(cardsAmount);
const cardAssets = [{fileName : 'Battle_Ox.fbx'}, {fileName : 'Mesmeric_Control.fbx'}, {fileName : 'Mystical_Elf.fbx'}, {fileName : 'Monster_Reborn001.fbx'}, {fileName : 'Pot_of_Greed.fbx'}, {fileName : 'Stop_Defense.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_2.fbx'}, {fileName : 'Shadow_Spell.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_1.fbx'}, {fileName : 'Polymerization.fbx'}];

/* function loadCardObject() {
    loader.load(
            `card_assets/${}`,
            (object) => {
                object.scale.set(0.001, 0.001, 0.001)
                object.position.y = posY
                object.position.x = posX
                scene.add(object)
                cardArray[currentIndex] = object
            },
            () => {},
            (error) => {
                console.log(error)
            });
} */



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


/* // Setup background scene
loader.load(
            `clen.fbx`,
            (object) => {
                object.scale.set(0.1, 0.1, 0.1)
                scene.add(object)
                object.rotation.y = 1.5
                object.position.x = 22
                object.position.y = -6
                object.position.z = -6
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
 */
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
            // intersects[0].object.rotation.y += 3.3
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
                    //     flipsPlayed[i].object.traverse((child) => {
                    //         if (child.isMesh) [
                    //             scene.remove(child)
                    //         ]
                    //     }
                    // )
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
        // if (flipsPlayed[0].cardID == flipsPlayed[1].cardID) {
        //     for (let i = 0; i < flipsPlayed.length; i++) {
        //         scene.remove(flipsPlayed[i])
        //         flipsPlayed[i].object = ''
        //     }
            
        //     for (let i = 0; i < flipsPlayed.length; i++) {
                
        //     }
        // }
        // else {
        //     for (let i = 0; i < flipsPlayed.length; i++) {
        //         flipsPlayed[i].cardID = ''
        //         flipsPlayed[i].alreadyPicked = false
        //         // intersects[i].object.object.rotation.x += 0.4
        //     }
        // };

        // if (picker < 2) {
        //     flipsPlayed[picker] = {cardID : intersects[0].object.userData.cardID, object: intersects[0]}
        //     console.log(`stored card data: ${flipsPlayed[0].cardID}, ${flipsPlayed[1].cardID}, and current picker index is ${picker}`)
        //     picker++
        //     if ((flipsPlayed[0].cardID == flipsPlayed[1].cardID) && (picker === 1)) {
        //         console.log('orking')
        //         console.log(flipsPlayed[1])
        //         scene.remove(flipsPlayed[1].object)
        //         scene.remove(flipsPlayed[0].object)
        //         picker = 0
        //         for (let i = 0; i < flipsPlayed.length; i++) {
        //         flipsPlayed[i] = ''
        //         }
        //     }
        //     if (picker === 1) {
                
        //     }
            
        // }
        // else {
        //     picker = 0
        // }
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
