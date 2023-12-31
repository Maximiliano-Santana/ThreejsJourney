
precision mediump float; 

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUv;
varying float vElevation;

void main(){
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  gl_FragColor = vec4(color, 1.0);

  //gl_FragColor = vec4(0.02, vElevation-0.5+1.0, vElevation+1.0 ,1.0);
}