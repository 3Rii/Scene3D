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


//cube
const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();