
function addEventListener(eventName,handler,element,hostComponent){

    function boundHandler(){
        hostComponent? handler.apply(hostComponent,arguments):
            handler(...arguments)
    }
    element.addEventListener(eventName,boundHandler)
    return boundHandler;
}


export function addEventListeners(listeners={},element,hostComponent=null){

    const addedListeners = {};
    Object.entries(listeners).forEach(([eventName,handler])=>{
        const listener = addEventListener(eventName,handler,element,hostComponent)
        addedListeners[eventName] = listener
    })
    return addedListeners

}

export function removeEventListeners(listeners={},element){
    Object.entries(listeners).forEach(([eventName,handler])=>{
        element.removeEventListener(eventName,handler)
    })
}