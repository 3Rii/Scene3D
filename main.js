//scene, camera, renderer
let scene, camera, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set (0, 20, 200);

//TrollbackControls - CAM#1 operator
const controls = new THREE.TrackballControls(camera, renderer.domElement);

//Korebeiniki
const audioListener = new THREE.AudioListener();
camera.add (audioListener);
const Korebeiniki = new THREE.Audio(audioListener);
Korebeiniki.loop = true;
Korebeiniki.volume = 0.5;
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
hemiLight.position.set( 0, -50, 1000 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 10000, 10000 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 1000;
dirLight.shadow.camera.bottom = - 1000;
dirLight.shadow.camera.left = - 1000;
dirLight.shadow.camera.right = 1000;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 2000;
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

// MODELE
//Tetris Animated
const tetrisLoader = new THREE.GLTFLoader();
tetrisLoader.load('model/tetris_-_3d_inktober/tetris_-_3d_inktober.glb', function ( gltf ) {
    const model = gltf.scene;
    model.position.set(0, -40, 0);
    model.rotation.y = Math.PI / 2;
    model.castShadow = true;
    model.receiveShadow = true;
    model.scale.x = model.scale.y = model.scale.z = 8;
    const animations = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const actions = [];
    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const action = mixer.clipAction(animation);
      actions.push(action);
    }
    actions[0].setEffectiveTimeScale(0.000001);
    actions[0].play();
    function update(time) {
      requestAnimationFrame(update);
      mixer.update(time);
    }
    requestAnimationFrame(update);

    scene.add(model);
});
//Block behind
const tetrisLoader2 = new THREE.GLTFLoader();
tetrisLoader2.load('model/nicolec_assignment02_tetris/nicolec_assignment02_tetris.glb', function ( gltf ) {
    const model = gltf.scene;
    model.position.set(0, -50, -500);
    model.castShadow = true;
    model.receiveShadow = true;
    model.scale.x = model.scale.y = model.scale.z = 10000;
    scene.add(model);
});

// small block
const tetrisLoader3 = new THREE.GLTFLoader();
tetrisLoader3.load('model/cubo_bedlam_figura_f7/cubo_bedlam_figura_f7.glb', (gltf) => {
  const model = gltf.scene;
  model.position.y = 500;
  model.rotation.x = Math.PI / 2;
  model.castShadow = true;
  model.receiveShadow = true;
  model.scale.x = model.scale.y = model.scale.z = 0.15;
  scene.add(model);

  setTimeout(() => {
    scene.remove(model);
  }, 500);

  function addModel() {
    const instance = model.clone();
    instance.position.x = Math.random() * 500 - 200;
    instance.position.y = Math.random() * 500 - 200;
    instance.position.z = Math.random() * 500 - 200;
    scene.add(instance);

    setTimeout(() => {
      scene.remove(instance);
    }, 500);
  }
  setInterval(addModel, 10);
});

// Movement - CAM#2 operator
let movementDirection = { x: 0, z: 0 };

document.addEventListener("keydown", function(event) {
  switch (event.keyCode) {
    case 37: // left arrow key
      movementDirection.x = -1;
      break;
    case 38: // up arrow key
      movementDirection.z = -1;
      break;
    case 39: // right arrow key
      movementDirection.x = 1;
      break;
    case 40: // down arrow key
      movementDirection.z = 1;
      break;
  }
});

document.addEventListener("keyup", function(event) {
  switch (event.keyCode) {
    case 37: // left arrow key
    case 39: // right arrow key
      movementDirection.x = 0;
      break;
    case 38: // up arrow key
    case 40: // down arrow key
      movementDirection.z = 0;
      break;
  }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    camera.position.x += movementDirection.x;
    camera.position.z += movementDirection.z;
    renderer.render(scene, camera);
}
animate();