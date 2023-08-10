//------------------Inside the fragment shader we will have 
//Void main function just like the vertex shader
//Aotmatically handled when using Shader material


//----------------Precision
//We need to decide how precise can be a float  be
//highp: can have eprformance hit and might not woek on some devices 
//mediump: mos equilibrated
// low: lowp can create bugs by the lack prevision 

precision mediump float; 

//----------------gl_FragColor
//We need to assign it
//Will contain the color of the fragment 


//------------Getting Varyings from the vertex shader
//We just have to weite the exact same in the vertex shader
varying float vRandom;
//-----------Getting uniforms
uniform vec3 uColor;

//----------- Apply a texture
//we are going to apply a texture on our flag
//First we have to load the texture from three.js 
//And then we can send it with a uTexture unifrom

//First we have to get the texture with sampler2D is the typed of textures
uniform sampler2D uTexture;


//Then to take pixel colors from a texture and apply them in the fragment shader, we must use the texture2D() function
//The firs parameter is the texture
//The second parameter are the coordinates of where to pick the color on that texture (uv coordinates)

//To send the uv coordinates from three.js are already on the vertex shader, but we have to retrieve from the vertex shader the uv attribute and crate a varying cause is a different coordinate for each vertex. 
varying vec2 vUv;
varying float vElevation;

//-----------Adding color variations
//Let's add brightness cariations as if htere are shows 
//Store the wind elevation in a variable



void main(){
  //Pick the vertex colors on the uv coordinates
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb += vElevation * 2.0 + 0.1;

  //Then put the textureColor inside the gl_FragColor
  gl_FragColor = textureColor;

  //gl_FragColor = vec4(uColor, 1.0);
  //gl_FragColor = vec4(0.32, vRandom, 0.74, 1.0);
}