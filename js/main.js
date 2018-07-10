var isMobile = {
  Android: function () { return navigator.userAgent.match(/Android/i); },
  BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
  iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
  Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
  Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
  webOS: function () { return navigator.userAgent.match(/webOS/i); },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

if ( Detector.webgl ) { // HAS WEB GL

  var container;

  var camera, scene, renderer;
  var fov = 60;

  var mesh, geometry;
  var spheres = [];
  var sphereRotations = [];

  var mouseX = 0;
  var mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var container = document.getElementById('canvas-container');

  var material, textureCube;

  var NUMITEMS = 80;
  var POSITION_LIMIT = 10000;
  var SCALE_LIMIT = 20;
  var GYRO_LIMIT_X = 6000;
  var GYRO_LIMIT_Y = 3000;
  var CURVE_RADIUS = 25;
  var CAMERA_Z = 3200;

  var NUMITEMS = 12;
  var POSITION_LIMIT = 5000;
  var SCALE_LIMIT = 20;
  var GYRO_LIMIT_X = 6000;
  var GYRO_LIMIT_Y = 3000;
  var CURVE_RADIUS = 25;
  var CAMERA_Z = 3200;


  function init() {

    scene = new THREE.Scene();

    // CAMERA
    camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = CAMERA_Z;

    // camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    // camera.position.set(-1.8, 0.9, 2.7);

    controls = new THREE.OrbitControls(camera);
    controls.target.set(0, -0.2, -0.2);
    controls.update();

    // TODO CHANGE IMAGE NAMES
    var path = "img/";
    var format = '.png';
    var urls = [
      path + 'px_360' + format, path + 'nx_360' + format,
      path + 'py_360' + format, path + 'ny_360' + format,
      path + 'pz_360' + format, path + 'nz_360' + format
    ];

    var loader = new THREE.CubeTextureLoader();
    loader.load( urls,
      function ( texture ) { // SUCCESS
        textureCube = texture;
        textureCube.magFilter = THREE.LinearFilter;
        material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, transparent: true, opacity: 0 } );

        // CREATE SHAPE
        var cubicCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3( -CURVE_RADIUS, 0, 0 ),
          new THREE.Vector3( -CURVE_RADIUS, CURVE_RADIUS / 2, 0 ),
          new THREE.Vector3( -CURVE_RADIUS/ 2, CURVE_RADIUS, 0 ),
          new THREE.Vector3( 0, CURVE_RADIUS, 0 )
        );
        var extrudeSettings = {
          steps     : 100,
          bevelEnabled  : false,
          extrudePath   : cubicCurve
        };
        var pts = [];
        var SHAPE_SIZE = 7;
        pts.push( new THREE.Vector2 ( SHAPE_SIZE, SHAPE_SIZE ) );
        pts.push( new THREE.Vector2 ( -SHAPE_SIZE, SHAPE_SIZE ) );
        pts.push( new THREE.Vector2 ( -SHAPE_SIZE, -SHAPE_SIZE ) );
        pts.push( new THREE.Vector2 ( SHAPE_SIZE, -SHAPE_SIZE ) );
        var shape = new THREE.Shape( pts );
        var halfCircle = new THREE.Object3D();
        var geometry1 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        var geometry2 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        geometry2.rotateZ(3*Math.PI/2);
        geometry1.merge(geometry2);
        var mesh1 = new THREE.Mesh( geometry1, material );
        var mesh2 = mesh1.clone();
        mesh2.position.x = 8;
        mesh2.position.y = -6;
        mesh2.rotation.z = Math.PI;
        halfCircle.add(mesh1);
        halfCircle.add(mesh2);

        // // ADD SHAPES
        // for ( var i = 0; i < NUMITEMS; i ++ ) {
        //   var newCircle = halfCircle.clone();
        //   newCircle.position.x = Math.random() * POSITION_LIMIT - (POSITION_LIMIT/2);
        //   newCircle.position.y = Math.random() * POSITION_LIMIT - (POSITION_LIMIT/2);
        //   newCircle.position.z = Math.random() * POSITION_LIMIT - (POSITION_LIMIT/2);
        //   newCircle.scale.x = newCircle.scale.y = newCircle.scale.z = Math.random() * SCALE_LIMIT;
        //   scene.add( newCircle );
        //   spheres.push( newCircle );
        //   sphereRotations.push({
        //     x: Math.random() * 0.03,
        //     y: Math.random() * 0.03,
        //     z: Math.random() * 0.03
        //   })
        // }


        light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        light.position.set(0, 1, 0);
        scene.add(light);

        var alight = new THREE.AmbientLight(0xffffff);
        scene.add(alight);


        // model
        var loader2 = new THREE.GLTFLoader();

        loader2.load(
          'egg3/scene.gltf',
          function (gltf) {
            scene.add(gltf.scene);
            console.log(gltf);
            var egg = gltf.scene;

            // ADD SHAPES
            for (var i = 0; i < NUMITEMS - 1; i++) {
              var newCircle = egg.clone();
              newCircle.position.x = Math.random() * POSITION_LIMIT - (POSITION_LIMIT / 2);
              newCircle.position.y = Math.random() * POSITION_LIMIT - (POSITION_LIMIT / 2);
              newCircle.position.z = Math.random() * POSITION_LIMIT - (POSITION_LIMIT / 2);
              newCircle.scale.x = newCircle.scale.y = newCircle.scale.z = 100 + Math.random() * 250;
              scene.add(newCircle);
              spheres.push(newCircle);
              sphereRotations.push({
                x: Math.random() * 0.03,
                y: Math.random() * 0.03,
                z: Math.random() * 0.03
              })
            }
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function (error) {
            console.log('An error happened');
          }
        );

        loader2.load(
          'egg4/scene.gltf',
          function (gltf) {
            scene.add(gltf.scene);
            console.log(gltf);
            var egg = gltf.scene;

            // ADD SHAPES
            for (var i = 1; i < 2; i++) {
              var newCircle = egg.clone();
              newCircle.position.x = Math.random() * POSITION_LIMIT - (POSITION_LIMIT / 2);
              newCircle.position.y = Math.random() * POSITION_LIMIT - (POSITION_LIMIT / 2);
              newCircle.position.z = Math.random() * POSITION_LIMIT - (POSITION_LIMIT / 2);
              newCircle.scale.x = newCircle.scale.y = newCircle.scale.z = 100 + Math.random() * 250;
              scene.add(newCircle);
              spheres.push(newCircle);
              sphereRotations.push({
                x: Math.random() * 0.03,
                y: Math.random() * 0.03,
                z: Math.random() * 0.03
              })
            }
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function (error) {
            console.log('An error happened');
          }
        );



        // RENDERER
        renderer = new THREE.WebGLRenderer({
          alpha: true
        });
        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight + 100);
        renderer.autoClear = true;
        container.appendChild( renderer.domElement );

        animate();

        // GYRONORM
        if (isMobile.any()) {
          var Promise = Promise || ES6Promise.Promise;
          var gn = new GyroNorm();
          var args = {
            frequency:50,
            gravityNormalized:false,
            orientationBase:GyroNorm.GAME,
            decimalCount:2,
            logger:null,
            screenAdjusted:true
          };

          gn.init(args).then(function(){
            gn.start(function(data){

              var alpha = data.do.alpha;
              var beta = data.do.beta;
              var gamma = data.do.gamma;

              if (alpha === 0 && beta === 0 && gamma === 0) {
                return;
              }

              beta = (beta < 0 ) ? 0 : beta;
              beta = (beta > 90) ? 90 : beta;
              gamma = (gamma < -40) ? -40 : gamma;
              gamma = (gamma > 40) ? 40 : gamma;

              betaPos = -1 * [ ( ( beta/90 ) * (GYRO_LIMIT_X*2) ) - GYRO_LIMIT_X ];
              gammaPos = -1 * [ ( ( (gamma+40)/80 ) * (GYRO_LIMIT_Y*2) ) - GYRO_LIMIT_Y ];

              mouseX = gammaPos;
              mouseY = betaPos;

            });
          }).catch(function(e){ // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device

          });
          // LISTENERS
          window.addEventListener( 'orientationchange', function() {
            $('#canvas-container').addClass('fade');
            setTimeout(onWindowResize, 500);
          }, false);
          document.addEventListener('focusout', function() {
            // THIS IS FOR MOBILE KEYBOARD OPEN/CLOSE. IT'S FINICKY, SO ADDING TIMEOUT
            setTimeout( onWindowResize, 200);
          }, false);
          window.addEventListener('focus', function() {
            $('#canvas-container').css('position', 'absolute');
            setTimeout( onWindowResize, 200);
          });
        } else {
          // LISTENERS
          window.addEventListener( 'resize', onWindowResize, false );
          document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        }
      },
      function ( xhr ) { // Function called when download progresses
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      function ( xhr ) { // Function called when download errors
        // console.log( 'An error happened' );
      }
    );

  }

  init();

} else { // NO WEB GL

  // TODO PUT FALLBACK HERE
  console.log("NO WEB GL");
  $('#fallback').addClass('show');

}

// WINDOW RESIZE
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight + 100 );
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  $('#canvas-container').css('position', 'fixed');
  $('#canvas-container').removeClass('fade');
}

// MOUSE MOVEMENT
function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) * 10;
  mouseY = ( event.clientY - windowHalfY ) * 10;
}

// ANIMATE / RENDER
function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
  // MOVEMENT SPEED
  var timer = 0.0003 * Date.now();

  // FADE IN SPEED
  if (material.opacity < 1) {
    material.opacity += 0.03;
  }

  // MOVE OBJECTS
  for ( var i = 0, il = spheres.length; i < il; i ++ ) {
    var sphere = spheres[ i ];
    var sphereRotation = sphereRotations[i];
    sphere.position.x = (POSITION_LIMIT/2) * Math.cos( timer / 2 + i);
    sphere.position.y = (POSITION_LIMIT/2) * Math.sin( timer / 2 + i * 1.1 );
    sphere.rotation.x += sphereRotation.x;
    sphere.rotation.y += sphereRotation.y;
    sphere.rotation.z += sphereRotation.z;
  }

  // SET CAMERA BASED ON MOUSE OR GYRO
  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}
