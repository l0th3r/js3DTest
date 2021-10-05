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

// Controls

const controls = new OrbitControls(cam, renderer.domElement);
var mouse = new three.Vector2();
var raycaster = new three.Raycaster();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

//Shapes

const moonTexture = new three.TextureLoader().load('src/assets/moon.jpg');
const moonNormalTexture = new three.TextureLoader().load('src/assets/moon_normal.jpg');

const sphere = new three.Mesh(
    new three.SphereGeometry(3, 32, 32),
    new three.MeshStandardMaterial({
        map: moonTexture,
    })
);
sphere.position.set(5, 5, 5);

const sphere2 = new three.Mesh(
    new three.SphereGeometry(3, 32, 32),
    new three.MeshStandardMaterial({
        map: moonTexture,
    })
);

sphere2.position.set(-5, -5, -5);

scene.add(sphere, sphere2);

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


// Handle hover objects
function hoverObjects() {
    raycaster.setFromCamera(mouse, cam);
    
    //reset material
    scene.children.forEach(element => {
        if(element.material)
            element.scale.set(1, 1, 1);
    });

    var hoveredElements = raycaster.intersectObjects(scene.children);
    hoveredElements.forEach(element => {
        element.object.scale.set(2, 2, 2);
    });

    if(hoveredElements.length > 0)
        document.body.style.cursor = 'pointer';
    else
        document.body.style.cursor = 'default';
}

// Loop

function animate() {
    requestAnimationFrame(animate);
    //frames loop

    hoverObjects();

    sphere.rotation.x += 0.008;
    sphere.rotation.y += 0.02;

    sphere2.rotation.x += 0.01;
    sphere2.rotation.y += -0.02;

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