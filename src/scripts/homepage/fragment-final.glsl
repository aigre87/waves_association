uniform sampler2D u_channel0;
uniform sampler2D u_channel1;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec2 a = texture2D(u_channel1,uv).xy;
    gl_FragColor = vec4(texture2D(u_channel0,a).rgb,1.0);
}
