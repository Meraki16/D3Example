///* source code from: http://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html */

//var width = window.innerWidth,
//    height = window.innerHeight;

//var scene = new THREE.Scene();

//var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
//camera.position.z = 1.5;

//var renderer = new THREE.WebGLRenderer();
//renderer.setSize(width, height);


///* light settings */
//scene.add(new THREE.AmbientLight(0x333333));

//var light = new THREE.DirectionalLight(0xffffff, 1);
//light.position.set(5, 3, 5);
//scene.add(light);

///* load earth mesh and add texture */
//new THREE.Mesh(
//    new THREE.SphereGeometry(0.5, 32, 32),
//    new THREE.MeshPhongMaterial({
//        map: THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
//        bumpMap: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
//        bumpScale: 0.005,
//        specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
//        specular: new THREE.Color('grey')
//    })
//);

//new THREE.Mesh(
//    new THREE.SphereGeometry(0.503, 32, 32),
//    new THREE.MeshPhongMaterial({
//        map: THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
//        transparent: true
//    })
//);


///* interactions */
//var controls = new THREE.TrackballControls(camera);

//render();

//function render() {
//    controls.update();
//    sphere.rotation.y += 0.0005;
//    clouds.rotation.y += 0.0005;
//    requestAnimationFrame(render);
//    renderer.render(scene, camera);
//}

var camera, scene, renderer;
var mesh;

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas") });

    camera = new THREE.PerspectiveCamera(70, 1, 1, 100);
    camera.position.z = 25;

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(10, 100, 100);
    var material = new THREE.MeshPhongMaterial();

    THREE.ImageUtils.crossOrigin = '';
    material.map = THREE.ImageUtils.loadTexture('http://s3-us-west-2.amazonaws.com/s.cdpn.io/1206469/earthmap1k.jpg')

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x += 0.5;
    scene.add(mesh);

    var light1 = new THREE.AmbientLight(0xffffff);
    light1.position.set(100, 50, 100);
    scene.add(light1);
}

function resize() {
    var width = renderer.domElement.clientWidth;
    var height = renderer.domElement.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function animate() {
    resize();
    mesh.rotation.y += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

