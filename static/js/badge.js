
/* 
    badge.js
     
    generic, should be replaced per site
    to draw and update the badge

    based on https://codepen.io/Metrophobe/pen/VjeMyX
*/

class Badge {
  constructor(container = document.getElementById('badge'), menu=document.getElementById('menu')) {
    this.container = container;
    if (!this.container) return;
    this.menu = menu;

    this.xRot = 0.001;
    this.yRot = 0.001;
    this.zRot = 0.001;
    this.radius = 400;
    this.phis = 180;
    // this.phil = 6.28;
    this.thes = 0;
    this.thel = Math.PI;
    this.triangles = {
        // current: 20,
        // current: 4,
        current: 3,
        max: 36,
        min: 2,
        step: 1,
        increasing: true
    };
    this.phil = {
        current: Math.PI * 2,
        max: 6.28,
        min: -6.28,
        step: 0.005,
        increasing: false
    };
    this.updateSphere_counter = 0;
    this.timer = null;
    this.timestampOnPause = false;
    this.timestampDiff = 0;
    this.lastTime = null;
    this.isPlaying = true;
    this.isFrozen = false;
    this.pointerIsDown = false;
    this.pointerLastX = 0;
    this.pointerLastY = 0;
    this.worldAxisX = new THREE.Vector3(1, 0, 0);
    this.worldAxisY = new THREE.Vector3(0, 1, 0);
    this.tmpQuat = new THREE.Quaternion();
    this.dragMoved = false;
    this.isTouchDrag = false;
    this.suppressClick = false;
    this.menuIsExpanded = menu && !menu.classList.contains('hidden');
    this.initialized = false;
    this.init();
    
    this.createSphere();
    this.animate();
    this.initialized = true;
  }

  init() {
    this.size = Math.min(this.container.offsetWidth, this.container.offsetHeight)
    this.width = this.height = this.size;
    this.initStage();
    this.renderer.domElement.style.touchAction = 'none';
    this.addListeners();
  }
  initStage(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 3000);
    this.camera.position.z = 1000;

