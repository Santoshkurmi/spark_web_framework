// import equal from "fast-deep-equal";
import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { DOM_TYPES } from "./h.js";
import { mountDOm } from "./mount-dom.js";
import { extractChildren, patchDOM } from "./patch-dom.js";
import { hasOwnProperty } from "./utils/objects.js";
import { shallowEquals } from "./utils/shallowEquals.js";

export function defineComponent({render,state,...methods}){
    class Component{
        #vdom = null;
        #hostEl = null;
        #isMounted = false;
        #eventHandlers = null;
        #parentComponent = null;
        #dispatcher = new Dispatcher();
        #subscriptions = [];
        // #stateQueue = [];
        #isBatching = false;
        #states = [];
        #currentIndex = 0;

        constructor(props={},eventHandlers={},parentComponent=null){
            this.props = props;
            this.state = state ? state(props) : {};
            // this.nextState = this.state;
            this.#eventHandlers = eventHandlers;
            this.#parentComponent = parentComponent;
        }

        useState(state){
            if(! this.#isMounted){
                const currentState = {current:state};
                this.#states.push(currentState);
                // this.#currentIndex++;
                return currentState;
            }
            if(this.#states.length<=this.#currentIndex){
                throw new Error("Always use useState in the main component root not in a condition or function call.")
            }
            else{
                return this.#states[this.#currentIndex++];
            }
            
        }

        #wireEventHandlers(){
            this.#subscriptions = Object.entries(this.#eventHandlers).map(([eventName,handler])=>{
                return this.#wireEventHandler(eventName,handler);
            })
        }

        #wireEventHandler(eventName,handler){
            
            return this.#dispatcher.subscribe(eventName,payload=>{
                if(this.#parentComponent){
                    handler.call(this.#parentComponent,payload)
                }
                else{
                    handler(payload)
                }
            })
        }


        updateState(state,alwaysRerender=true){

            this.state = {...this.state,...state};
            if(!alwaysRerender && shallowEquals(this.state,this.nextState)){
                return;
            }
            // console.log(this.nextState)

            if(!this.#isBatching){
                this.#isBatching = true;
                Promise.resolve().then(this.flushState.bind(this));
                return;
            }
            // this.state = newState;
            // console.log(this.state,"State")
            // this.#patch();
        }

        flushState(){
            this.#isBatching = false;
            const isUpdate = this.onBeforeUpdate();

            if( isUpdate !=null && !isUpdate) return;
            // this.state = this.nextState;
            this.#patch();
            this.#currentIndex = 0;
            this.onUpdate();
        }

        render(){
            return render.call(this)
        }

        onMount(){}
        onUpdate(){}
        onUnMount(){}
        onBeforeUnmount(){}
        onBeforeUpdate(){}
        onBeforeMount(){}
        onPropsChange(){}


        mount(hostEl,index=null){
            if(this.#isMounted){
                throw new Error("Component is already mounted")
            }
            this.onBeforeMount();
            this.#vdom = this.render();
            mountDOm(this.#vdom,hostEl,index,this);
            this.#wireEventHandlers();
            this.#hostEl = hostEl;
            this.#isMounted = true;
            this.onMount();
        }

        emit(eventName,payload){
            this.#dispatcher.dispatch(eventName,payload);
        }

        unMount(){
            if(!this.#isMounted){
                throw new Error("Component is not mounted")
            }
            this.onBeforeMount()
            destroyDOM(this.#vdom);
            this.#subscriptions.forEach(sub=>sub());
            this.#vdom = null;
            this.#hostEl = null;
            this.#subscriptions = [];
            this.#isMounted = false;
            this.onUnMount();
        }

        #patch(){
            if(!this.#isMounted){
                throw new Error("Component is not mounted")
            }
            const newVdom = this.render();
            // console.log(newVdom,"New VDOM")
            this.#vdom = patchDOM(this.#vdom,newVdom,this.#hostEl,this);
        }

        updateProps(props){
            const newprops = {...this.props,...props};

            // if( this.props.count === newprops.count){
            //     return;
            // }
            const isUpdate = this.onPropsChange(newprops,this.props) ? false : true;
            if(isUpdate){
                this.props = newprops;
                this.#patch();
            }

        }


        get elements(){
            if(this.#vdom == null){
                return [];
            }
            if(this.#vdom.type === DOM_TYPES.FRAGMENT){
                return extractChildren(this.#vdom).flatMap(child=>{
                    if(child.type === DOM_TYPES.COMPONENT){
                        return child.component.elements;
                    }
                    return [child.el];
                });
            }

            return [this.#vdom.el];
        }

        get firstElement(){
            return this.elements[0];
        }

        get offset(){
            if(this.#vdom.type===DOM_TYPES.FRAGMENT){
                return Array.from(this.#hostEl.children).indexOf(this.firstElement);
            }
            return 0;
        }




    }

    for(const methodName in methods){
        
        if( !methodName.startsWith("on") && hasOwnProperty(Component,methodName)){
            throw new Error(`Component already has method ${methodName}`)
        }
        Component.prototype[methodName] = methods[methodName];
    }

    return Component;
}