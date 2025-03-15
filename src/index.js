import { createApp } from "./app.js";
import { h, hString } from "./h.js";
import { Counter } from "./ui/Counter.js";


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
        console.log(state,"State")
        return h('div',{class:'counter'},[
            h("p",{on:{click:()=>emit("addTodo")}},["Hello World"]),
           h(Counter,{click:()=>console.log("Yes there"),count:99,on:{click:()=>console.log("Parent is called")}})
        ])
    }
}).mount(document.getElementById('root'));


