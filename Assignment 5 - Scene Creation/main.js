// --------------------- IMPORTS ---------------------
import * as THREE from './build/three.module.js';
import { OrbitControls } from './build/OrbitControls.js';
import { OBJLoader } from './build/OBJLoader.js';
import { MTLLoader } from './build/MTLLoader.js';


function main(){

//Get Canvas Object
var canvas = document.getElementById("myCanvas");


// ------------- CAMERA ------------------
const fov = 75;
const aspect = canvas.height/canvas.width;
const near = 0.1;
const far = 1000;
var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set(-15, 40, 100)


const controls = new OrbitControls(camera, canvas);
controls.target.set(0, -5, 0);
controls.update();


// ------------ CREATE SCENE ----------------
var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(230, 196, 233)");
var renderer = new THREE.WebGLRenderer({antialias:true, canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------ BASE STAND 1 ------------------------

const loader = new THREE.TextureLoader();
const boxWidth = 45;
const boxHeight = 5;
const boxDepth = 45;
var geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
var material = new THREE.MeshPhongMaterial({
  map: loader.load('./images/black.png')
}); 
var cube = new THREE.Mesh( geometry, material );
cube.translateY(-30);
scene.add( cube );


// ------------------------ BASE STAND 2 ------------------------
{
const loader = new THREE.TextureLoader();
const boxWidth = 35;
const boxHeight = 5;
const boxDepth = 35;
var geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
var material = new THREE.MeshPhongMaterial({
  map: loader.load('./images/black.png')
}); 
var cube = new THREE.Mesh( geometry, material );
cube.translateX(40);
cube.translateY(-50);
scene.add( cube );
}

// ----------------------- SPHERE(4) ----------------------

{
  const sphereRadius = 4;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

  const loader1 = new THREE.TextureLoader();
  const sphereMat = new THREE.MeshPhongMaterial({ color:0xC52020 });

  const mesh1 = new THREE.Mesh(sphereGeo, sphereMat);
  // mesh.castShadow = true;
  // mesh.receiveShadow = true;
  mesh1.position.set(-18, -25, 18);
  scene.add(mesh1);


  const mesh2 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh2.position.set(18, -25, 18);
  scene.add(mesh2);

  const mesh3 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh3.position.set(18, -25, -18);
  scene.add(mesh3);

  const mesh4 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh4.position.set(-18, -25, -18);
  scene.add(mesh4);
}

// ----------------------- SPHERE(4)-2 ----------------------

{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

  const loader1 = new THREE.TextureLoader();
  const sphereMat = new THREE.MeshPhongMaterial({ color:0xC52020 });

  const mesh1 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh1.position.set(27, -45, 15);
  scene.add(mesh1);

  const mesh2 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh2.position.set(53, -45, 15);
  scene.add(mesh2);

  const mesh3 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh3.position.set(27, -45, -15);
  scene.add(mesh3);

  const mesh4 = new THREE.Mesh(sphereGeo, sphereMat);
  mesh4.position.set(53, -45, -15);
  scene.add(mesh4);
}

// ------------------------ CROWN 1 ----------------------

var crown = null
{
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
    mtlLoader.load('./OBJ/Crown/crown.mtl', (mtl) => {    
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./OBJ/Crown/crown.obj', (root) => {
    crown = root
    crown.rotation.x = 29.85;
    crown.translateZ(-30)
    scene.add(crown);
    });
  });
}
makeLabel(4500, 600, 'The Crown Jewel', [0, -5, 0]);



// --------------------- CROWN 2 ------------------------------

var crown2 = null
{
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('./OBJ/Diamond/diamond.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./OBJ/Diamond/diamond.obj', (root) => {
      crown2 = root
      crown2.scale.set(3, 3, 3);
      crown2.translateY(-49);
      crown2.translateX(40);
      crown2.rotation.x=29.85;
      scene.add(crown2);
    });
  });
}

// --------------------    POLICE  ----------------------------

{
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
    mtlLoader.load('./OBJ/Police/policeman.mtl', (mtl) => {    
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./OBJ/Police/policeman.obj', (root) => {
    root.scale.set(50, 50, 50);
    root.translateX(-80)
    root.translateY(-150)
    root.translateZ(-70)
    scene.add(root);
    });
  });
}

// -------------------- BASE CYLINDER -----------------------


{
  const geometry = new THREE.CylinderGeometry(15, 15, 150, 32);
  const material = new THREE.MeshPhongMaterial({ 
    map: loader.load('./images/velvet.png')
  });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(0, -107, 0);
  scene.add(cylinder);
}

// -------------------- BASE CYLINDER 2 -----------------------

