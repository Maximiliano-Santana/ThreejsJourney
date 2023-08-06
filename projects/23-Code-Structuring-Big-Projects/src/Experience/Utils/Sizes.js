//Here we asume that the experience always will be fills the viewport if that's not the case, you'll have to do thing differently.

//Now we can acces the sizes form the Experience class

//We could listen to the resize event on window to do other resizes, but instead we are going to use the Sizes classs to warn the other classes about that change
//To do that we are going to use the event emitter
//First we have to import it
import EventEmitter from "./EventEmitter";

//Then extends the class sizes and use super(), then to add an event we can use the method this.trigger(); put inside 'resize' 
export default class Sizes extends EventEmitter{
    constructor(){
        //Super
        super();

        //Setup
        this.width = window.innerWidth,
        this.height = window.innerHeight,
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        
        //Resize event
        window.addEventListener('resize', ()=>{
            //Resize Sizes
            this.width = window.innerWidth,
            this.height = window.innerHeight,
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            //Event emitter
            this.trigger('resize');
        })
    }
}