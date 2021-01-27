
import { observe } from './observer/index'
export function initState(vm){
    const opts = vm.$options
    // vue 的数据来源 属性 方法 数据 计算属性 watch  vue的初始化流程

    if(opts.props){
        initProps(vm)
    }
    if(opts.methods){
        initMethod(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}

function initProps(vm){}
function initData(vm){
    // console.log("初始化数据成功")
    // console.log(vm.$options.data())
    let data = vm.$options.data  //用户传递的data
        // vm._data  用户通过vm._data 就可以访问到data中的数据
    data = vm._data = typeof data === 'function'?data.call(vm):data;   //判断如果data是个方法 将data中的this指向指向当前Vue
    // 对象劫持  用户改变数据  可以得到通知  进而刷新页面

    // Object.defineProperty() 给属性增加get和set方法
    observe(data); //响应式原理

}