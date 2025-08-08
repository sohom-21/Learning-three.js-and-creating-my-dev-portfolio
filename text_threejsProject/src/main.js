import './style.css';
import * as THREE from 'three';
import {TTFLoader} from 'three/addons/loaders/TTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import getBgSphere from './getBgsphere';
import {LineMaterial} from 'three/addons/lines/LineMaterial.js';
import {LineGeometry} from 'three/addons/lines/LineGeometry.js';
import {Line2} from 'three/addons/lines/Line2.js';

// 1. Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 2. Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 3. objects
const bgSphere = getBgSphere({hue: 0.6});
scene.add(bgSphere);

// 4. lights
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);

// 5. Create a renderer
const  renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Useful for high DPI displays
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Set tone mapping for better color reproduction
renderer.toneMappingExposure = 1.0; // Adjust exposure for the scene
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type for softer shadows
renderer.setClearColor(0x000000, 1); // Set clear color to black
renderer.physicallyCorrectLights = true; // Enable physically correct lighting
renderer.outputColorSpace = THREE.SRGBColorSpace; // Set output color space for correct color rendering


// 6. Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// 7. Load a font and create text geometry
let strokegroup; //define strokegroup outside the loader callback to use it later
const loader = new TTFLoader();
loader.load("./fonts/ChakraPetch-Bold.ttf",(res) => {
    console.log(res);
    const font = new FontLoader();
    const newFont = font.parse(res);
    const props = {
        font: newFont,
         size: 1,
         depth: 0.2,
         curveSegments: 6,
         bevelEnabled: true,
         bevelThickness: 0.08,
         bevelSize: 0.01,
         bevelOffset: 0,
         bevelSegments: 2
    };
    const textGeo = new TextGeometry('Codevia.Crew', props);
    textGeo.computeBoundingBox();
    const CenterOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    const textMat = new THREE.MeshStandardMaterial({
        color: 0xff9900, 
    });

    //found a better material in reddit comments
    // const textMat = THREE.MeshPhongMaterial({
    //     color: 0xff9900,
    //     shininess: 100,
    //     specular: 0x555555,
    //     transparent: true,
    //     reflectivity: 0.5,
    //     opacity: 0.9 // Set opacity for transparency
    // });


    //MeshPhysicalMaterial({
    //roughness: 0.5,
    //transmission: 1.0,
    //transparent: true,
    //thickness: 1.0,
  //});

    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.x = CenterOffset;
    textMesh.castShadow = true; // Enable shadow casting for the text mesh
    scene.add(textMesh);

    strokegroup = new THREE.Group();
    strokegroup.userData.update = (t) => {
        strokegroup.children.forEach((child) => {
            child.userData.update?.(t);
        });
    };
    strokegroup.position.x = CenterOffset;
    strokegroup.position.z = 0.3;
    const lineMaterial = new LineMaterial({
        color: 0xffffff,
        linewidth: 3, // Line width in world unit
        dashed: true,
        dashSize: 0.1, // Length of the dash
        gapSize: 0.05, // Length of the gap between dashes
        // resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) // Resolution for dashed lines
        dashOffset :0.0
    })

    const shapes = newFont.generateShapes('Codevia.Crew',1);
    shapes.forEach((shape) => {
        let points = shape.getPoints();
        let points3d = [];
        points.forEach((point) => {
            points3d.push(point.x, point.y, 0);
        });
        const lineGeo = new LineGeometry();
        lineGeo.setPositions(points3d);
        const strokeMesh = new Line2(lineGeo, lineMaterial);
        strokeMesh.computeLineDistances(); // Compute line distances for dashed lines
        strokeMesh.userData.update = (t) =>{
            lineMaterial.dashOffset = t * 0.1; // Update dash offset based on time
        }
        strokegroup.add(strokeMesh);

        if(shape.holes?.length > 0){
            shape.holes.forEach((h) =>{
                let points = h.getPoints();
            let points3d = [];
            points.forEach((point) => {
                points3d.push(point.x, point.y, 0);
            });
            const lineGeo = new LineGeometry();
            lineGeo.setPositions(points3d);
            const strokeMesh = new Line2(lineGeo, lineMaterial);
            strokeMesh.computeLineDistances();
            strokegroup.add(strokeMesh);
            })
        }
    });
    scene.add(strokegroup);
    animate();
})


// 8. Render the scene  
function animate(t = 0) {
    requestAnimationFrame(animate);
    controls.update();
    strokegroup.userData.update(t * 0.002);
    renderer.render(scene, camera);
}

// 9. Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
