
export class Dispatcher{
   #subs = new Map();
   #afterHandlers = [];

   subscribe(commandName,handler){
    if(!this.#subs.has(commandName)){
        this.#subs.set(commandName,[]);
    }
    const handlers = this.#subs.get(commandName);
    if(handlers.includes(handler)){
        return ()=>{};
    }
    handlers.push(handler);
    return ()=>{
        handlers.splice(handlers.indexOf(handler),1);
    }
   }//subscribe


   afterEveryCommand(handler){
       this.#afterHandlers.push(handler);
       return ()=>{
           this.#afterHandlers.splice(this.#afterHandlers.indexOf(handler),1);
       }
   }//afterEveryCommand

   dispatch(commandName,payload){
       const handlers = this.#subs.get(commandName);
       if(!handlers){
        console.warn(`No handlers for command ${commandName}`);
           return;
       }
       handlers.forEach(handler=>{
           handler(payload);
       });
       this.#afterHandlers.forEach(handler=>{
           handler();
       });
   }

}