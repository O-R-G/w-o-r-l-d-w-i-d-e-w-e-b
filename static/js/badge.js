
/* 
    badge.js
     
    generic, should be replaced per site
    to draw and update the badge

    based on https://codepen.io/Metrophobe/pen/VjeMyX
*/

class Badge {
  constructor(container = document.getElementById('badge')) {
    this.container = container;
    if (!this.container) return;

    this.xRot = 0.001;
    this.yRot = 0.001;
    this.zRot = 0.001;
    this.radius = 500;
    this.phis = 180;
    // this.phil = 6.28;
    this.thes = 0;
    this.thel = 3.14;
    this.triangles = {
        current: 20,
        max: 36,
        min: 2,
        step: 1,
        increasing: true
    };
    this.phil = {
        current: 6.28,
        max: 6.28,
        min: -6.28,
        step: 0.005,
        increasing: false
    };
    this.updateSphere_counter = 0;

    this.timer = null;
    this.lastTime = null;
    this.isPlaying = true;

    this.init();
    this.createSphere();
    this.update();
  }

  init() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // console.log(this.width);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 3000);
    this.camera.position.z = 1000;

	this.renderer = new THREE.WebGLRenderer({
  		alpha: true,
  		antialias: true
	});
	this.renderer.setClearColor(0x000000, 0);   
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
  }

  createSphere() {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        this.radius,
        this.triangles.current,
        this.triangles.current,
        this.phis,
        this.phil.current,
        this.thes,
        this.thel
      ),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
      })
    );
    this.scene.add(this.sphere);
  }

  updateSphere() {
    if (!this.scene || !this.sphere) return;
    const oldRotationX = this.sphere.rotation.x;
    const oldRotationY = this.sphere.rotation.y;
    const oldRotationZ = this.sphere.rotation.z;
    this.scene.remove(this.sphere);
    this.createSphere();
    this.sphere.rotation.x = oldRotationX;
    this.sphere.rotation.y = oldRotationY;
    this.sphere.rotation.z = oldRotationZ;
  }

  update(timestamp = performance.now()) {
    if (!this.sphere) return;
    this.timer = requestAnimationFrame((nextTs) => this.update(nextTs));
    const frameDelta = this.lastTime ? (timestamp - this.lastTime) / 16.6667 : 1;
    this.lastTime = timestamp;
    this.sphere.rotation.x += this.xRot * frameDelta;
    this.sphere.rotation.y += this.yRot * frameDelta;
    this.sphere.rotation.z += this.zRot * frameDelta;
    this.updateSphere_counter += frameDelta; // accumulate frame-equivalent units
    if (this.updateSphere_counter >= 3) {
        const steps = Math.floor(this.updateSphere_counter / 3);
        // for (let i = 0; i < steps; i++) {
        //     this.updateTriangle();
        //     this.updatePhil();
        // }
        // this.updateTriangle();
        // this.updatePhil();
        this.updateSphere();
        // this.updateSphere_counter -= steps * 3;
        this.updateSphere_counter -= steps * 5;
    }
    
    
    this.renderer.render(this.scene, this.camera);
  }
  updateTriangle(){
    if(this.triangles.increasing) {
        this.triangles.current += this.triangles.step;
        // this.triangles.current ++;
        if(this.triangles.current === this.triangles.max)
            this.triangles.increasing = !this.triangles.increasing;
    } else {
        this.triangles.current -= this.triangles.step;
        // this.triangles.current --;
        if(this.triangles.current === this.triangles.min)
            this.triangles.increasing = !this.triangles.increasing;
    }
  }
  updatePhil(){
    if(this.phil.increasing) {
        this.phil.current += this.phil.step;
        if(this.phil.current === this.phil.max)
            this.phil.increasing = !this.phil.increasing;
    } else {
        this.phil.current -= this.phil.step;
        if(this.phil.current === this.phil.min)
            this.phil.increasing = !this.phil.increasing;
    }
  }
  resume(){
    this.lastTime = null;
    this.update();
  }
  pause(){
    if(this.timer) {
        cancelAnimationFrame(this.timer);
        this.timer = null;
    }
  }
  start_stop(){
    if(this.isPlaying) {
        this.pause();
    } else {
        this.resume();
    }
    this.isPlaying = !this.isPlaying;
  }
}

const badgeContainer = document.getElementById('badge');
const badge = new Badge(badgeContainer);

// Example control wiring (uncomment if needed):
// $('input[name=xRot]').on('input', function() {
//   badge.xRot = parseFloat(this.value);
// });
// $('input[name=yRot]').on('input', function() {
//   badge.yRot = parseFloat(this.value);
// });
// $('input[name=zRot]').on('input', function() {
//   badge.zRot = parseFloat(this.value);
// });
// $('input[name=triangles]').on('input', function() {
//   badge.triangles = parseInt(this.value);
//   badge.updateSphere();
// });
// $('input[name=zCam]').on('input', function() {
//   badge.camera.position.z = 2500 - parseInt(this.value);
// });
// $('input[name=radius]').on('input', function() {
//   badge.radius = parseInt(this.value);
//   badge.updateSphere();
// });
// $('input[name=phis]').on('input', function() {
//   badge.phis = parseFloat(this.value);
//   badge.updateSphere();
// });
// $('input[name=phil]').on('input', function() {
//   badge.phil = parseFloat(this.value);
//   badge.updateSphere();
// });
// $('input[name=thes]').on('input', function() {
//   badge.thes = parseInt(this.value);
//   badge.updateSphere();
// });
// $('input[name=thel]').on('input', function() {
//   badge.thel = parseInt(this.value);
//   badge.updateSphere();
// });
