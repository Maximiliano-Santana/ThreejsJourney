import { Effect, BlendFunction } from "postprocessing";
import { Uniform } from 'three'

//Create the fragment shader with this exact parameters 

//The parameters are slightly different than what we are used to writing in shaders
//We are using the WebGL 2 Syntax where we can specify more information associated with each parameter 
    //const: the parameter is not wrritable
    //in: is a copy of the actual variable and changing it won't affect the initial variable sent when calling the function
    //out: changing this value will change the variable sent when calling function
    //inout: We can both read and weite it 
//It prevents us from making mistakes but also gives us a hint about what variables we need to change
    //inputColor: contains the current color for that pixel wich is defined by the previous effect
    //uv: contains the render coordinates
    //outputColor: is qhat we need to change in order to apply the effect


    const fragmentShader = /*glsl*/`
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uOffset;

    void mainUv(inout vec2 uv){
        //-------------------------- Adding waves ----------------------------------
        //For make it wave we need to change the uv coordinate, to make it we are going to implement a new function named mainUv
        //And in there we are going to use a sin()    
        //And lets use the frequency and the amplitude
        //To use them at the begining of the shader we are going to retrieve them.
        uv.y += sin(uv.x * uFrequency + uOffset) * uAmplitude;
    }
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
        //-------------------------- Adding the green ------------------------------
        //We are going to add effects to the inputColor and then send it to the outputColor so we will get the color that we send
        //To make it wave we need to mess with the uv coordinates
        //There is a uv parameter in our mainImge fuicntion, but it's here in case we need to pick pixels on another textures or apply an effect related to the uv coordinates.
        
        vec4 color = inputColor;
        color.rgb *= vec3(0.8,1.0, 0.5);
        outputColor = color;
        
        //------------------------ Blend functions -----------------------------------
        //This is  okay but we can go a little further by aplying the Blending functions and let the user to choose metween that ones

        //To make it first in the fragmenShader send the green color directly in the outputColor and keep the alpha from the inputColor

        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
        //Add a blendFunction attribute to the <Drunk/> and  set it to BlendFunction.DARKEN

        //To use it we need to retrieve the function on the constructor

        //And the forward it in the options of the effect just like we send the unifroms and thats it

        //Now we need to put one blending function by default so the user won't have problem if he doesn't provide it
        //To make it import the BlenfFunctions from postprocessing and we are going to set a default Value 
        
    }

`

//----------------------------------- Creating the effect ---------------------------
//Export a class with the Effect extend from postprocessing.
//We will use inside the contructor the super(); and pass three parameters
//The name of the effect
//The fragment shader that we wrote earlier 
//Some options in an object that we will keep empty for now

//And now we created a postprocessing effect, and now pore implement it on React go to Drunk.js

export default class DrunkEffect extends Effect{
    //Retrive the props of the componet from DrunkEffect.jsx so we can use the amplitude and frequency as a unifrom
    //The format is differen than what we are use to and we need to create a Map
    //A Map is a mix between an object and an array with helpful methods and properties
    //To create the uniforms we can use 2 ways, the normal and new official from three.
    //There is actually a different and more official way to create uniforms, improt Uniform from three
    constructor({frequency, amplitude, blendFunction = BlendFunction.DARKEN}){
        super(
            'DrunkEffect', 
            fragmentShader, 
            {
                blendFunction: blendFunction,
                uniforms: new Map([
                    [ 'uAmplitude', { value: amplitude } ],
                    [ 'uFrequency', new Uniform(frequency) ],
                    [ 'uOffset', new Uniform(0) ],
                ])
            }
        )     
    }

    //---------------------------------- Animating -------------------------------------
    //We are going to send an offset uniform from the Drunk effect 
    //And to animate it 
    //You might think we will update it in the useFrame, but the DrunkEffect.js is not a React Three Fiber thing, it's postprocessing Effect.
    //Add an update method to the DrunkEffect class 
    //The function is being called on each frame automatically
    update(renderer, inputBuffer, deltaTime){
        //We can get acces to the uniforms because we used a Map, we must aces the values with the get Method 
        console.log(this.uniforms.get('uOffset'))
        //We can retrieve the delta time on the update()
        
        this.uniforms.get('uOffset').value += deltaTime*0.5;
        
    }
}