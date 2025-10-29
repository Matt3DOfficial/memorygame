// import three library for 3D
import * as THREE from 'three';
// import FBXLoader, part of THREE. FBXLoader allows the ability to load FBX models into the scene, and can then be added using scene.add(object)
import { FBXLoader } from '/three.js-r180/examples/jsm/loaders/FBXLoader.js';
// Below are a list of core technologies in THREE.JS used for rendering, animation, etc.
// scene is used for importing models into the scene, change of scene, etc.
const scene = new THREE.Scene();
// camera is used to view scene in THREE.JS, the different values change how the camera views the scene, and previews it to the HTML. The scale and resolution is determined by the function parameter values.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// creates the WebGLRenderer, which is used to make the final frame of the orchestration of geometry, lights and background of the scene.
const renderer = new THREE.WebGLRenderer();
// the renderers child, setSize() function determines the size of the final frame
renderer.setSize(window.innerWidth, window.innerHeight, false);
// the renderer is then added to the document object models document body
document.body.appendChild(renderer.domElement);
// setup FBXLoader function, for loading FBX card models in the for loop
const loader = new FBXLoader();
// cards amount is used for the amount of cards created. there are issues with the recursive functions i used in the loop, which causes a call stack error because it runs too many times. So for now, stick with batches of 10.
let cardsAmount = 6;
// the flipGoal value, when initialized determines the value of total successful card flips of two required.
let flipGoal = cardsAmount / 2;
// cardColumnnsAmount is used for the amount of columns of cards in the scene, this doesn't change the amount of cards, cardsAmount variable does this beforehand and is calculated with this variable.
const cardColumnsAmount = 2;
// cardRowAmount is calculated based off the division of both cardsAmount and cardColumnsAmount, which calculate how many cards are needed on each row programmaticaly.
let cardRowAmount = cardsAmount / cardColumnsAmount;
function cardsChecker() {
    if ((cardRowAmount % 2) === 1) {
        cardsAmount += 2
        flipGoal = cardsAmount / 2
        cardRowAmount = cardsAmount / cardColumnsAmount;
    };
};
cardsChecker();
// the list cardArray is made based off of the amount of cards needed in the cardsAmount variable.
const cardArray = new Array(cardsAmount);
// cardAssets is a list of object literals with the fileName property in each index, in which the string value of each is a .fbx file, which is used for the FBXLoader to load the file into the scene.
const cardAssets = [{fileName : 'Battle_Ox.fbx'}, {fileName : 'Mesmeric_Control.fbx'}, {fileName : 'Mystical_Elf.fbx'}, {fileName : 'Monster_Reborn001.fbx'}, {fileName : 'Pot_of_Greed.fbx'}, {fileName : 'Stop_Defense.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_2.fbx'}, {fileName : 'Shadow_Spell.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_1.fbx'}, {fileName : 'Polymerization.fbx'}];
// Card Animations Library (cardAnimsLibrary), is used for the organisation of the card animations using the GSAP JavaScript animation library.
const cardAnimsLibrary = {
    // startCardAnim object moves a card to a new X and Y position, based on the function parameters, and uses modelName parameter for the model the animation will inflict.
    startCardAnim : (modelName, newPosX, newPosY) => {
        // gsap.to() uses the first parameter, which determines the objects value that it is changing, and then a CSS style list of properties determine the final value and duration of the animation
        gsap.to(modelName.position, {
            duration: .5, // duration changes the amount of time of the animation
            delay: 0.1 * 0.25 + Math.random() * 0.8, // sets the amount of time before the animation should begin
            ease: 'expo.inOut', // Ease changes the timing of your animations, giving a unique feel
            x: newPosX, // The new position the animation will end at
            y: newPosY // The new position the animation will end at
        })
        // gsap.to() uses the first parameter, which determines the objects value that it is changing, and then a CSS style list of properties determine the final value and duration of the animation
        gsap.to(modelName.rotation, {
            duration: .5, // duration changes the amount of time of the animation
            delay: 0.1 * 0.25 + Math.random() * 0.8, // sets the amount of time before the animation should begin
            ease: 'expo.inOut', // Ease changes the timing of your animations, giving a unique feel
            z: 0 // The new rotation the animation will end at
        })
    },
    // cardFlipFromBack property changes the Y rotation of the model, in this case the card FBX model by the Y rotation by 180 degrees from the back to the front
    cardFlipFromBack : (modelName) => {
        // gsap.to() uses the first parameter, which determines the objects value that it is changing, and then a CSS style list of properties determine the final value and duration of the animation
        gsap.to(modelName.rotation, {
            y: Math.PI / 180 * 180, // Math.PI divided by 180 is used for the calculation of degrees of rotation of a model. this is then multiplied by what ever degree of rotation desired.
            duration: 0.4 // duration changes the amount of time of the animation
        })
    },
    // cardFlipFromBack property changes the Y rotation of the model, in this case the card FBX model by the Y rotation by 0 degrees from the front to the back
    cardFlipFromFront : (modelName) => {
        // gsap.to() uses the first parameter, which determines the objects value that it is changing, and then a CSS style list of properties determine the final value and duration of the animation
        gsap.to(modelName.rotation, {
            y: Math.PI / 180 * 0, // Math.PI divided by 180 is used for the calculation of degrees of rotation of a model. this is then multiplied by what ever degree of rotation desired.
            duration: 0.4 // duration changes the amount of time of the animation
        })
    },

    endCardAnim : (modelName) => {
        gsap.to(modelName)
    }
};
// createCards creates the cards from the variables cardsAmount, cardColumnsAmount, cardRowAmount, cardArray and cardAssets
function createCards() {
    // the posX and posY variables are initialised inside of the function because firstly, they serve no purpose globally, and they must be reset every time to be used to create a new batch of cards when the function is run to ensure correct placement of cards in the X and Y coordinates
    // posX variable is created to track the position of X
    let posX = 0;
    // posY variable is created to track the position of Y
    let posY = 0;
    // cardsAmountIndex is initalized to track the amount of cards created so far
    let cardsAmountIndex = 0;
    // a for loop is created to add an object literal full of properties in all of the objects in the cardArray list
    for (let i = 0; i < cardArray.length; i++) {
        cardArray[i] = {alreadyPicked: false, isCard: true, posProperties : {positionX : posX, positionY : posY}, otherProperties : {isNotEmpty : false}}
    };
    // calculateCardsPosition() calculates the position of X and Y for all objects in the cardArray list
    function calculateCardsPosition() {
        // for loop runs for the amount of times value in cardColumnsAmount holds, this is used with the posY variable to move each column down by the value of 2 every time a column loop is run
        for (let col = 0; col < cardColumnsAmount; col++) {
            // for loop runs for the amount of times value in cardRowAmount holds, this is used with the variables, posX, posY and cardsAmountindex. the value of posX is applied to cardArray[cardsAmountIndex].posProperties.positionX, posY is applied to cardArray[cardsAmountIndex].posProperties.positionY, this is used for applying posisition of Y and X to the selected index in the cardArray array. posX is also incremented by 2 so that the next time the loop is run, the position of that card will be position of 2 more in the X axis. posY is determined outside of the loop and inside of the column loop because we want to have the columns row of cards to have equal Y position to eachother.
            for (let row = 0; row < Math.floor(cardRowAmount); row++) {
                cardArray[cardsAmountIndex].posProperties.positionX = posX; // posX is applied to the positionX property, this changes the X position
                cardArray[cardsAmountIndex].posProperties.positionY = posY; // posy is applied to the positionX property, this changes the Y position
                posX += 2; // posX is incremented by 2 after the posX and posY has been applied because the first time the loop is ran we want to make sure it starts at the very beginning and not incrementing before applying positions
                cardsAmountIndex++; // cardsAmountIndex is incremented to keep track of how many cards have had their position applied and where the index is, this is run after the positions have been applied.
            };
            posY -= 2; // posY is decremented by 2, this is after the column has ran through each card in the row, this is to have spaced columns, the output will be -2 y position for each column created
            posX = 0; // posX is reset because a new set of cards will be created, otherwise the X position will be more than the previous columns row, which is not desired as it will not be equally spaced
        };
    };
    // calculateCardsPosition is then ran
    calculateCardsPosition();
    // for loop runs for the amount of times value in cardColumnsAmount holds
    for (let col = 0; col < cardColumnsAmount; col++) {
        // for loop runs for the amount of times value in cardRowAmount holds
        for (let row = 0; row < Math.floor(cardRowAmount); row += 2) {
            const randomCardAssetIndex = Math.floor(Math.random() * cardAssets.length);
            const randomCardAsset = cardAssets[randomCardAssetIndex].fileName;
            for (let i = 0; i < 2; i ++) {
                // recursive function that makes a random number between 0 and the total length of the cardArray, it then checks if that index has already been stored with a random card, if true, then the function will re run. you might be wondering about the callstack overflowing because of the function re running if there are no empty spaces, but that wont happen since we are only running the function for the length of the array, and no more, so there wont be any issues since there will be an empty space when the function is run
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
                                object.position.z = -5
                                object.rotation.y = Math.PI / 180 * 180
                                object.rotation.z = -1
                                object.traverse((child) => {
                                    if (child.isMesh) [
                                        child.userData = {isCard : true, alreadyPicked : false, cardID: randomCardAsset}
                                    ]
                                })
                                scene.add(object)
                                cardAnimsLibrary.startCardAnim(object, cardArray[randomCardIndex].posProperties.positionX, cardArray[randomCardIndex].posProperties.positionY);
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
// createCards function is then run
createCards();

const directionalLight = new THREE.DirectionalLight('rgba(255, 255, 255, 1)', 1, 0);
const ambientLight = new THREE.AmbientLight('rgba(255, 255, 255, 1)', 100, 0);

function positionCamera() {
    camera.position.z = 5;
    camera.position.x = 8;
    camera.position.y = -2;
    camera.rotation.y = 0;
};
function setupLighting() {
    scene.background = new THREE.Color( 'rgba(189, 122, 93, 1)' );
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    scene.add(ambientLight);
}
setupLighting();
positionCamera();

// Setup raycasting and click events
const flipsDOM = document.getElementById("flips")
const timerDOM = document.getElementById("timer")
let flipCounter = 0

const rayCaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function calculatePointerPosition(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    objectOnClick();
};

const flipsPlayed = new Array(2);
for (let i = 0; i < 2; i++) {
    flipsPlayed[i] = {cardID : '', object: '', alreadyPicked : false}
}

let picker = 0
function objectOnClick() {
    rayCaster.setFromCamera(pointer, camera);

    const intersects = rayCaster.intersectObjects(scene.children);
    if (0 < intersects.length) {
        if ((intersects[0].object.userData.isCard) && (!intersects[0].object.userData.alreadyPicked) && ((!flipsPlayed[0].alreadyPicked) || (!flipsPlayed[1].alreadyPicked))) {
            if (picker < 2) {
                intersects[0].object.userData.alreadyPicked = true
                flipsPlayed[picker] = {cardID : intersects[0].object.userData.cardID, object: intersects[0], alreadyPicked : true}
                cardAnimsLibrary.cardFlipFromBack(intersects[0].object);
                picker++
                if (picker === 2) {
                    if (flipsPlayed[0].cardID == flipsPlayed[1].cardID) {
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
                            cardAnimsLibrary.cardFlipFromFront(flipsPlayed[i].object.object);
                        };}, 2000)
                        picker = 0
                    };  
                }
                
            
            }

            }
        else {
            console.log('invalid')
        };
    };
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

window.addEventListener('click', calculatePointerPosition)
// setup clock system
const clockSystem = new THREE.Clock()
clockSystem.start()
// run animation loop (runs 60 frames per second)
function animate() {
    timerDOM.innerHTML = `timer: ${Math.floor(clockSystem.getElapsedTime())}` // timerDOM gets updated with the current time based on the clockSystem.getElapsedTime()
    renderer.render(scene, camera); // renders the frame based off of the scene and camera variables
};
// run animation loop (runs 60 frames per second)
renderer.setAnimationLoop(animate);