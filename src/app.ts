import "../css/tailwind.css";
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { inherits } from "util";

console.log("testing... 1 2 3");

let container: HTMLElement;
let controls: OrbitControls;
let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let light: THREE.HemisphereLight | THREE.DirectionalLight;

const clock = new THREE.Clock();


init();
animate();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add(light);

    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    // grid.material[1].opacity = 0.2;
    //  grid.material[0].transparent = true;
    scene.add(grid);

    const loader = new FBXLoader();

    loader.load('models/Samba Dancing.fbx',
        (object) => {
            console.log(object);
            object.traverse((child) => {
                console.log(child);
            });
            // mixer = new THREE.AnimationMixer(object);
            // let action = mixer.clipAction(object.animations[0]);
            // action.play();

            // object.traverse(function (child) {
            //     if (child.isMesh) {
            //         child.castShadow = true;
            //         child.receiveShadow = true;
            //     }
            // });

            scene.add(object);
        },
        () => { },
        (error) => {
            console.log("ERROR");
            console.log(error);
        });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    container?.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();
}

function animate() {
    requestAnimationFrame(animate);
    // if (mixer) {
    //     mixer.update(delta);
    // }
    renderer.render(scene, camera);
}