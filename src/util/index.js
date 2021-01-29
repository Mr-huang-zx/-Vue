
/**
 * 
 * @param {*} data 当前数据是否为对象
 */

export function isObject(data){
   return typeof data ==='object' && data!==null
}

export function def(data,key,value) { 
   Object.defineProperty(data,key,{
      enumerable:false, //不可枚举
      configurable:false,
      value:value
  })
 }