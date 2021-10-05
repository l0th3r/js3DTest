import * as three from 'three'
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene setup

const scene = new three.Scene();
const cam = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cam.position.setZ(30);
cam.position.setX(-3);

const renderer = new three.WebGLRenderer({
    canvas: document.querySelector('#main-view')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//const controls = new OrbitControls(cam, renderer.domElement);


//Shapes

const moonTexture = new three.TextureLoader().load('src/assets/moon.jpg');
const moonNormalTexture = new three.TextureLoader().load('src/assets/moon_normal.jpg');

const sphere = new three.Mesh(
    new three.SphereGeometry(3, 32, 32),
    new three.MeshStandardMaterial({
        map: moonTexture,
        normalMap: moonNormalTexture
    })
);

scene.add(sphere);

function spawnStar() {
    const geo = new three.SphereGeometry(0.25, 24, 24);
    const mat = new three.MeshStandardMaterial({color: 0xffffff});
    const star = new three.Mesh(geo, mat);

    const [x, y, z] = Array(3).fill().map(()=> three.MathUtils.randFloatSpread(200));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(spawnStar);


// Lights

const pointLight = new three.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new three.AmbientLight(0xffffff);

scene.add(ambientLight, pointLight);

// Background
const bgTexture = new three.TextureLoader().load('src/assets/spacebg.jpg');
scene.background = bgTexture;


// Move on scroll

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    
    sphere.rotation.x += 0.05;
    sphere.rotation.y += 0.075;
    sphere.rotation.z += 0.05;

    var scale = sphere.scale;
    var newScale = t * -0.01 + 1; // scroll position * ratio + scale origin
    sphere.scale.set(newScale, newScale, newScale);

    cam.position.x = (t * -0.08) + -3; // scroll position * ratio + cam position origin
}

document.body.onscroll = moveCamera;


// Loop

function animate() {
    requestAnimationFrame(animate);
    //frames loop

    renderer.render(scene, cam);
}

//handle window resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

animate();