    const canvas = document.querySelector('#threejs-canvas');
    this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    this.renderer.setClearColor(0x000000, 0);   
    this.renderer.setSize(this.width, this.height);
  }
  addListeners(){
    const el = this.renderer.domElement;
    if (window.PointerEvent) {
      el.addEventListener('pointerdown', (event)=>{
        this.handlePointerDown(event);
      });
      el.addEventListener('pointermove', (event)=>{
        this.handlePointerMove(event);
      });
      el.addEventListener('pointerup', (event)=>{
        this.handlePointerUp(event);
      });
      el.addEventListener('pointercancel', (event)=>{
        this.handlePointerUp(event);
      });
      el.addEventListener('pointerleave', (event)=>{
        this.handlePointerUp(event);
      });
    } else {
      el.addEventListener('mousedown', (event)=>{
        this.handlePointerDown(event);
      });
      el.addEventListener('mousemove', (event)=>{
        this.handlePointerMove(event);
      });
      el.addEventListener('mouseup', ()=>{
        this.handlePointerUp();
      });
      el.addEventListener('mouseleave', ()=>{
        this.handlePointerUp();
      });
      el.addEventListener('touchstart', (event)=>{
        this.handleTouchStart(event);
      }, { passive: false });
      el.addEventListener('touchmove', (event)=>{
        this.handleTouchMove(event);
      }, { passive: false });
      el.addEventListener('touchend', ()=>{
        this.handlePointerUp();
      });
      el.addEventListener('touchcancel', ()=>{
        this.handlePointerUp();
      });
    }
    // el.addEventListener('click', (event)=>{
    //   this.handleClick(event);
    // });
    if (this.container && this.container !== el) {
      this.container.addEventListener('click', (event)=>{
        this.handleContainerClick(event);
      }, true);
    }
  }
  createSphere() {
    const geo = new THREE.SphereGeometry(
      this.radius,
      this.triangles.current,
      this.triangles.current,
      this.phis,
      Math.PI * 2,
      this.thes,
      Math.PI
    );
    console.log(geo.vertices.length);
    geo.mergeVertices();

    this.vertexBasePositions = geo.vertices.map((v) => v.clone());
    console.log(geo.vertices.length);
    this.sphere = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    this.scene.add(this.sphere);
  }

  updateSphere() {
    if (!this.scene || !this.sphere) {
      // console.log('r');
      return;
    }
    // this.sphere.needsUpdate = true;
    // const oldRotationX = this.sphere.rotation.x;
    // const oldRotationY = this.sphere.rotation.y;
    // const oldRotationZ = this.sphere.rotation.z;
    // this.scene.remove(this.sphere);
    // this.createSphere();
    // console.log(oldRotationX, oldRotationY);
    // this.sphere.rotation.x = oldRotationX;
    // this.sphere.rotation.y = oldRotationY;
    // this.sphere.rotation.z = oldRotationZ;
  }

  animate(timestamp = performance.now()) {
    if (!this.sphere) return;
    if(!this.lastTime && this.initialized !== false) {
      this.timestampDiff += timestamp - this.timestampOnPause;
      this.timestampOnPause = false;
    }
    this.timer = requestAnimationFrame((nextTs) => this.animate(nextTs));
    const frameDelta = this.lastTime ? (timestamp - this.lastTime) / 16.6667 : 1;
    this.lastTime = timestamp;
    this.sphere.rotation.x += this.xRot * frameDelta;
    this.sphere.rotation.y += this.yRot * frameDelta;
    this.sphere.rotation.z += this.zRot * frameDelta;
    const verts = this.sphere.geometry.vertices;
    for (let i = 0; i < verts.length; i++) {
      const base = this.vertexBasePositions[i];
      const n = 0.1 * Math.sin((this.lastTime - this.timestampDiff) * 0.0005 + i);
      verts[i].set(base.x + base.x * n, base.y + base.y * n, base.z + base.z * n);
    }
    this.sphere.geometry.verticesNeedUpdate = true;
    this.updateSphere_counter += frameDelta; // accumulate frame-equivalent units

/*
    move a vertex i
const i = 10;
const geometry = this.sphere.geometry;
const pos = geometry.attributes.position;
const v = new THREE.Vector3(
  pos.getX(i),
  pos.getY(i),
  pos.getZ(i)
);
v.normalize().multiplyScalar(0.2); // amount to move
pos.setXYZ(
  i,
  pos.getX(i) + v.x,
  pos.getY(i) + v.y,
  pos.getZ(i) + v.z
);
console.log(this.sphere);
*/

    // if (this.updateSphere_counter >= 3) {
    //     const steps = Math.floor(this.updateSphere_counter / 3);
    //     // for (let i = 0; i < steps; i++) {
    //     //     this.updateTriangle();
    //     //     this.updatePhil();
    //     // }
    //     // this.updateTriangle();
    //     // this.updatePhil();
    //     this.updateSphere();
    //     // this.updateSphere_counter -= steps * 3;
    //     this.updateSphere_counter -= steps * 5;
    // }
    
    
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
  handlePointerDown(e){
    // if(this.isFrozen) return;
    // if(menu && !menu.classList.contains('hidden')) return;
    // menu is not open
    this.pause();
    this.pointerIsDown = true;
    this.dragMoved = false;
    // console.log('handlePointerDown');
    // console.log(e.pointerType, e.type, e.touches);
    this.isTouchDrag = e.pointerType === 'touch' || e.type === 'touchstart' || !!e.touches;
    // console.log('isTouchDrag', this.isTouchDrag);
    this.pointerLastX = e.clientX;
    this.pointerLastY = e.clientY;
    this.renderer.domElement.style.cursor = 'grabbing';
  }
  handlePointerMove(e){
    if(!this.pointerIsDown) return;
    const dx = e.clientX - this.pointerLastX,
    dy = e.clientY - this.pointerLastY;
    if(Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
      return;
    }
    this.dragMoved = true;
    this.pointerLastX = e.clientX;
    this.pointerLastY = e.clientY;
    const dev = 0.005;
    // Rotate around fixed world axes so yaw stays stable after pitch.
    this.rotateAroundWorldAxis(this.sphere, this.worldAxisX, dy * dev);
    this.rotateAroundWorldAxis(this.sphere, this.worldAxisY, dx * dev);
    this.updateSphere();
    this.renderer.render(this.scene, this.camera);
  }
  
  handlePointerUp(){
    if(!this.pointerIsDown) return;
    this.pointerIsDown = false;
    if (this.isTouchDrag) {
      this.suppressClick = true; // block synthetic click after touch drag
      setTimeout(() => { this.suppressClick = false; }, 0);
    }
    this.isTouchDrag = false;
    console.log();
    if(this.isFrozen) {
      // hiding menu
      this.isFrozen = false;
      this.resume();
    } else {
      if(this.dragMoved) {
        this.resume();
      } else {
        // showing menu
        this.isFrozen = true;
      }
    }
    
    this.renderer.domElement.style.cursor = 'auto';
  }
  handleTouchStart(e){
    if (!e.touches || e.touches.length === 0) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.handlePointerDown(touch);
  }
  handleTouchMove(e){
    if (!this.pointerIsDown) return;
    if (!e.touches || e.touches.length === 0) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.handlePointerMove(touch);
  }
  handleClick(e){
    if (this.suppressClick || this.dragMoved) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
  }
  handleContainerClick(e){
    // preventing menu from opening when dragging
    // console.log(this.suppressClick, this.dragMoved);
    if (this.suppressClick || this.dragMoved) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  rotateAroundWorldAxis(obj, axis, angle) {
    // Custom world-axis rotation for builds lacking Object3D.rotateOnWorldAxis
    this.tmpQuat.setFromAxisAngle(axis, angle);
    obj.quaternion.multiplyQuaternions(this.tmpQuat, obj.quaternion);
  }
  resume(){
    console.log('resume');
    this.lastTime = null;
    this.animate();
  }
  pause(){
    console.log('pause')
    if(this.timer) {
      cancelAnimationFrame(this.timer);
      if(!this.timestampOnPause) {
        this.timestampOnPause = this.lastTime.toFixed(1);
      }
      this.timer = null;
    }
  }
  start_stop(){
    console.log('start_stop');
    if(this.isPlaying) {
        this.pause();
    } else {
        this.resume();
    }
    this.isPlaying = !this.isPlaying;
  }
}

const canvasContainer = document.getElementById('badge');
const badge = new Badge(canvasContainer);

// setTimeout(()=>{
//   badge.pause();
//   setTimeout(()=>{
//     badge.resume();
//   }, 2000);
// },2000);