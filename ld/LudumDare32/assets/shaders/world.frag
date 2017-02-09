#ifdef GL_ES
#define LOWP lowp
precision mediump float;
#else
#define LOWP
#endif

uniform sampler2D u_texture;

varying LOWP vec4 v_color;
varying vec2 v_texCoords;

//LIGHTING
uniform vec2 lightPosition[10];
uniform vec3 lightColor[10];
uniform vec4 lightMinMax[10];
uniform int lightIntensity[10];
uniform int lightShowness[10];
uniform int amountLights;

void main(){
	vec4 originalColor = texture2D(u_texture, v_texCoords);
	vec4 loopedColor = vec4(1, 1, 1, 1);
	
	for(int i = 0;i < 10;i++){
	if(i < amountLights){
		if(lightMinMax[i].x != 0.0 || lightMinMax[i].y != 0.0){
			if(gl_FragCoord.x < lightPosition[i].x - lightMinMax[i].x) continue;
			if(gl_FragCoord.x > lightPosition[i].x + lightMinMax[i].y) continue;
		}
		if(lightMinMax[i].z != 0.0 || lightMinMax[i].w != 0.0){
			if(gl_FragCoord.y < lightPosition[i].y - lightMinMax[i].z) continue;
			if(gl_FragCoord.y > lightPosition[i].y + lightMinMax[i].w) continue;
		}
		
		float dist = distance(lightPosition[i], gl_FragCoord.xy) + float(lightShowness[i]);
		float att = 1.0 / dist;
		vec4 mixedColor = vec4(att, att, att, 1.0);
		mixedColor = mix(originalColor * vec4(lightColor[i], 1.0), mixedColor, 0.6);
		mixedColor /= dist / 2.0 / float(lightIntensity[i]);
		mixedColor.w = originalColor.w;
		
		if(i == 0){
			loopedColor = mixedColor;
		}else{
			//loopedColor = mix(loopedColor, mixedColor * vec4(amountLights, amountLights, amountLights, 1.0), 0.5);
			loopedColor += mixedColor;
		}
	}
	}
	
	//gl_FragColor = originalColor;
	gl_FragColor = loopedColor * v_color;
}