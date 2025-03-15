import { setAttributes } from "./attributes.js";
import {  addEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";

export function mountDOm(vDom,parentElement,index){
    switch(vDom.type){
        case DOM_TYPES.TEXT:
            mountText(vDom,parentElement,index)
            break
        case DOM_TYPES.ELEMENT:
            mountElement(vDom,parentElement,index)
            break
        case DOM_TYPES.FRAGMENT:
            mountFragment(vDom,parentElement,index)
            break

        default: throw new Error(`Unknown type ${vDom.type} of node to mount`)
    }
}


function insert(element,parentElement,index){
    if(index==null){
        parentElement.append(element)
        return
    }

    if(index<0){
        throw new Error(`Index ${index} is negative`)
    }
    const children = parentElement.childNodes;

    if(index >= children.length){
        parentElement.append(element)
        return
    }
    else{
        parentElement.insertBefore(element,children[index])
    }
}//insert

function mountText(vDom,parentElement,index){
    const textNode = document.createTextNode(vDom.value)
    vDom.el = textNode
    insert(textNode,parentElement,index)
}

function mountElement(vDom,parentElement,index){
    const {tag,props,children} = vDom
    const element = document.createElement(tag)
    addProps(element,props,vDom)
    vDom.el = element

    children.forEach(child=>mountDOm(child,element))
    insert(element,parentElement,index)
   
}

function mountFragment(vDom,parentElement,index){
    vDom.el = parentElement;
    vDom.children.forEach((child,i)=>mountDOm(child,parentElement,index? index+i:null))
}


function addProps(element,props,vDom){
    const {on:events,...attrs} = props

    vDom.listeners = addEventListeners
    (events,element);
    setAttributes(element,attrs)
}

