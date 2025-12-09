//fields
var width;
var height;
var scene;
var camera;
var renderer;
var sphere;
var xRot, yRot, zRot, triangles, radius, phis, phil, thes, thel; // sliders 
const container = document.getElementById('badge');
function init(container) {
    if(!container) return;
    xRot = yRot = zRot = 0.001;
    radius = phis = phil = thes = thel = 10;
    radius = 500;
    phis = 180;
    phil = 6.28;
    thes = 0; 
    thel = 3.14;

    triangles = 20;
    //Set width 
    // width = window.innerWidth;
    width = container.offsetWidth;
    //set Height
    // height = window.innerHeight;
    height = container.offsetHeight;
    //Create Scene
    scene = new THREE.Scene();
    //Create Camera
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
    camera.position.z = 1000;
    //Create Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    //Add Renderer to webpage
    container.appendChild(renderer.domElement);
};

function createSphere() {
  //Create Sphere by passing to it the geometry w,h,d, number of polygons making up the face 
  sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, triangles,triangles,phis,phil,thes,thel), new THREE.MeshBasicMaterial({
    color: 0x00FF00, //The color chosen for the mesh 
    wireframe: true //Shade in or wireframe?
  }));
  scene.add(sphere); //Add to scene
};

function updateSphere()
{
  scene.remove(sphere);
  oldRotationX = sphere.rotation.x;
  oldRotationY = sphere.rotation.y;
  oldRotationZ = sphere.rotation.z;
  createSphere();
  sphere.rotation.x = oldRotationX;
  sphere.rotation.y = oldRotationY;
  sphere.rotation.z = oldRotationZ;
}

function update() {
  requestAnimationFrame(update);
  sphere.rotation.x += xRot;
  sphere.rotation.y += yRot;
  sphere.rotation.z += zRot;
  renderer.render(scene, camera);
}

// $('input[name=xRot]').on('input', function() {
//   xRot = parseFloat(this.value);
// });

// $('input[name=yRot]').on('input', function() {
//   yRot = parseFloat(this.value);
// });

// $('input[name=zRot]').on('input', function() {
//   zRot = parseFloat(this.value);
// });

// $('input[name=triangles]').on('input', function() {
//   triangles = parseInt(this.value);
//   updateSphere();
// });

// $('input[name=zCam]').on('input', function() {
//   camera.position.z = 2500-parseInt(this.value);
// });

// $('input[name=radius]').on('input', function() {
//   radius = parseInt(this.value);
//   updateSphere();
// });


// $('input[name=phis]').on('input', function() {
//   phis = parseFloat(this.value);
//   updateSphere();
// });

// $('input[name=phil]').on('input', function() {
//   phil = parseFloat(this.value);
//   updateSphere();
// });

// $('input[name=thes]').on('input', function() {
//   thes = parseInt(this.value);
//   updateSphere();
// });

// $('input[name=thel]').on('input', function() {
//   thel = parseInt(this.value);
//   updateSphere();
// });
(function(){
    init(container);
    createSphere();
    update();
}())