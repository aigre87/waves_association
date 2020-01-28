import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { gsap } from "gsap";
import fragShader from './fragment.glsl';
import fragShaderTrail from './fragment-trail.glsl';
import fragShaderFinal from './fragment-final.glsl';
import testShader from './test-shader.glsl';
import vertexShader from './vertex.glsl';
import mouseSpeed from '../libs/mouse-speed'
import BasicShader from './BasicShader';
import BufferManager from './BufferManager';

class App {
    constructor(container) {
        this.block = null;
        this.blockWidth = null;
        this.blockHeight = null;
        this.canvas = container;
        this.texture = null;
        this.video = null;
        this.time = 0.0;
        this.videoTexture = null;
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.uniforms = {};
        this.material = {};
        this.mouseSpeed = null;
        this.plane = null;
        this.controls = null;
    }

    init() {
        this.block = document.getElementById('introBlock');

        this.scene = new THREE.Scene();
        this.scene2 = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(80, this.block.offsetWidth / this.block.offsetHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 1);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
        });

        this.renderTarget = new THREE.WebGLRenderTarget(1200, 500);

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enabled = true;
        // this.controls.maxDistance = 1500;
        // this.controls.minDistance = 0;



        document.addEventListener('mousemove', (e) => {
            this.uniforms.u_mouse.value.x = e.clientX;
            this.uniforms.u_mouse.value.y = e.clientY + window.pageYOffset;
        });
        window.addEventListener('resize', this.onResize.bind(this));

        const onCalcSpeed = () => {
            let speedX = Math.abs(this.mouseSpeed.speedX);
            let speedY = Math.abs(this.mouseSpeed.speedY);
            let speed = (speedX + speedY) / 2 > 70 ? 70.0 : ((speedX + speedY) / 2);
            this.uniforms.u_mouseSpeed.value = speed;
        };
        this.mouseSpeed = new mouseSpeed();
        this.mouseSpeed.init(onCalcSpeed);

        this.createUniforms();
        this.createObj();
        this.onResize();
        this.animate();

        window.scene = this.scene;
    }

    createUniforms() {
        const loader = new THREE.TextureLoader( );
        this.channel0 = loader.load('../images/grid.png');
        this.channel0.minFilter = THREE.LinearFilter;
        const channel0 = this.texture;

        this.video = document.getElementById( 'intro__bg-video' );
        this.video.defaultPlaybackRate = -1;
        this.video.preload = "auto";
        this.video.load();
        this.video.play();
        this.videoTexture = new THREE.VideoTexture( this.video );
        this.videoTexture.needsUpdate = true;
        const videoTexture = this.videoTexture;

        this.video.minFilter = THREE.LinearFilter;
        this.video.magFilter = THREE.LinearFilter;
        this.video.format = THREE.RGBFormat;
        const time = this.time;
        this.uniforms = {
            u_img1: { type: 't', value: channel0 },
            u_video: { type: 't', value: videoTexture },
            u_time: { type: 'f', value: time },
            u_imageResolution: { type: 'v2', value: new THREE.Vector2(1920, 1080), },
            u_resolution: { type: 'v2', value: new THREE.Vector2() },
            u_ratio: { type: 'f', value: 1.0 },
            u_mouse: { type: 'v2', value: new THREE.Vector2() },
            u_mouseSpeed: { type: 'f', value: 0.0 },
            texture: { type: 't', value: null },
        };
    }

    createObj() {
        this.targets = [
            this.targetA = new BufferManager(this.renderer, { width: this.width, height: this.height }),
            this.targetB = new BufferManager(this.renderer, { width: this.width, height: this.height }),
            this.targetC = new BufferManager(this.renderer, { width: this.width, height: this.height })
        ];
        this.buffers = [
            this.bufferA = new BasicShader(testShader, {
                u_channel0: { value: this.channel0 },
                u_channel1: { value: null },
                ...this.uniforms
            }),

            // this.bufferB = new BasicShader(fragShaderTrail, {
            //     u_channel0: { value: null },
            //     ...this.uniforms
            // }),
            //
            // this.bufferImage = new BasicShader(fragShaderFinal, {
            //     u_channel0: { value: this.channel0 },
            //     u_channel1: { value: null },
            //     ...this.uniforms
            // }),
        ];
    }


    animate() {
        requestAnimationFrame(() => {
            this.time += 1.0;
            this.uniforms.u_time.value = this.time;

            this.bufferA.uniforms['u_time'].value = this.time;

            // this.bufferA.uniforms['u_channel0'].value = this.targetA.readBuffer.texture
            // this.bufferA.uniforms['u_channel1'].value = this.targetB.readBuffer.texture
            this.targetA.render(this.bufferA.scene, this.camera)
            //
            // this.bufferB.uniforms['u_channel0'].value = this.targetB.readBuffer.texture
            // this.targetB.render(this.bufferB.scene, this.camera)
            //
            // this.bufferImage.uniforms['u_channel1'].value = this.targetA.readBuffer.texture
            // this.targetC.render(this.bufferImage.scene, this.camera, true)

            this.animate()
        });
    }

    onResize() {
        this.width = this.block.offsetWidth;
        this.height = this.block.offsetHeight;
        this.renderer.setSize(this.blockWidth, this.blockHeight);
        this.targets.forEach( (target) => {
            target.readBuffer.setSize(this.blockWidth, this.blockHeight);
        });

        this.uniforms.u_resolution.value.x = this.blockWidth;
        this.uniforms.u_resolution.value.y = this.blockHeight;
        this.uniforms.u_ratio.value = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y;

        this.camera.aspect = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y;
        this.camera.updateProjectionMatrix();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scene = new App(document.getElementById('intro__bg-canvas'));
    scene.init();
});
