
function addEventListener(eventName,handler,element){

    function boundHandler(e){
        handler(e)
    }
    element.addEventListener(eventName,boundHandler)
    return boundHandler;
}


export function addEventListeners(listeners={},element){

    const addedListeners = {};
    Object.entries(listeners).forEach(([eventName,handler])=>{
        const listener = addEventListener(eventName,handler,element)
        addedListeners[eventName] = listener
    })
    return addedListeners

}

export function removeEventListeners(listeners={},element){
    Object.entries(listeners).forEach(([eventName,handler])=>{
        element.removeEventListener(eventName,handler)
    })
}