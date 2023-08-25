import './style.css'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.querySelector('#root'));

const name = 'Wiwi'

root.render(
    <>
        <h1 style={{ color: 'white', backgroundColor: 'black' }} className='cute-paragraph'>Hello React</h1>
        <h1>Hello { name }</h1>
        <h1>Hello { `random number: ${ Math.random() }` }</h1>
    </>
)