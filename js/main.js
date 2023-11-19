import * as THREE from '../node_modules/three/build/three.module.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.z = 5;
// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Make Canvas Responsive
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})


//////////////////////////
// Color
    /*
scene.background = new THREE.Color(params.color)
     */
    // Create gradient background
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

// Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

// Define gradient
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0.2, '#d3dbeb');
    gradient.addColorStop(0.3, '#d0bdc0');
    gradient.addColorStop(0.4, '#f1b1a3');
    gradient.addColorStop(0.5,'#9aa6d3')
    gradient.addColorStop(0.6, '#f39086');
    gradient.addColorStop(0.7, '#c68fb6');
    gradient.addColorStop(0.8, '#f8ded9');
    gradient.addColorStop(0.9, '#dcad9f');
    gradient.addColorStop(1.0, '#b1bbd7');
// Fill the canvas with the gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

// Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

// Apply texture to the scene background
scene.background = texture;

//////////////////////////////////////

//Render M
const loader = new GLTFLoader();
let clickableObject;
loader.load( 'Assets/Mhacks.glb', function ( gltf ) {
    gltf.scene.position.y = 0.5;
    clickableObject = gltf.scene;
    clickableObject.name = 'clickableObject';
    scene.add(clickableObject);
}, undefined, function ( error ) {
	console.error( error );
} );

// // Create Box
// const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
// const boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
// const boxMesh = new THREE.Mesh(boxGeometry, 
// boxMaterial);
// boxMesh.rotation.set(40, 0, 40);
// scene.add(boxMesh);


// Add ripple effect
function applyCursorRippleEffect(e) {
    const ripple = document.createElement("div");

    ripple.className = "ripple";
    document.body.appendChild(ripple);

    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    ripple.style.animation = `ripple-effect .4s  linear`;
    ripple.onanimationend = () => {
        document.body.removeChild(ripple);

    }

}


// Display and initialize score
let score = 0;
const scoreElement = document.createElement("div");
scoreElement.classList.add("myText");
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.textContent = 'Score = ' + score;
document.body.appendChild(scoreElement);

// +1 to score
function updateScore() {
    score += 1;
    scoreElement.innerText = 'Score = ' + score;
}

// raycaster + mouse tracking initializing
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
document.addEventListener('mousedown', onMouseDown, false);

// check object collision with mouse
function raycast() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children.filter(obj => obj.name === 'clickableObject'));

    if (intersects.length > 0) {
        // Clicked on the clickable object
        applyCursorRippleEffect(event);
        updateScore(); // Example: Increase the score by 10 points
    }
}

// check mouse position, and use raycast
function onMouseDown(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycast();
}


/*
addEventListener("click", (event) => {});
onclick = (event) => {
    updateScore();
};

 */



// Create spheres: 
const sphereMeshes = [];
const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({color: 0xf4b7fd});
for (let i=0; i<4; i++) {
    sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMeshes[i].position.set(0, 0, 0);
    scene.add(sphereMeshes[i]);
}

// Lights
const lights = [];
const lightHelpers = [];

const lightValues = [
    {colour: 0xF5D2FF, intensity: 150, dist: 30, x: 1, y: 0, z: 6},
    {colour: 0xB1C5F8, intensity: 150, dist: 30, x: -2, y: 1, z: -7},
    {colour: 0xF5D2FF, intensity: 150, dist: 25, x: 0, y: 6, z: 1},
    {colour: 0xfB1C5F8, intensity: 150, dist: 25, x: 0, y: -6, z: -1},
    {colour: 0xF5D2FF, intensity: 150, dist: 25, x: 6, y: 3, z: 0},
    {colour: 0xB1C5F8, intensity: 150, dist: 25, x: -7, y: -1, z: 0}
];
for (let i=0; i<6; i++) {
    lights[i] = new THREE.PointLight(
        lightValues[i]['colour'], 
        lightValues[i]['intensity'], 
        lightValues[i]['dist']);
    lights[i].position.set(
        lightValues[i]['x'], 
        lightValues[i]['y'], 
        lightValues[i]['z']);
    scene.add(lights[i]);

    // Add light helpers for each light
    // lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.7);
    // scene.add(lightHelpers[i]);
}

// Axes Helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper); // X == red, Y == green, Z == blue

//Trackball Controls for Camera 
const controls = new TrackballControls(camera, renderer.domElement); 
controls.rotateSpeed = 50;
controls.dynamicDampingFactor = 0.15;  
controls.panSpeed = 0.8;

// Trigonometry Constants for Orbital Paths
let theta = 0;
const dTheta = 2 * Math.PI / 100;


const rendering = function() {
    requestAnimationFrame(rendering);
    // // Constantly rotate box
    // scene.rotation.x -= 0.02;
    // scene.rotation.z -= 0.02;
    scene.rotation.y -= 0.02;
    renderer.render(scene, camera);
    
    // Update trackball controls
    controls.update();

    //Increment theta, and update sphere coords based off new value        
    theta += dTheta;

    // Store trig functions for sphere orbits 
    const trigs = [
        {x: Math.cos(theta*1.05), 
        y: Math.sin(theta*1.05),    
        z: Math.cos(theta*1.05), 
        r: 2},
        {x: Math.cos(theta*0.8), 
        y: Math.sin(theta*0.8), 
        z: Math.sin(theta*0.8), 
        r: 2.25},
        {x: Math.cos(theta*1.25), 
        y: Math.cos(theta*1.25), 
        z: Math.sin(theta*1.25), 
        r: 2.5},
        {x: Math.sin(theta*0.6), 
        y: Math.cos(theta*0.6), 
        z: Math.sin(theta*0), 
        r: 2.75}
    ];


    // Update sphere positions
    for (let i=0; i<4; i++) {
        sphereMeshes[i].position.set(
            trigs[i]['x']*trigs[i]['r'], 
            trigs[i]['y']*trigs[i]['r'], 
            trigs[i]['z']*trigs[i]['r']);
    }
}

rendering();