{
  const geometry = new THREE.CylinderGeometry(10, 10, 120, 32);
  const material = new THREE.MeshPhongMaterial({ 
    map: loader.load('./images/velvet.png')
  });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(40, -111, 0);
  scene.add(cylinder);
}


// --------------- CUBE STACK CORNER LEFT -------------
{
const loader = new THREE.TextureLoader();
const boxWidth = 40;
const boxHeight = 40;
const boxDepth = 30;
var geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
var material = new THREE.MeshPhongMaterial({
  map: loader.load('./images/red_silk.jpg')
}); 
var cube1 = new THREE.Mesh( geometry, material );
cube1.translateX(150);
cube1.translateZ(-120);
cube1.translateY(-200);
scene.add( cube1 );

var cube3 = new THREE.Mesh( geometry, material );
cube3.translateX(150);
cube3.translateZ(-120);
cube3.translateY(-120);
scene.add( cube3 );

var material = new THREE.MeshPhongMaterial({
  map: loader.load('./images/blue.jpg')
}); 

var cube2 = new THREE.Mesh( geometry, material );
cube2.translateX(130);
cube2.translateZ(-120);
cube2.translateY(-160);
scene.add( cube2 );

var cube4 = new THREE.Mesh( geometry, material );
cube4.translateX(130);
cube4.translateZ(-120);
cube4.translateY(-80);
scene.add( cube4 );
}

// --------------- CUBE STACK CORNER RIGHT -------------
{
  const loader = new THREE.TextureLoader();
  const boxWidth = 40;
  const boxHeight = 40;
  const boxDepth = 30;
  var geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  var material = new THREE.MeshPhongMaterial({
    map: loader.load('./images/red_silk.jpg')
  }); 
  var cube1 = new THREE.Mesh( geometry, material );
  cube1.translateX(-150);
  cube1.translateZ(-120);
  cube1.translateY(-200);
  scene.add( cube1 );
  
  var cube3 = new THREE.Mesh( geometry, material );
  cube3.translateX(-150);
  cube3.translateZ(-120);
  cube3.translateY(-120);
  scene.add( cube3 );
  
  var material = new THREE.MeshPhongMaterial({
    map: loader.load('./images/blue.jpg')
  }); 
  
  var cube2 = new THREE.Mesh( geometry, material );
  cube2.translateX(-130);
  cube2.translateZ(-120);
  cube2.translateY(-160);
  scene.add( cube2 );
  
  var cube4 = new THREE.Mesh( geometry, material );
  cube4.translateX(-130);
  cube4.translateZ(-120);
  cube4.translateY(-80);
  scene.add( cube4 );
  }

// ---------- Render Loop --------------
function animate_crown(crown){
  crown.rotation.z += 0.005;
}

var render = function () {
  requestAnimationFrame(render);


  if(crown){animate_crown(crown)}
  if(crown2){animate_crown(crown2)}


  //Dynamic WebPage
  const canvas_ = renderer.domElement;
  camera.aspect = canvas_.clientWidth / canvas_.clientHeight;
  camera.updateProjectionMatrix();

  // Render the scene
  renderer.render(scene, camera);

};


// ------------ LIGHT -----------------

{
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(10, 0, 10);
scene.add(light);
}

{
const skyColor = 0xB1E1FF;  
const groundColor = 0xB97A20;  
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);
}

{
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.SpotLight(color, intensity);
scene.add(light);
scene.add(light.target);

// const spotLightHelper = new THREE.SpotLightHelper( light );
// scene.add( spotLightHelper );
}

// ------------ SKY BOX ---------------
  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'images/front.jpg', //left side
      'images/front.jpg', //right side
      'images/top.jpg', //top
      'images/floor.jpg', // down
      'images/back.jpg', //back
      'images/front.jpg', //front
    ]);
    scene.background = texture;
  }


// ------------------- LABEL --------------------

function makeLabel(labelWidth, size, name, posxyz) {
  const canvas = makeLabelCanvas(labelWidth, size, name);
  const texture = new THREE.CanvasTexture(canvas);

  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const labelMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const root = new THREE.Object3D();

  const labelBaseScale = 0.01;
  const label = new THREE.Sprite(labelMaterial);
  root.add(label);
  label.position.x = posxyz[0];
  label.position.y = posxyz[1] + 4;
  label.position.z = posxyz[2];

  label.scale.x = canvas.width * labelBaseScale;
  label.scale.y = canvas.height * labelBaseScale;

  scene.add(root);
  return root;
}

function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font = `${size}px bold georgia`;
  ctx.font = font;

  const textWidth = ctx.measureText(name).width;
  const doubleBorderSize = borderSize * 2;
  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillRect(0, 0, width, height);

  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'white';
  ctx.fillText(name, 0, 0);

  return ctx.canvas;
}

render();
}
main();