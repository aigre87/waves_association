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

uniform sampler2D u_img1;
uniform sampler2D u_video;
uniform sampler2D u_textureRadialGrad;
uniform sampler2D u_textureRadialGrad_new;
varying vec2 vUv;

float circle(in vec2 _st, in float _radius, in vec2 _mouseN){
	vec2 dist = _st-_mouseN;
	return 1.-smoothstep(_radius-(_radius*1.0),
	_radius+(_radius*0.001),
	dot(dist,dist)*5.0);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
	const vec4 C = vec4(0.211324865405187, 0.366025403784439,
	-0.577350269189626, 0.024390243902439);
	vec2 i  = floor(v + dot(v, C.yy) );
	vec2 x0 = v -   i + dot(i, C.xx);
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod(i, 289.0);
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
	+ i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
	dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
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
	float distort = sin(uv.x * 20.0 + u_time*0.05)*0.02;
	// float distort = sin((uv.x * 10.0) + u_time*0.02)*0.02;
	// float distort = snoise( vec2(uv.x+u_time*0.01) )*0.05;
	// градиентная карта воды
	vec4 vGrad = vec4(vec3(pow( 1.0-st.y ,2.0)),1.0);

	vec3 circleColor = vec3(circle(uv,0.1,mouseN));


	vec4 color = texture2D(u_textureRadialGrad_new, vec2(uv.x,
		uv.y
		+ distort
		* vGrad.r
		//			* circleColor.r
		//			* ((u_mouseSpeed+10.0)*0.02)
		)
	);






	// gl_FragColor = vGrad;


	// gl_FragColor = vec4(vec3(color.r+color.g+color.b)/3.0,1.0);



	// gl_FragColor = vec4( color );
	if(u_time > 2.0){
		gl_FragColor = texture2D(u_textureRadialGrad, uv);
	}else{
		gl_FragColor = vGrad;
	}





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
