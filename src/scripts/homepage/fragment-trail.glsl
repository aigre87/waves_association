uniform vec2 u_mouse;
uniform float u_time;
uniform float u_mouseSpeed;
uniform vec2 u_resolution;
uniform float u_ratio;
varying vec2 vUv;
uniform sampler2D u_img1;
uniform sampler2D texture;
float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
	uv -= disc_center;
	float dist = sqrt(dot(uv, uv));
	return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}
void main() {
//	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
//	vec2 mouseN = vec2(u_mouse.x/u_resolution.x, 1.0 - (u_mouse.y/u_resolution.y));
//	vec4 color = vec4(0.0,0.0,0.0,1.0);
//
//	vec2 center = mouseN;
//	uv.x *= u_ratio;
//	center.x *= u_ratio;
//
//	color.r += circle(uv, center, 0.0, 0.1);
//	color.r = mix(color.r, 0.0, .009);
//	color.r = clamp(color.r, 0.0, 1.0);
////
////	color.g = color.r * 5.0;
//
//	gl_FragColor = color;


	vec2 uv = vUv;
	vec2 col = uv;
	if (u_time > 2.0) {

		col = texture2D(texture,uv).xy;

		vec2 uv = gl_FragCoord.xy / u_resolution.xy;
		vec3 stack = vec3(0.0,0.0,0.0);
		vec2 mouseNew = vec2(u_mouse.x, u_resolution.y - u_mouse.y);

		vec3 blob = vec3(.11-clamp(length((gl_FragCoord.xy-mouseNew.xy)/u_resolution.x),0.,.11))*10.;
		gl_FragColor = vec4(col + blob.xy, 0.0, 1.0);
	}else{
		vec2 uv = gl_FragCoord.xy / u_resolution.xy;
		vec3 stack = vec3(0.0,0.0,0.0);
		vec2 mouseNew = vec2(u_mouse.x, u_resolution.y - u_mouse.y);

		vec3 blob = vec3(.11-clamp(length((gl_FragCoord.xy-mouseNew.xy)/u_resolution.x),0.,.11))*10.;
		gl_FragColor = vec4(blob.xy, 0.0, 1.0);
	}


}
