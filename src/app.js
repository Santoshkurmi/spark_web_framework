import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { mountDOm } from "./mount-dom.js";
import { patchDOM } from "./patch-dom.js";


export function createApp({state,view,reducers={}}){
    let parentEl = null;
    let vDom = null;


    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

    Object.entries(reducers).forEach(([commandName,reducer])=>{
       const subs = dispatcher.subscribe(commandName,payload=>{
           state = reducer(state,payload);
       });
       subscriptions.push(subs);
    });

    function emit(eventName,payload){
        dispatcher.dispatch(eventName,payload);
    }
    

    function renderApp(){
        // if(vDom){
        //     destroyDOM(vDom);
        // }
        const newVdom = view(state,emit);
        vDom = patchDOM(vDom,newVdom,parentEl);
        // mountDOm(vDom,parentEl);
    }//render app

    

    return {
        mount(parentElement){
            parentEl = parentElement;
            vDom = view(state,emit);
            mountDOm(vDom,parentEl);
        },
        unmount(){
            destroyDOM(vDom);
            subscriptions.forEach(sub=>sub());
            vDom = null;
        }
    }//returned object

} //createApp