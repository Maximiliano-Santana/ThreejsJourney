//Code structuring for bigger projects.
//Sometimes when we are working on bigger projects, have all the code inside one file could be hard cause 
//Hard to find what you want
//Hard to re-use sepecific parts 
//conlfict with variables
//conflicts with other developers
//cramps in your fingers because you have to scroll

//--------------------------- Javascript Classes and modules ----------------------------------------------
//We are going to use concepts like classes and module
//This is a personal, so take think what is good or wrong

//-------------------- Modules
//The idea of the modules is to separate the code into multiple files and import them when we need it.
//So we are going to create modules, first in the src folder will create a new document 'test.js'
//This test.js is going to export something and the main.js import

//To export somethin we used the word 'export default' isnide the 'test.js'
//Then we are going to import whtat is inside test.js
// import test from './test.js'

// let value = test();
 
//console.log(value)
//And now we can use this stuff
//You can even export more, like a function.
//We can export an object
//We can export classes

//Also, one file can expor multiple things with export {class, function}
// to import it we have to import all 

// helloWorld();
// anotherThing();

//also we dont need to import everything with 

// import * as THREE from 'three'
// console.log(THREE);

//Tree shaking is to not import things from the library when isn't using


//-------------------------------------- Merge Modules and Classes ------------------------------
//We are going to separate our code into files and each one of this files will export one class

//Now we import all and still working like it is in the same file everything
import Robot from './Robot.js'
import FlyingRobot from './FlyingRobot.js'


//We create a new class instance using new
const robert = new Robot('Robert', 1);

//We can create multiple instances of that class
const wallE = new Robot('Wall-E', 0);
const ultron = new FlyingRobot('Ultron', 2);

ultron.sayHi();
wallE.sayHi();
ultron.takeOff();


