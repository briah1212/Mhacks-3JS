import * as THREE from '../node_modules/three/build/three.module.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { Water } from '../node_modules/three/examples/jsm/objects/Water2.js';
import { Refractor } from "../node_modules/three/examples/jsm/objects/Refractor.js";
import { Reflector } from "../node_modules/three/examples/jsm/objects/Reflector.js";

window.onload = function () {
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

// Create Box
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    const boxMesh = new THREE.Mesh(boxGeometry,
        boxMaterial);
    boxMesh.rotation.set(40, 0, 40);
    scene.add(boxMesh);


// Adding Water
    // Create a plane geometry for the water
    const width = 10;
    const height = 10;
    const waterGeometry = new THREE.PlaneGeometry(width, height);

// Create the water using the geometry and material
    const water = new Water(waterGeometry, {
        color: '#a0a0a0',
        scale: 1,
        flowDirection: new THREE.Vector2(1, 0),
        textureWidth: 1024,
        textureHeight: 1024
    });

// Rotate the geometry 90 degrees to make it lie flat
    water.rotation.x = -Math.PI / 2;

// Position the water at the bottom of the scene
    water.position.y = -2; // Adjust this value based on your scene's dimensions

    scene.add(water);

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x409060 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2; // Adjust this value based on your scene's dimensions
    scene.add(ground);



// Color


// Lights
    const lights = [];
    const lightHelpers = [];

    const lightValues = [
        {colour: 0xabb5ff, intensity: 100, dist: 18, x: 1, y: 0, z: 8},
        {colour: 0xBE61CF, intensity: 100, dist: 15, x: -2, y: 1, z: -10},
        {colour: 0x00FFFF, intensity: 80, dist: 14, x: 0, y: 10, z: 1},
        {colour: 0xffc2f6, intensity: 80, dist: 14, x: 0, y: -10, z: -1},
        {colour: 0x16A7F5, intensity: 80, dist: 14, x: 10, y: 3, z: 0},
        {colour: 0xffc2f6, intensity: 80, dist: 14, x: -10, y: -1, z: 0}
    ];
    for (let i = 0; i < 6; i++) {
        lights[i] = new THREE.PointLight(
            lightValues[i]['colour'],
            lightValues[i]['intensity'],
            lightValues[i]['dist']);
        lights[i].position.set(
            lightValues[i]['x'],
            lightValues[i]['y'],
            lightValues[i]['z']);
        scene.add(lights[i]);

        // New Code: Add light helpers for each light
        lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.7);
        scene.add(lightHelpers[i]);
    }

// Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper); // X == red, Y == green, Z == blue

//Trackball Controls for Camera 
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 50;
    controls.dynamicDampingFactor = 0.15;
    controls.keys = [65, 83, 68]; // a, s, d


    const rendering = function () {
        requestAnimationFrame(rendering);
        renderer.render(scene, camera);

        // Update trackball controls
        controls.update();
    }

    rendering();
}