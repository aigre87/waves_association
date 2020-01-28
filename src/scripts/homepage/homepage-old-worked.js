import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { gsap } from "gsap";
import fragShader from './fragment.glsl';
import fragShaderTrail from './fragment-trail.glsl';
import vertexShader from './vertex.glsl';
import mouseSpeed from '../libs/mouse-speed'

class BasicCube {
    constructor(container) {

        this.superBuffer;

        this.block = null;
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
        this.init();
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
        this.writeBuffer = this.renderTarget.clone();


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
        const loader = new THREE.TextureLoader( );
        this.texture = loader.load('../images/grid.png');
        this.texture.minFilter = THREE.LinearFilter;
        const img1 = this.texture;

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
            u_img1: { type: 't', value: img1 },
            u_video: { type: 't', value: videoTexture },
            u_time: { type: 'f', value: time },
            u_imageResolution: { type: 'v2', value: new THREE.Vector2(1920, 1080), },
            u_resolution: { type: 'v2', value: new THREE.Vector2() },
            u_ratio: { type: 'f', value: 1.0 },
            u_mouse: { type: 'v2', value: new THREE.Vector2() },
            u_mouseSpeed: { type: 'f', value: 0.0 },
            texture: { type: 't', value: null },
        };

        const uniform = this.uniforms;

        this.uniforms2 = {
            u_img1: { type: 't', value: img1 },
            u_video: { type: 't', value: videoTexture },
            u_time: { type: 'f', value: time },
            u_imageResolution: { type: 'v2', value: new THREE.Vector2(1920, 1080), },
            u_resolution: { type: 'v2', value: new THREE.Vector2() },
            u_ratio: { type: 'f', value: 1.0 },
            u_mouse: { type: 'v2', value: new THREE.Vector2() },
            u_mouseSpeed: { type: 'f', value: 0.0 },
            texture: { type: 't', value: null },
        };

        const uniform2 = this.uniforms2;

        this.material = new THREE.ShaderMaterial({
            uniforms: uniform,
            vertexShader: vertexShader,
            fragmentShader: fragShader,
        });
        this.material2 = new THREE.ShaderMaterial({
            uniforms: uniform2,
            vertexShader: vertexShader,
            fragmentShader: fragShaderTrail,
        });

        const onCalcSpeed = () => {
            let speedX = Math.abs(this.mouseSpeed.speedX);
            let speedY = Math.abs(this.mouseSpeed.speedY);
            let speed = (speedX + speedY) / 2 > 70 ? 70.0 : ((speedX + speedY) / 2);
            uniform.u_mouseSpeed.value = speed;
            uniform2.u_mouseSpeed.value = speed;
        };

        this.mouseSpeed = new mouseSpeed();
        this.mouseSpeed.init(onCalcSpeed);

        document.addEventListener('mousemove', (e) => {
            uniform.u_mouse.value.x = e.clientX;
            uniform.u_mouse.value.y = e.clientY + window.pageYOffset;

            uniform2.u_mouse.value.x = e.clientX;
            uniform2.u_mouse.value.y = e.clientY + window.pageYOffset;
        });
        // this.video.addEventListener("timeupdate", ()=>{
        //     if(
        //         this.video.currentTime === this.video.duration &&
        //         this.video.playbackRate === 1
        //     ){
        //         this.video.pause();
        //         this.video.playbackRate = -1;
        //         this.video.play();
        //     }else if(
        //         this.video.currentTime < 18 &&
        //         this.video.playbackRate === -1
        //     ){
        //         this.video.pause();
        //         this.video.playbackRate = 1;
        //         this.video.play();
        //     }
        // }, false);
    }

    createObj() {
        const mat = this.material;
        const geometry = new THREE.PlaneBufferGeometry(2, 2);

        this.plane = new THREE.Mesh(geometry, mat);
        this.scene.add(this.plane);

        const mat2 = this.material2;
        const geometry2 = new THREE.PlaneBufferGeometry(2, 2);

        this.plane2 = new THREE.Mesh(geometry2, mat2);
        this.scene2.add(this.plane2);
    }


    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 1.0;
        this.uniforms.u_time.value = this.time;
        this.uniforms2.u_time.value = this.time;

        this.uniforms2.texture.value = this.renderTarget.texture;

        this.renderer.setRenderTarget(this.writeBuffer);
        this.renderer.render(this.scene2, this.camera);


        // this.superBuffer = this.renderTarget.texture;


        // this.renderer.render(this.scene2, this.camera);
        //

        // this.renderer.setRenderTarget(null);
        //
        //
        // // Now we render the second shader to the canvas

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene2, this.camera);


        const temp = this.renderTarget;
        this.renderTarget = this.writeBuffer;
        this.writeBuffer = temp;
    }

    onResize() {
        this.renderer.setSize(this.block.offsetWidth, this.block.offsetHeight);
        this.renderTarget.setSize(this.block.offsetWidth, this.block.offsetHeight);

        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;

        this.uniforms.u_ratio.value = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y;

        this.uniforms2.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms2.u_resolution.value.y = this.renderer.domElement.height;

        this.uniforms2.u_ratio.value = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y;
        // console.log(this.uniforms.u_ratio);

        this.camera.aspect = this.uniforms.u_resolution.value.x / this.uniforms.u_resolution.value.y;
        this.camera.updateProjectionMatrix();
    }
}





const scene = new BasicCube(document.getElementById('intro__bg-canvas'));
