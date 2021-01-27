
// Vue 的核心代码 只是Vue的一个声明
import { initMixin } from './init'
function Vue(options){
    // console.log(options)
    // 进行Vue的初始化
    this._init(options)
}
// 通过引入文件的方式  给Vue原型上添加方法
initMixin(Vue)  //给Vue原型上添加一个_init 方法

export default Vue