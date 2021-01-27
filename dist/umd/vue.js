(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    // 把data中的数据，都使用Object.defineProperty重新定义  es5
    // Object.defineProperty 不能兼容ie8 及以下   vue2无法兼容ie8
    function observe(data) {
      console.log(data, "observe");
    }

    function initState(vm) {
      var opts = vm.$options; // vue 的数据来源 属性 方法 数据 计算属性 watch  vue的初始化流程

      if (opts.props) ;

      if (opts.methods) {
        initMethod(vm);
      }

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) {
        initComputed(vm);
      }

      if (opts.watch) {
        initWatch(vm);
      }
    }

    function initData(vm) {
      // console.log("初始化数据成功")
      // console.log(vm.$options.data())
      var data = vm.$options.data; //用户传递的data
      // vm._data  用户通过vm._data 就可以访问到data中的数据

      data = vm._data = typeof data === 'function' ? data.call(vm) : data; //判断如果data是个方法 将data中的this指向指向当前Vue
      // 对象劫持  用户改变数据  可以得到通知  进而刷新页面
      // Object.defineProperty() 给属性增加get和set方法

      observe(data); //响应式原理
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        // 数据劫持
        var vm = this; // vue中使用 this.$options 指代的就是用户传递的属性

        vm.$options = options; // 初始化状态

        initState(vm); //分割
      };
    }

    // Vue 的核心代码 只是Vue的一个声明

    function Vue(options) {
      // console.log(options)
      // 进行Vue的初始化
      this._init(options);
    } // 通过引入文件的方式  给Vue原型上添加方法


    initMixin(Vue); //给Vue原型上添加一个_init 方法

    return Vue;

})));
//# sourceMappingURL=vue.js.map
