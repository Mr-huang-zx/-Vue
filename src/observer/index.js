// 把data中的数据，都使用Object.defineProperty重新定义  es5
// Object.defineProperty 不能兼容ie8 及以下   vue2无法兼容ie8
import { isObject,def } from '../util/index'
import { arrayMethods } from './array'


class Observer{
    constructor(value){
        console.log(value)
        // vue 如果数据的层次过多，需要递归的取解析对象中的属性。依次增加set和get方法  

        // value. = this
        def(value,'__ob__',this)
        if(Array.isArray(value)){
            //如果是数组，的话不对索引进行观测 因为会导致性能问题
            // 数组push unshift等方法也要重写
            value.__proto__= arrayMethods



            // 如果数组里放的对象
            this.observeArray(value)

        }else{
            this.walk(value)
        }
    }

    // 观测数组对象
    observeArray(value) {
        for(let i = 0;i<value.length;i++){
            observe(value[i])
        }
    }
    walk(data){
        let keys = Object.keys(data) //获取属性组成数组
        for(let i =0;i<keys.length;i++){
            console.log()
            let key = keys[i] //获取每个属性
            let value = data[key] //获取每个属性值
            defineReactive(data,key,value) //定义响应式数据

        }
    }
}
function defineReactive(data,key,value){
    observe(value)  //递归对象

    Object.defineProperty(data,key,{
        get(){ //获取值可以做一些操作
           
            return value
        },
        set(newValue){ //值可改变时可以做一些操作
            if(newValue === value){
                return
            }
            console.log("值发生变化了")
            value = newValue
        }
    })
}
export function observe(data){
    let isObj = isObject(data)
    if(!isObj){
        return false
    }
   return new Observer(data)//用来观测对象
    
}