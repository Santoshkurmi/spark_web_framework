

export function setAttributes(element,attrs){

    const {class:className,styles,...others} = attrs

    if(className){
        setClass(element,className)
    }

    if(styles){
        Object.entries(styles).forEach(([key,value])=>{
            setStyle(element,key,value)
        })
    }

    Object.entries(attrs).forEach(([name,value])=>{
        setAttribute(element,name,value)
    })
}

function setClass(element,className){
    element.className = "";
    if(typeof className === 'string'){
        element.className = className
        return
    }
    if(Array.isArray(className)){
        element.classList.add(...className)
    }

}

function setStyle(element,key,value){
    element.style[key] = value
}

function removeStyle(element,key){
    element.style[key] = null
}


export function setAttribute(element,name,value){
    if(value==null){
        removeAttribute(element,name)
        return
    }
    if(name.startsWith('data-')){
        element.setAttribute(name,value)
        return
    }

    element[name] = value
}

export function removeAttribute(element,name){
    element[name] = null;
    element.removeAttribute(name)
}