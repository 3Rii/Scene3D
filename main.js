//scene, camera, renderer
let scene, camera, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set (0, 0, 100);

//TrollbackControls
const controls = new THREE.TrackballControls(camera, renderer.domElement);

//Korebeiniki
const audioListener = new THREE.AudioListener();
camera.add (audioListener);
const Korebeiniki = new THREE.Audio(audioListener);
Korebeiniki.loop = true;
scene.add(Korebeiniki);
const soundLoader = new THREE.AudioLoader();
soundLoader.load(
    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Tetris_theme.ogg',
    function (audioBuffer){
    Korebeiniki.setBuffer(audioBuffer);
    Korebeiniki.play();
    });

//Clock, Light
clock = new THREE.Clock();
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 100, -50, 100 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 50, -50, 100 );
dirLight.castShadow = true;
scene.add( dirLight );

//skyBox - City
scene.background = new THREE.CubeTextureLoader().load([
    "skybox/north.jpg",
    "skybox/south.jpg",
    "skybox/top.jpg",
    "skybox/bottom.jpg",
    "skybox/west.jpg",
    "skybox/east.jpg"
]);

//plane - city
const planeLoader = new THREE.TextureLoader();
const planeTexture = planeLoader.load('plane/plane.jpeg');
planeTexture.repeat.set(16, 16);
planeTexture.wrapS = THREE.RepeatWrapping;
planeTexture.wrapT = THREE.RepeatWrapping;
planeTexture.anisotropy = 16;
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
const planeMaterial = new THREE.MeshBasicMaterial({map: planeTexture});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.set(0, -50, 0);
plane.castShadow = false;
plane.receiveShadow = true;
scene.add(plane);

//fog
scene.fog = new THREE.Fog( 0x000000, -500, 1000);

//Tetris
const tetrisLoader = new THREE.GLTFLoader();
tetrisLoader.load('model/nicolec_assignment02_tetris/nicolec_assignment02_tetris.glb', function ( gltf ) {
    const model = gltf.scene;
    model.position.set(0, -50, 0);
    model.castShadow = true;
    model.receiveShadow = true;
    model.scale.x = model.scale.y = model.scale.z = 1000;
    scene.add(model);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();