// import three library and external plugis
import * as THREE from 'three';
import { FBXLoader } from '/three.js-r180/examples/jsm/loaders/FBXLoader.js';
// Setup Scene, Camera, DOM and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.body.appendChild(renderer.domElement);
const loader = new FBXLoader();

const cardAssets = [
    {fileName : 'Battle_Ox.fbx'}, {fileName : 'Mesmeric_Control.fbx'}, {fileName : 'Mystical_Elf.fbx'}, {fileName : 'Monster_Reborn001.fbx'}, {fileName : 'Pot_of_Greed.fbx'}, {fileName : 'Stop_Defense.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_2.fbx'}, {fileName : 'Shadow_Spell.fbx'}, {fileName : 'The_Flute_of_Summoning_Dragon_1.fbx'}, {fileName : 'Polymerization.fbx'}
]

function objectOnClick() {
    rayCaster.setFromCamera(pointer, camera);

    const intersects = rayCaster.intersectObjects(scene.children);

    if ((0 < intersects.length)) {

    };
};

console.log(cardArray[2])

window.addEventListener('click', calculatePointerPosition)
function animate() {
    // cardArray[4].rotation.y += 0.01;
    cardArray[1].rotation.x += 0.01;

    timerSystem();
    // console.log(timeCounter)
    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
