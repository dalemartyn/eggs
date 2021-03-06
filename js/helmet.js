

if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer, light;

init();
animate();

function init() {

  container = document.getElementById('canvas-container');

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  camera.position.set(-1.8, 0.9, 2.7);

  controls = new THREE.OrbitControls(camera);
  controls.target.set(0, -0.2, -0.2);
  controls.update();

  // envmap
  var path = 'helmet/';
  var format = '.jpg';
  var envMap = new THREE.CubeTextureLoader().load([
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
  ]);

  scene = new THREE.Scene();
  scene.background = envMap;

  light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
  light.position.set(0, 1, 0);
  scene.add(light);

  
  // model
  var loader = new THREE.GLTFLoader();

  loader.load(
    'egg3/scene.gltf',
    function (gltf) {
      scene.add(gltf.scene);
      console.log(gltf);

      window.gl = gltf;
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Scene
      gltf.scenes; // Array<THREE.Scene>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.log('An error happened');
    }
  );

  // loader.load('helmet/DamagedHelmet.gltf', function (gltf) {

  //   gltf.scene.traverse(function (child) {

  //     if (child.isMesh) {

  //       child.material.envMap = envMap;

  //     }

  //   });

  //   window.h = gltf;

  //   scene.add(gltf.scene);

  // });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaOutput = true;
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  // stats
  stats = new Stats();
  container.appendChild(stats.dom);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  stats.update();

}
