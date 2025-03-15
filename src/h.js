import { withoutNulls } from "./utils/arrays.js"

export const DOM_TYPES = {
    TEXT:0,
    ELEMENT:1,
    FRAGMENT:2
}



export function h(tag,props={},children=[]){
    return {
        tag,
        props,
        children: mapTextNodes(withoutNulls(children)),
        type:DOM_TYPES.ELEMENT
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
