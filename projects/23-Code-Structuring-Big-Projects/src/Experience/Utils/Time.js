//This class will work like the clock from three.js 

//This classs will save the current time, the elapsed time and the delta time between the current frame and the previous frame

//The class will trigger on each frame, in other words, will handle the tick function

import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter{
    constructor(){
        super();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        //We start the tick function, with reques atimation frame to wait one frame and in the next start it
        //We wait one frame so the delta wont be 0 in the first frame
        window.requestAnimationFrame(()=>{
            this.tick();
        })
    }

    tick(){
        //Update time
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        //Emit event
        this.trigger('tick');

        window.requestAnimationFrame(()=>{
            this.tick();
        });
    }
}