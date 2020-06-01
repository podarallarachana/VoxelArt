import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TestScene } from "./scene";

import "./styles/main.scss";

var camera, controls, scene, renderer;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  //   scene.fog = new THREE.FogExp2(0xffffff, 0.002);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(400, 200, 0);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  // lights
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1, -1, -1).normalize();
  scene.add(light);

  // world
  var geometry = new THREE.BoxBufferGeometry(30, 30, 30, 4, 1);
  var material = new THREE.MeshPhongMaterial({
    ambient: 0x050505,
    color: 0xe2e2e2,
    specular: 0x2784,
    shininess: 100,
    opacity: 0.1,
    transparent: true,
  });

  for (var x = 0; x < 400; x += 40) {
    for (var y = 0; y < 400; y += 40) {
      for (var z = 0; z < 400; z += 40) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
      }
    }
  }

  //Create floor
  var planeGeometry = new THREE.PlaneBufferGeometry(500, 500, 1, 1);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xe8e8e8,
    side: THREE.DoubleSide,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -5;
  plane.rotateX(-Math.PI / 2);
  scene.add(plane);

  // resizable canvas
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}
