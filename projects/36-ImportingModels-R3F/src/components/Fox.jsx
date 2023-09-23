import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect } from "react";
import { useControls } from "leva";

export default function Fox(){
    //------------------------------- Animations
    //First we will creat a component and load the model with the animations

    //To play the animation there is a drei helper named useAnimations from drei

    //This wil give us the animations and each one has been converted into an AnimationAction using the name of the animation (run, survey, walk) Thos actions are avalible in the animation.actions object

    //Is better to run the animation once the component has finished rendering for the firsta time
    //We can do that by using react useEffect

    //if we want the fox start walking after a few secons, you can use the varoius methods avalibles like crossFadeFrom wich is going to fadeOut the Run and fadeIn the Walk

    const model = useGLTF('./models/Fox/glTF-Binary/Fox.glb');
    model.scene.children[0].children[0].castShadow = true;
    const animations = useAnimations(model.animations, model.scene);
    
    //------------------------------ Animation Control and cleanup phase
    //Now we can change the animation that we want, but looks weird when wi change it 
    //This is becaus all animations are playing together and Three.js will mix them.
    //We need to stop the old animation progressively (fadeOut) and start the new animation progressively (fade In)

    //To make it first wi call the fadeIn in the action we are playing
    //We can return something in the useEffect, we can return a function, that will be called when the component is being disposed, when the value changes again.
    //Whis phase we call it in react the cleanup phase, it's where we make sure to dispose of what needs to be disposed of

    //Now is working but when we need to add a reset() 

    const { animationName } = useControls({
        animationName: { options: animations.names }
    })

    useEffect(()=>{
        const action = animations.actions[animationName]
        action.reset().fadeIn(0.75).play();
        

        return ()=>{
            action.fadeOut(0.75);
        }

        

    },[animationName])
    return <>
        <primitive object={model.scene} scale={0.02} cast/>
    </>
}