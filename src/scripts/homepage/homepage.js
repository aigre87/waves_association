import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { gsap } from "gsap";
import fragShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import mouseSpeed from '../libs/mouse-speed'

class BasicCube {
    constructor(container) {
        this.canvas = container;
        this.texture = null;
        this.video = null;
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.uniforms = {};
        this.material = {};
        this.mouseSpeed = null;
        this.plane = null;
        this.controls = null;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 1);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
        });

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.maxDistance = 1500;
        this.controls.minDistance = 0;

        window.addEventListener('resize', this.onResize.bind(this));

        this.createUniforms();
        this.createObj();
        this.onResize();
        this.animate();

        window.scene = this.scene;
    }

    createUniforms() {
        const loader = new THREE.TextureLoader();
        this.texture = loader.load('../images/grid.png');
        this.texture.minFilter = THREE.LinearFilter;
        const img1 = this.texture;

        let video = document.getElementById( 'intro__bg-video' );
        video.play();
        this.video = new THREE.VideoTexture( video );
        // this.video.minFilter = THREE.LinearFilter;
        // this.video.magFilter = THREE.LinearFilter;
        // this.video.format = THREE.RGBFormat;

        this.uniforms = {
            img1: { type: 't', value: img1 },
            video: { type: 't', value: video },
            u_time: { type: 'f', value: 1.0 },
            u_imageResolution: { type: 'v2', value: new THREE.Vector2(1920, 1080), },
            u_resolution: { type: 'v2', value: new THREE.Vector2() },
            u_mouse: { type: 'v2', value: new THREE.Vector2() },
            u_mouseSpeed: { type: 'f', value: 0.0 },
        };

        const uniform = this.uniforms;

        this.material = new THREE.ShaderMaterial({
            uniforms: uniform,
            vertexShader: vertexShader,
            fragmentShader: fragShader,
        });

        const onCalcSpeed = () => {
            let speedX = Math.abs(this.mouseSpeed.speedX);
            let speedY = Math.abs(this.mouseSpeed.speedY);
            let speed = (speedX + speedY) / 2 > 70 ? 70.0 : ((speedX + speedY) / 2);
            uniform.u_mouseSpeed.value = speed;
        };

        this.mouseSpeed = new mouseSpeed();
        this.mouseSpeed.init(onCalcSpeed);

        document.addEventListener('mousemove', (e) => {
            uniform.u_mouse.value.x = e.clientX;
            uniform.u_mouse.value.y = e.clientY;
        });
    }

    createObj() {
        const mat = this.material;
        const geometry = new THREE.PlaneBufferGeometry(2, 2);

        this.plane = new THREE.Mesh(geometry, mat);
        this.scene.add(this.plane);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.uniforms.u_time.value += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;

        this.camera.aspect = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y;
        this.camera.updateProjectionMatrix();
    }
}


const scene = new BasicCube(document.getElementById('intro__bg-canvas'));
