import { useEffect, useState } from 'react'

export default function People (){
    const [people, setPeople] = useState([]);

    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response=>response.json())
            .then(result=>setPeople(result))
    }, [])

    // useEffect(async ()=>{
    //     const response = await fetch('https://jsonplaceholder.typicode.com/users')
    //     const result = await response.json();
    //     console.log(result);
    // }, [])
    
    const getPeople = ()=>{
        console.log('fetch people')
    }

    return <>
        <h1>Hello from people</h1>
        <ul>
            {people.map((person, index)=> <li key={person.id}>{ person.name }</li>)}
        </ul>
    </>
}