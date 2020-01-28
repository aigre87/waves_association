import * as THREE from 'three';
import vertexShader from './vertex.glsl';
class BufferShader {
    constructor(fragmentShader , uniforms = {}) {

        console.log('Shader', uniforms)
        this.material = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader: vertexShader,
            uniforms
        })
        this.scene = new THREE.Scene()
        this.scene.add(
            new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material)
        )
    }
}

export { BufferShader as default}
