// 重写数组的哪些方法 push unshift pop shift reverse sort splice 这7种数组方法会导致数组本身发生变化 


let oldArrayMethods = Array.prototype; 

// 注 Object.create(obj)  arrayMethods.__proto__  可以获取 obj
export const arrayMethods = Object.create(oldArrayMethods)

const methods = [
    'push',
    'unshift',
    'pop',
    'shift',
    'reverse',
    'sort',
    'splice',

]

methods.forEach(method=>{
    arrayMethods[method] = function (...args) { //AOP  切片编程
        const result = oldArrayMethods[method].apply(this,args) //调用原生数组方法   this指向arrayMethods的调用者
        // push  unshift 添加的元素可能还是一个对象
        console.log("用户调用了")
        let inserted;
        let ob = this.__ob__  // 指向Observer

        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':   //3个新增的属性 splice 有删除 新增的功能  arr.splice(0,1,{})   第三个值是增加的新值
                inserted = args.slice(2);  //获取新增的值
            default:
                break;
        }
        if(inserted) ob.observeArray(inserted) //将新增的属性继续观测

        return result
     }
})
