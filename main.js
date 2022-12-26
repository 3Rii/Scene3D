//scene, camera, renderer
let scene, camera, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set (0, 0, 100);

//TrollbackControls
const controls = new THREE.TrackballControls(camera, renderer.domElement);

//Korebeiniki
let sound;
sound = new Howl({
    url: 'sound/Tetris.mp3',
    autoplay: true,
    loop: true,
    volume:0.5
});

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
scene.fog = new THREE.Fog( 0x000000, -100, 1000);

//Tetris
const tetrisLoader = new THREE.GLTFLoader();
tetrisLoader.load('model/cubo_bedlam_f12.glb', function ( gltf ) {
    const model = gltf.scene;

    // model.traverse( function ( object ) {
    //     if (object.THREE.isMesh ) object.castShadow = true;
    // })
    scene.add( model );
});
    // model.traverse(function (child) {
    //     if (child instanceof THREE.SkinnedMesh) {
    //         const animation = new THREE.Animation(child, child.geometry.animation);
    //         animation.play();
    //     }
    // })
    // model.scale.x = model.scale.y = model.scale.z = 50;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();