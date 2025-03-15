import { createApp } from "./app.js";
import { h, hString } from "./h.js";


createApp({

    state:{
        currentTodo:"",
        todos:[]
    },
    reducers:{
        // add:(state,amount)=>state+amount,
        // subtract:(state,amount)=>state-amount,
        setCurrentTodo:(state,todo)=>{  return {...state,currentTodo:todo} },
        addTodo:(state)=>{

            return {
                ...state,
                todos:[...state.todos,state.currentTodo],
                currentTodo:""
            }
        },
        removeTodo:(state,indexToDelete)=>{
            return {
                ...state,
                todos:state.todos.filter((_,index)=>index!==indexToDelete)
            }
        }
    },
    view:(state,emit)=>{
        // console.log(state,"State")
        return h('div',{class:'counter'},[
            h('h1',{class:'counter-value'},["Todo"]),
            h('input',{type:'text',value:state.currentTodo,on:{input:e=>emit('setCurrentTodo',e.target.value),keydown:e=>e.keyCode===13&&emit('addTodo')} } ),
            
            h('button',{on:{click:()=>emit('addTodo')}},['Add']),
            h('br'),
            h('ul',{class:'todo-list'},
                state.todos.map(
                    (todo,index)=>h('li',{class:'todo-item',styles:{backgroundColor:index%2==0?"red":"blue"},
                        on:{
                            click:()=>emit('removeTodo',index)}},[todo])    ) ),
        ])
    }
}).mount(document.getElementById('root'));


