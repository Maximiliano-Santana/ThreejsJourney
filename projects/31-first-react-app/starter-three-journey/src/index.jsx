import './style.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = createRoot(document.querySelector('#root'));

const name = 'Wiwi'

root.render(
    <>
        <h1 style={{ color: 'white', backgroundColor: 'black' }} className='cute-paragraph'>Hello React</h1>
        <h1>Hello { name }</h1>
        <h1>Hello { `random number: ${ Math.random() }` }</h1>
        <App clickersCount = {100} ><h1>Hello from child prop</h1></App>
        
    </>
) 