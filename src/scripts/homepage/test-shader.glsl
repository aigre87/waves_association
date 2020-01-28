//#ifdef GL_ES
//precision mediump float;
//#endif
//
uniform vec2 u_resolution;
uniform vec2 u_imageResolution;

uniform vec2 u_mouse;
uniform float u_time;
uniform float u_mouseSpeed;
//
//
uniform sampler2D texture;
uniform sampler2D u_channel0;
uniform sampler2D u_channel1;
uniform sampler2D u_video;
varying vec2 vUv;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = texture2D(u_channel0, uv);
}
