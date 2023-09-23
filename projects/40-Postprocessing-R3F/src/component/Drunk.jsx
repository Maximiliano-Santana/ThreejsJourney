


//Export a component to the Experience and import the DrunkEffect 
import DrunkEffect from "./DrunkEffect.jsx"

//We can set props to controll our effect

//We retrieve it an then we forwars it to the DrunkEffect


//--------------- Reference
//to make our component suports Reference we will use this
import { forwardRef } from "react";

//And we will put the code of the main function inside the ForwardRef dunction

//Because we are using forwardRef  we get acces to the ref as the secpnd argument

//And the we are going to dorwar the ref to the primitive

export default forwardRef(function Drunk(props, ref){

    //Instantiate the effect that we created
    const effect = new DrunkEffect(props);
    
    //Use primitive for display it and its working
    return  <>
        <primitive ref={ref} object={ effect }/>
    </>
})