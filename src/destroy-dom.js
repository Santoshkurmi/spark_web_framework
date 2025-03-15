import { removeEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";


export function destroyDOM(vDom){
    const {type} = vDom;

    switch(type){
        case DOM_TYPES.TEXT:{
            removeTextNode(vDom);
            break;
        }
        case DOM_TYPES.ELEMENT:{
            removeElement(vDom);
            break;
        }
        case DOM_TYPES.FRAGMENT:{
            removeFragment(vDom);
            break;
        }
        case DOM_TYPES.COMPONENT:{
            vDom.component.unmount();
            break;
        }
    }
}

function removeTextNode(vDom){
    vDom.el.remove();
}

function removeElement(vDom){
    const {el:element,children,listeners} = vDom;

    if(listeners){
        removeEventListeners(listeners,element);
        delete vDom.listeners;
    }

    children.forEach(child => destroyDOM(child));
    element.remove();
}

function removeFragment(vDom){
    vDom.children.forEach(child => destroyDOM(child));
}