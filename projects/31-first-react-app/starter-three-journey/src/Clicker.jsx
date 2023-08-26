import { useState } from "react";

export default function Clicker (){
    
    const countState = useState(0)
    let count = countState[0]
    const setCount = countState[1]

    const buttonClick = ()=>{
        //setCount(count + 1)
        setCount(value=>value+1) 
    }

    return <>
        <h1>Clicks count: { count }</h1>
        <button onClick={ buttonClick }> Add </button>
    </>
}