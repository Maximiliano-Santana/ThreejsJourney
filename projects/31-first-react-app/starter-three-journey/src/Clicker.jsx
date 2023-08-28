import { useEffect, useState, useRef } from "react";

export default function Clicker ({keyName, colorText = 'green', increment}){
    const [ count, setCount ] = useState(parseInt(localStorage.getItem(keyName) ?? 0));
    
    const buttonRef = useRef();
    
    useEffect(()=>{
        console.log(buttonRef)
        buttonRef.current.style.backgroundColor = 'papayawhip'
        buttonRef.current.style.color = 'salmon'

        return ()=>{
            localStorage.removeItem(keyName);
        }
    }, [])
    
    useEffect(()=>{
        localStorage.setItem(keyName, count)
    }, [count])

    const buttonClick = ()=>{
        //setCount(count + 1)
        setCount(value=>value+1) 
        increment();
    }

    return <>
        <h1 style={{color: colorText}}>Clicks count: { count }</h1>
        <button ref={ buttonRef } onClick={ buttonClick }> Add </button>
    </>
}