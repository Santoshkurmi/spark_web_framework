import { defineComponent } from "../component.js";
import { h, hString } from "../h.js";



export const Counter = defineComponent({
    state(props){
        // console.log("State",props.count)
        return {count:props.count}
    },
    render(){
        console.log("Rendering Counter",this.state)
        const count = this.useState(0);
        
        // return h("div", {"id":"container","class":"main"}, [h("h1", {"styles":{color:"red"}}, [hString("Hello, World!")]), h("p", {"onclick":{()=>console.log("Hello")}}, [hString("This is a paragraph.")]), h("ul", {}, [h("li", {}, [hString("Item 1")]), h("li", {}, [hString("Item 2")])])])
      
        // console.log(count,man)
        return h('div',{class:'counter'},[
            h('h1',{class:'counter-value'},[hString(this.state.count)]),
            h('input',{type:'text',value:this.state.count,on:{input:e=>this.updateState({count:e.target.value})} } ),
            
            h('button',{on:{click:()=>{
                count.current = count.current+1;
                console.log("Clicked with ",count.current)
                
                this.updateState({count:this.state.count+1})
                console.log("2. Clicked with ",this.state.count,)
                this.updateState({count:this.state.count+1})
               
            }}},['Add']),
            h('br'),
            h('ul',{class:'todo-list'},
                this.state.count.toString().split('').map(
                    (char,index)=>h('li',{class:'todo-item',styles:{backgroundColor:index%2==0?"red":"blue"},
                        on:{
                            click:()=>this.updateState({count:this.state.count-1})}},[char])    ) ),
        ])
    },
    onBeforeMount(){
        console.log("Before mount")
    },
    onMount(){
        console.log("Mounted")
    },
    onBeforeUpdate(){
        console.log("Before update", this.state.count)
        // return this.state.count >105;
    },
    onUpdate(){
        console.log("Updated")
        // this.unMount();
    },
    
    onPropsChange(newProps,oldProps){
        console.log(newProps,oldProps)
        return true;
    },
    
    onBeforeUnmount(){
        console.log("Before unmount")
    },
    onUnMount(){
        console.log("Unmounted")
    },
})