//------------------------------ Classes --------------------------------------------------
//Classes allow us to use OOP in JavaScript
//How to create a class, this is easy using 
//Class names use PascalCase
class HelloClass {}

//Class is like a blueprin, we can use that blueprint to create an object, we can use that blueprint to create multiple objects
//Our classes can have methods (functions inside class)

export default class Robot {

    //We can create a method that will be called as soon a new instance is created, dis method have a specific name, is names constructor
    //The constructor can have get parameters.
    //Sometimes we want to use this parameters in other functions. We also can send the name inside de parameters, but thats bad

    //Thats why we use context to the robot can remember his name. We can use the word 'this'
    constructor(name, legs){
        this.name = name; //This way we are saving the name sent as a parameter and saved it in the context with 'this.name' and now we can acces it to other methods.
        //This refers to the current instance name is what we call a property of the clas
        //We can create multiple propeties
        this.legs = legs
    }

    sayHi(){
        console.log('Hi im ' + this.name);
    }

    //Also we can call methods from other methods with the keyword 'this'

    
}
