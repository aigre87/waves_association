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
uniform sampler2D u_img1;
uniform sampler2D u_video;
varying vec2 vUv;

float circle(in vec2 _st, in float _radius, in vec2 _mouseN){
	vec2 dist = _st-_mouseN;
	return 1.-smoothstep(_radius-(_radius*1.0),
	_radius+(_radius*0.001),
	dot(dist,dist)*5.0);
}

void main() {

	vec2 st = gl_FragCoord.xy/u_resolution;

	vec4 img = texture2D(u_img1, vUv);

	vec2 ratio = vec2(
		min((u_resolution.x / u_resolution.y) / (u_imageResolution.x / u_imageResolution.y), 1.0),
		min((u_resolution.y / u_resolution.x) / (u_imageResolution.y / u_imageResolution.x), 1.0)
	);

	// перевод системы координат в img-cover
	vec2 uv = vec2(
		vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
		vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
	);

	vec2 mouseN = vec2(u_mouse.x/u_resolution.x, 1.0 - (u_mouse.y/u_resolution.y));
	float mouseDis = distance(uv,mouseN);
	vec3 mouseColor = vec3(mouseDis);

	//gl_FragColor = texture2D(u_img1, uv);

	// частота , быстрота , высота
	// float distort = sin(uv.x * 10.0 + u_time*10.0)*0.02;
	float distort = sin((uv.x * 15.0) + u_time*5.0)*0.03;
	// градиентная карта воды
	vec4 vGrad = vec4(vec3(pow( 1.0-st.y ,2.0)),1.0);

	vec3 circleColor = vec3(circle(uv,0.1,mouseN));
//
//	vec4 color = texture2D(u_img1, vec2(uv.x,
//			uv.y
//			+ distort
//			* vGrad.r
////			* circleColor.r
////			* ((u_mouseSpeed+10.0)*0.02)
//		)
//	);

	vec4 color = texture2D(texture, vec2(uv.x,
		uv.y
		+ distort
		* vGrad.r
		//			* circleColor.r
		//			* ((u_mouseSpeed+10.0)*0.02)
		)
	);




	// gl_FragColor = vGrad;


	// gl_FragColor = vec4(vec3(color.r+color.g+color.b)/3.0,1.0);



	gl_FragColor = vec4( color );




}

//// uniform float uRatio;
//float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
//	uv -= disc_center;
//	float dist = sqrt(dot(uv, uv));
//	return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
//}
//void main() {
//	vec2 mouseN = vec2(u_mouse.x/u_resolution.x, 1.0 - (u_mouse.y/u_resolution.y));
//		vec2 ratio = vec2(
//			min((u_resolution.x / u_resolution.y) / (u_imageResolution.x / u_imageResolution.y), 1.0),
//			min((u_resolution.y / u_resolution.x) / (u_imageResolution.y / u_imageResolution.x), 1.0)
//		);
//	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
//	vec4 color = texture2D(u_img1, uv + vec2(0.0, -0.002));
//
//	vec2 center = mouseN;
//	uv.x *= 1.7;
//	center.x *= 1.7;
//
//	color.r += circle(uv, center, 0.0, 0.1) * u_mouseSpeed;
//	color.r = mix(color.r, 0.0, .009);
//	color.r = clamp(color.r, 0.0, 1.0);
//
//	color.g = color.r * 5.0;
//
//	gl_FragColor = color;
//}
