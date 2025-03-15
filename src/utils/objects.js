
export function objectsDiff(oldObj,newObj){
    if(oldObj==null) oldObj = {};
    if(newObj==null) newObj = {};
    const oldKeys = Object.keys(oldObj);
    const newKeys = Object.keys(newObj);
    return{
        added:newKeys.filter(key=>!oldKeys.includes(key)),
        removed:oldKeys.filter(key=>!newKeys.includes(key)),
        changed:newKeys.filter(key=>oldKeys.includes(key)&&oldObj[key]!==newObj[key])
    }
}


export function hasOwnProperty(obj,key){
    return Object.prototype.hasOwnProperty.call(obj,key)
}