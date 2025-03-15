import { removeAttribute, setAttribute } from "./attributes.js";
import { destroyDOM } from "./destroy-dom.js";
import { DOM_TYPES } from "./h.js";
import { mountDOm } from "./mount-dom.js";
import { areNodesEqual } from "./nodes-equal.js";
import { ARRAY_DIFF_OP, arraysDiff, arraysDiffSequence } from "./utils/arrays.js";
import { objectsDiff } from "./utils/objects.js";
import { isNotBlankOrEmpty } from "./utils/string.js"
import { extractPropsAndEvents } from "./utils/props.js";

export function patchDOM(oldVdom, newVDom, parentEl,hostComponent=null) {
    // console.log(oldVdom,newVDom,"Stopped here")
    if (!areNodesEqual(oldVdom, newVDom)) {
        const index = findIndexInparent(parentEl, oldVdom.el);
        // throw new Error("destroyDOM(oldVdom)")
        destroyDOM(oldVdom)
        mountDOm(newVDom, parentEl, index,hostComponent)
    }
    // console.log(oldVdom, newVDom)
    newVDom.el = oldVdom.el;

    switch (newVDom.type) {
        case DOM_TYPES.TEXT:
            patchText(oldVdom, newVDom)
            break

        case DOM_TYPES.ELEMENT:
            patchElement(oldVdom, newVDom,hostComponent)
            break

        case DOM_TYPES.COMPONENT:
            patchComponent(oldVdom, newVDom,hostComponent)
            break
        // case DOM_TYPES.FRAGMENT:
        //     patchFragment(oldVdom, newVDom,hostComponent)
        //     break
        default: throw new Error(`Unknown type ${newVDom.type} of node to patch`)
    }

    patchChildren(oldVdom, newVDom,hostComponent);

    return newVDom;




}


function patchComponent(oldVdom, newVdom,hostComponent) {
    
    const {component} = oldVdom;
    const {props,events} = extractPropsAndEvents(newVdom);
    component.updateProps(props);

    newVdom.component = component;
    newVdom.el = component.firstElement;

}


function patchChildren(oldVdom, newVdom,hostComponent) {
    const oldChildren = extractChildren(oldVdom);
    const newChildren = extractChildren(newVdom);
    // console.log(oldChildren,newChildren,"Stopped here")
    const parentEl = oldVdom.el;
    // console.log("yes")
    const diffSequence = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);
    // console.log(diffSequence, "Checking sequence")
    const offset = hostComponent?.offset ?? 0;
    for (const diff of diffSequence) {
        const { from, index, item, originalIndex } = diff;
        // console.log(diff.op,"OP")
        switch (diff.op) {
            case ARRAY_DIFF_OP.ADD:
                mountDOm(item, parentEl, index+offset,hostComponent)
                console.log("Added new child ",item.tag)
                break
            case ARRAY_DIFF_OP.REMOVE:
                destroyDOM(item);
                console.log("Removed  child ",item.tag)
                break
            case ARRAY_DIFF_OP.MOVE:
                const oldChild = oldChildren[originalIndex];
                const newChild = newChildren[index];
                const el = oldChild.el;
                const elAtTargetIndex = parentEl.childNodes[index+offset];
                parentEl.insertBefore(el, elAtTargetIndex);
                patchDOM(oldChild, newChild, parentEl,hostComponent);
                break
            case ARRAY_DIFF_OP.NOOP:
                // console.log(oldChildren[originalIndex],newChildren[index],"1122")
                patchDOM(oldChildren[originalIndex], newChildren[index], parentEl,hostComponent);
                break
        }//switch
    }



}

export function extractChildren(vDom) {
    if (vDom.children == null) {
        return []
    }

    const children = []

    for (const child of vDom.children) {
        if (child.type == DOM_TYPES.FRAGMENT) {
            children.push(...extractChildren(child))
        }
        else {
            children.push(child)
        }
    }

    return children;
}

function patchElement(oldVdom, newVdom,hostComponent) {
    const el = oldVdom.el;

    const {
        class: oldClass,
        styles: oldStyles,
        on: oldEvents,
        ...oldAttrs
    } = oldVdom.props;

    const {
        class: newClass,
        styles: newStyles,
        on: newEvents,
        ...newAttrs
    } = newVdom.props;

    const oldListeners = oldVdom.listeners;
    patchAttributes(el, oldAttrs, newAttrs);
    patchClasses(el, oldClass, newClass);
    patchStyles(el, oldStyles, newStyles);
    newVdom.listeners = patchEvents(el, oldEvents, newEvents,hostComponent);
    // setAttribute

}

function patchAttributes(element, oldAttrs, newAttrs) {
    const { added, removed, changed } = objectsDiff(oldAttrs, newAttrs);
    // console.log(added,removed,updated,"Attributes")
// 
    for (const attr of removed) {
        removeAttribute(element, attr);
    }
    for (const attr of added.concat(changed)) {
        setAttribute(element, attr, newAttrs[attr]);
    }
}


function patchClasses(element, oldClass, newClass) {
    const oldClasses = toClassList(oldClass);
    const newClasses = toClassList(newClass);

    const { added, removed } = arraysDiff(oldClasses, newClasses);

    if (added.length > 0) {
        element.classList.add(...added);
    }
    if (removed.length > 0) {
        element.classList.remove(...removed);
    }

}


function patchEvents(element, oldEvents = {}, newEvents = {},hostComponent) {
    const { removed, added, changed } = objectsDiff(oldEvents, newEvents);

    for (const eventName of removed.concat(changed)) {
        element.removeEventListener(eventName, oldEvents[eventName]);
    }
    const addedListeners = {}
    for (const eventName of added) {
        const listener = addEventListener(eventName, newEvents[eventName], element,hostComponent);
        addedListeners[eventName] = listener;
    }

    return addedListeners;
}
function patchStyles(element, oldStyles, newStyles) {
    // console.log(oldStyles, newStyles)
    const { added, removed, changed } = objectsDiff(oldStyles, newStyles);
    for (const key of removed) {
        element.style[key] = null;
    }
    for (const key of added.concat(changed)) {
        element.style[key] = newStyles[key];
    }
}

function toClassList(classNames = '') {
    return Array.isArray(classNames) ?
        classNames.filter(isNotBlankOrEmpty).join(' ') :
        classNames.split(/(\s+)/).filter(isNotBlankOrEmpty);

}

function patchText(oldVdom, newVdom) {
    if (oldVdom.el.nodeValue !== newVdom.value) {
        oldVdom.el.nodeValue = newVdom.value;
    }
}

function findIndexInparent(parentEl, el) {
    const index = Array.from(parentEl.childNodes).indexOf(el);
    if (index < 0) {
        return null
    }
    return index;
}
