//--------------- Inheritance -----------------
//Inheritance isl ike crating a class based on another class
//All the methodsd of the base class will be avalible in the new class
//To create a new class with inheritance we use te keyword 'extends'

//Even if the class is empty, can still work the same as a robot

//The functions can be oberwrite

import Robot from './Robot.js'

export default class FlyingRobot extends Robot{
    //If you want to do it for the constructor, you have to start the method with super() and send the needed parameters, you can't overwrite the constructor. 
    constructor(name, legs){
        super(name, legs);
        //Super corresponds to the base class (Robot) and using super() is like calling the base constructor so that everythin we do in the base constructor will be done in the new class
        //Also we can use super to call methods from the base class.
    }

    takeOff(){
        console.log(`Have a good fly ${this.name} `);
    }
    land(){
        console.log(`Welcome back ${this.name}`);
    }
}