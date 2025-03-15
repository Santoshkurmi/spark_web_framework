import { setAttributes } from "./attributes.js";
import {  addEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";
import { extractChildren } from "./patch-dom.js";
import { extractPropsAndEvents } from "./utils/props.js";

export function mountDOm(vDom,parentElement,index,hostComponent=null){
    // console.log(vDom,vDom.type)
    switch(vDom.type){
        case DOM_TYPES.TEXT:
            mountText(vDom,parentElement,index)
            break
        case DOM_TYPES.ELEMENT:
            mountElement(vDom,parentElement,index,hostComponent)
            break
        case DOM_TYPES.FRAGMENT:
            mountFragment(vDom,parentElement,index,hostComponent)
            break
        case DOM_TYPES.COMPONENT:
            mountComponent(vDom,parentElement,index,hostComponent)
            break

        default: throw new Error(`Unknown type ${vDom.type} of node to mount`)
    }
}

function mountComponent(vDom,parentElement,index,hostComponent){
    const Component = vDom.tag;
    const {props,events} = extractPropsAndEvents(vDom);

    const component = new Component(props,events,hostComponent);
    component.mount(parentElement,index);
    vDom.component = component;
    vDom.el = component.firstElement;
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

function mountElement(vDom,parentElement,index,hostComponent){
    const {tag,props,children} = vDom
    const element = document.createElement(tag)
    addProps(element,props,vDom,hostComponent)
    vDom.el = element

    children.forEach(child=>mountDOm(child,element,null,hostComponent))
    insert(element,parentElement,index)
   
}

function mountFragment(vDom,parentElement,index,hostComponent){
    vDom.el = parentElement;
    vDom.children.forEach((child,i)=>mountDOm(child,parentElement,index? index+i:null,hostComponent))
}


function addProps(element,props,vDom,hostComponent){
    const {on:events,...attrs} = props

    vDom.listeners = addEventListeners(events,element,hostComponent);
    setAttributes(element,attrs)
}

