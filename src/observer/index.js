// 把data中的数据，都使用Object.defineProperty重新定义  es5
// Object.defineProperty 不能兼容ie8 及以下   vue2无法兼容ie8

export function observe(data){
    console.log(data,"observe")
}