import * as THREE from 'three';
class BufferManager {

    public readBuffer: THREE.WebGLRenderTarget
    public writeBuffer: THREE.WebGLRenderTarget

    constructor(private renderer: THREE.WebGLRenderer, { width, height }) {

        this.readBuffer = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            stencilBuffer: false
        })

        this.writeBuffer = this.readBuffer.clone()

    }

    public swap() {
        const temp = this.readBuffer
        this.readBuffer = this.writeBuffer
        this.writeBuffer = temp
    }

    public render(scene: THREE.Scene, camera: THREE.Camera, toScreen: boolean = false, swapIgnore: boolean = false) {
        if (toScreen) {
            this.renderer.render(scene, camera)
        } else {
            this.renderer.setRenderTarget(this.writeBuffer);
            this.renderer.render(scene, camera)
            this.renderer.setRenderTarget(null);
        }
        if( swapIgnore ){
            this.swap()
        }
    }

}

export { BufferManager as default}
