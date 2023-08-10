//The shader lenguage is called GLSL (OpenGL Shading Language) //Close to the C language

//----------Logging
//You can't log because these are not handled by the cpu, is the gpu doing millions of calculations at the same moment for the verteces.
//So there is not console

//----------The identaion is not essential

//----------The semicolon is required to end any instruction

//----------Variables 
//It's a typed language 
//We must specigy a variable's type and we cannot assing any other type to that variable
//We can't mix float and int in these operations, but we can convert types on the fly with float(x), int(x)
//float fooBar = 0.123;
//int fooBar = 1;
//bool bar = ture;

//---vec2
//There are other really usefull but is the hard part used to store 2 coordinates x and y
//vec2 bar = vec2(1.0, 2.0);
//an empty vec2 will result in error, but we can provide only one value and this value will be used for both x and y
//You can also change the values after, you can acces those variables just like in JavaScript
//bar.x = 1.0;
//bar.y = 2.0;

//Doign operations on a vec2 will multiply both the 'x' and the 'y'
//vec2 var = vec2(1.0, 2.0)
//var *= 2.0

//--- vec3
//is just like a vec2 but with z
//Convenient for 3D coordinates
//vec3 foo = vec3(0.0)
//foo.z = 0.0;
//Instead of using 'x', 'y' and 'z' also we can use 'r', 'g', 'b' you can use whatever you want its just aliases
//vec3 purpleColor = vec3(0.0)
//purpleColor.r = 0.1
//purpleColor.g = 0.5
//purpleColor.b = 1.0

//Can create a vec3 starting with a vec2 just provide the vec2 inside the vec3
//vec2 vec = vec2(1.0, 2.0)
//vec3 bar = vec3(vec)

//And also we can create a vec2 starting with a vec3
//vec3 foo = vec3(2.0, 2.0, 2.0);
//vec2 bar = foo.xy
//vec2 bar = foo.xz
//vec2 bar = foo.yx //We can invert them this is names swizzle

//---vec4
//is like vec2 and vec3, but with a w 
//a is an alias of w the a is cause (Alpha)
//vec4 foo = vec4(1.0, 1.0, 1.0, 4.0);
//vec4 bar = vec4(foo.zw, vec2(5.0, +.0));

//---There are other types lipke 
//mat2
//mat3
//mat4
//sampler2D

//--------- Operations 
//We can do mathematic operations like '+', '-', '*', '/'

//----------Functions
//A functions must start with the type of the value that will be returned. You need to provide the type if it returns a float and void if it doesent return anything. Also you can provide parametters
// float loremIpsum(float a, float b){
//  vec2 vec = vec2(1.0, 2.0);
//  return a + b;
//}

//Also you have many acces to classic functions like 
//sin, cos, max, min, pow, exp, mod, clamp
//But also very practical functions like cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize


//---------- Documentation
//The problem of this glsl doesn't have beginner friendly documentation
// Shaderific - documentation of an ios application to do shaders
// Khronos Group Registery - OpenGL documentations but very close to the WebGL
// Book of Shaders glossary - A great course about fragment shaders


//-------------------------------------------------------- Understanding the vertex shader ----------------------------------------------------------

//-------------Main function
//This function will be called automatically, doesn't retun anything
//Inside of it all we have is our gl_Position variable 

//------------ gl_Position variable
//Already exists we just override it
//We need to adding it
//Will contain the position of hte vertex on the screen

//This long instruction will return a vec4
//  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
//We can play with its x and y 

//Why this 4 values 
//Because the coordinates or in fact in clip space it's like positionning things in a box 
//The z are for the depth (to wnkow wich part is in front of the other) and the w is responsible for the perspective

//It will look like a box. where we position vertices inside that clip space when we position the vertex. 
//We provide a 'x' 'y' and 'z' so that we know wich vertex is in front and the other value is for perspective (homogeneus coordinates)

//------------- Position attributes
//We have an attribute 
//attribute vec3 position;
//Where we are retreaving this value from the geometry.

//We have to provide a Vec4 thats why we convert it with
//vec4(position, 1.0)

//------------- Matrices Uniform
//Those are 'uniforms' because ther are the same for all the vertices
//Each matrix will do a part of the transformation
//To apply a matrix, we multiply it
//The matrix must have thw same size as the coordinate (mat4 for vec4)
//Each matrix will transform the 'position' until we get the final clip space coordinates
//We have 3 matrices 
  //modelMatrix: Apply transformations relative to the Mesh (position, rotation, scale)
  //In three.js if we use mesh.position.x = 1 will convert this transformation into a modelMatrix and we apply this modelMatrix to the position coordinates.
  //viewMatrix: Apply transformations relative to the camera (position, rotation, fov, near and far). 
  //In three.js will take this data and transform it into a viewMatrix thar will be applied to the positions on the clipSpace
  //projectionMatrix: Will transforma the coordinates into the clip space coordinates

// Also we have a shorter version by vireMatrix and modelMatrix are combined into a modelViewMatrix

//------------------------------------------ class practice
//position is already sent and we can add or own attributes to the bufferGeometry
//We will add a random value for each vertex and move that vertex on the z according to the value

//------------ Attributes 
//position is already send and we can add our own attributes to the bufferGeometry
//We will add a random values for each vertex and move that vertex on the z axis according to that value

//When we crate a geometry we have attributes like (uv, position, normal) and we can add our own attributes and send it to the vertex shader 
//So go to the main.js and create a 'aRandom' attribute
//To retrieve this aRandom attribute we can do
attribute float aRandom;

//And now we can use it to transform the modelPosition

//---------- Varyings
//We are going to color the fragments also with the aRandom but we cannot use attributes in the fragment shader 
//We can use a vryings to send data form the vertex shader to the fragment shader
varying float vRandom;

//----------- Uniforms 
//Having the same shader but with different results 
//Being able to tweak values 
//Animating values

//Can be used in the vertex and the fragment 
//Add uniforms to the material with the uniforms property like frequency and retrieve those information doing:
uniform vec2 uFrequency;

//----------- Animating 
//We can animate our vertex shader by sendim the time as a uTime uniform
//And then change this value inside the tick function
uniform float uTime;
//And now you can use this time value that is updating in the tick function
//To can offset the velue inside the scene 
//Do not use Date.now() for the uTime because the number is to big for a shader

//------------- Send uvs to fragment shader 
varying vec2 vUv;
varying float vElevation;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;

void main(){
  //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);

  //Here we converted the position attribute to a modelPosition 
  vec4 modelPosition = modelMatrix*vec4(position, 1.0);
  
  //Creating the elevation variable 
  float elevation = sin(modelPosition.x*uFrequency.x - uTime)*0.1;
  elevation += sin(modelPosition.y*uFrequency.y - uTime)*0.1;


  //Once we have all this operation separated we can play with dit

  modelPosition.z += sin(modelPosition.x*uFrequency.x - uTime)*0.1;
  modelPosition.z += sin(modelPosition.y*uFrequency.y - uTime)*0.1;

  //Transformating by aRandom attribute created in js
  //modelPosition.z += aRandom*0.1;
  vec4 viewPosition = viewMatrix * modelPosition ;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  
  //-------- vRandom
  vRandom = aRandom;
  
  //--------- Sending uvs to fragment shader
  vUv = uv;
  vElevation = elevation;
}