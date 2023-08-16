varying vec2 vUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main(){

  //vec4 modelPosition = modelMatrix * vec4


  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);

  vUv = uv;
}