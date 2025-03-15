
export const ARRAY_DIFF_OP = {
    ADD:0,
    REMOVE:1,
    MOVE:2,
    NOOP:3
}


export function arraysDiffSequence(oldArr,newArr,equalsFn=(a,b)=>a===b){
    const sequence = []
    const oldArray = new ArrayWithOriginalIndices(oldArr,equalsFn)

    for(let i=0;i<newArr.length;i++){
        // console.log("Yes Here")
        const newItem = newArr[i];
        const oldItem = oldArray.get(i);

        
        // changedchangedchanged
        
        if(oldArray.isRemoval(i,newArr)){
            sequence.push(oldArray.removeItem(i))
            i--;
            // console.log("I am hgere")
            // console.log(oldArr,newArr,i,"This")
        // throw new Error("This")
            continue
        }

        if(oldArray.isNoop(i,newArr)){
            sequence.push(oldArray.noopItem(i))
            continue
        }

        const item = newArr[i];
        if(oldArray.isAddition(item,i)){
            sequence.push(oldArray.addItem(item,i))
            continue
        }

        sequence.push(oldArray.moveItem(item,i))

    }//for
    sequence.push(...oldArray.removeItemAfterIndex(newArr.length))
    return sequence

}


class ArrayWithOriginalIndices{
    #array = []
    #originalIndices = []
    #equalsFn
    constructor(array=[],equalsFn){
        this.#array = [...array];
        this.#originalIndices = array.map((_,index)=>index);
        this.#equalsFn = equalsFn;
    }
    get length(){
        return this.#array.length
    }
    get(index){
        return this.#array[index]
    }

     isRemoval(index,newArray){
        // console.log(this.#array.length)
        if(index>=this.#array.length){
            return false
        }
        const item = this.#array[index];
        // console.log(item,"This is the old")
        // console.log(newArray,"This is the new")
        
        const indexInNewArray = newArray.findIndex((newItem)=>{
            // console.log("Inside loop ",newItem,item)
            return this.#equalsFn(item,newItem)
        })
        // console.log("found result",indexInNewArray,newArray,item,index)

        return indexInNewArray === -1
    }//

    removeItem(index){
        const operation = {
            op:ARRAY_DIFF_OP.REMOVE,
            index,
            item:this.#array[index]
        }
        this.#array.splice(index,1);
        this.#originalIndices.splice(index,1);

        return operation;
    }//removeItem

    originalIndexAt(index){
        return this.#originalIndices[index]
    }

    isNoop(index,newArray){
        if(index>=this.#array.length){
            return false
        }
        const item = this.#array[index];
        const newItem = newArray[index];
        return this.#equalsFn(item,newItem)
    }

    noopItem(index){
        return {
            op:ARRAY_DIFF_OP.NOOP,
            index,
            item:this.#array[index],
            originalIndex:this.originalIndexAt(index)
        }
    }//noopItem

    findIndexFrom(item,fromIndex){
        for(let i=fromIndex;i<this.#array.length;i++){
            if(this.#equalsFn(item,this.#array[i])){
                return i
            }
        }
        return -1
    }

    isAddition(item,fromIndex){
        return this.findIndexFrom(item,fromIndex)===-1
    }

    addItem(item,index){
        const operation = {
            op:ARRAY_DIFF_OP.ADD,
            index,
            item
        }
        this.#array.splice(index,0,item);
        this.#originalIndices.splice(index,0,-1);
        return operation;
    }

    moveItem(item,toIndex){
        const fromIndex = this.findIndexFrom(item,toIndex);

        const operation = {
            op:ARRAY_DIFF_OP.MOVE,
            originalIndex:this.originalIndexAt(fromIndex),
            index:toIndex,
            from:fromIndex,
            item:this.#array[fromIndex]
        }

        const [_item] = this.#array.splice(fromIndex,1);
        this.#array.splice(toIndex,0,_item);

        const [originalIndex] = this.#originalIndices.splice(fromIndex,1);
        this.#originalIndices.splice(toIndex,0,originalIndex);
        return operation;

    }

    removeItemAfterIndex(index){
        const operation = []

        while (index < this.#array.length) {
            operation.push(this.removeItem(index))
        }
        return operation
    }


}//class


export function withoutNulls(arr){
    return arr.filter(item=>item!=null)

}


export function arraysDiff(oldArr,newArr){
    return {
        added:newArr.filter(item=>!oldArr.includes(item)),
        removed:oldArr.filter(item=>!newArr.includes(item)),
    }
}//handle class differences