import { useState, useMemo } from 'react'
import Clicker from './Clicker.jsx';
import People from './People.jsx';

export default function App({ children, clickersCount }){
    const [hasClicker, setHasClicker] = useState(true);
    const [count, setCount] = useState(0);

    const tempArray =[...Array(clickersCount)];

    tempArray.map((value)=>{})


    const increment = ()=>{
        setCount(count+1);
    }

    const toggleClickerCount = ()=>{
        setHasClicker(!hasClicker);
    }

    
    const colors = useMemo(()=>{
        const colors = [] 
        for (let i= 0 ; i < clickersCount; i++){
            colors.push(`hsl(${(Math.random()*360).toFixed(2)}deg, 100%, 70%)`)
        }
        return colors
    }, [clickersCount])

    return <>
        <h1>Global Counter: { count }</h1>

        {children}
        <button onClick={ toggleClickerCount }>{ hasClicker ? 'Hide' : 'Show' } clicker</button>
        {hasClicker ? <>
            { [...Array(clickersCount)].map((value, index)=>{
                return <Clicker 
                    key = { index }
                    increment = { increment } 
                    keyName= { `count${index}` } 
                    colorText={ colors[index] }    
                />
            }) }
        </> : null} 

    <People></People>


    </>
}