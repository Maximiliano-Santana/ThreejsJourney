import { useEffect, useState } from "react";

export default function Clicker ({keyName, colorText = 'green', increment}){
    const [ count, setCount ] = useState(parseInt(localStorage.getItem(keyName) ?? 0));
    

    useEffect(()=>{
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
        <button onClick={ buttonClick }> Add </button>
    </>
}