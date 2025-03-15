import { withoutNulls } from "./utils/arrays.js"

export const DOM_TYPES = {
    TEXT:"text",
    ELEMENT:"element",
    FRAGMENT:"fragment",
    COMPONENT:"component"
}



export function h(tag,props={},children=[]){
    const type = typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;
    return {
        tag,
        props,
        type,
        children: mapTextNodes(withoutNulls(children)),
    }
    
}

export function hString(str){
    return {
        type:DOM_TYPES.TEXT,
        value:str
    }
}

export function hFragment(vNodes){
    return {
        type:DOM_TYPES.FRAGMENT,
        children:mapTextNodes(withoutNulls(vNodes))
    }
}

function mapTextNodes(children=[]){
    return children.map(child=>{
        if(typeof child === 'string'){
            return hString(child)
        }
        return child
    })
}
