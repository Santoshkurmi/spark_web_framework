

export function shallowEquals(objOne,objTwo){
    if(objOne==objTwo) return true;

    if(objOne==null || typeof objOne !='object') false;
    if(objTwo==null || typeof objTwo !='object') false;
    
    const keysOne = Object.keys(objOne);
    const keysTwo = Object.keys(objTwo);
    if(keysOne.length!==keysTwo.length){
        return false;
    }
    for(const key of keysOne){
        if(objOne[key]!==objTwo[key]){
            return false;
        }
    }
    return true;

}