(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 
   * @param {*} data 当前数据是否为对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      //不可枚举
      configurable: false,
      value: value
    });
  }

  // 重写数组的哪些方法 push unshift pop shift reverse sort splice 这7种数组方法会导致数组本身发生变化 
  var oldArrayMethods = Array.prototype; // 注 Object.create(obj)  arrayMethods.__proto__  可以获取 obj

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'unshift', 'pop', 'shift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //AOP  切片编程
      var result = oldArrayMethods[method].apply(this, args); //调用原生数组方法   this指向arrayMethods的调用者
      // push  unshift 添加的元素可能还是一个对象

      console.log("用户调用了");
      var inserted;
      var ob = this.__ob__; // 指向Observer

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          //3个新增的属性 splice 有删除 新增的功能  arr.splice(0,1,{})   第三个值是增加的新值
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted); //将新增的属性继续观测

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      console.log(value); // vue 如果数据的层次过多，需要递归的取解析对象中的属性。依次增加set和get方法  
      // value. = this

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        //如果是数组，的话不对索引进行观测 因为会导致性能问题
        // 数组push unshift等方法也要重写
        value.__proto__ = arrayMethods; // 如果数组里放的对象

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    } // 观测数组对象


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); //获取属性组成数组

        for (var i = 0; i < keys.length; i++) {
          console.log();
          var key = keys[i]; //获取每个属性

          var value = data[key]; //获取每个属性值

          defineReactive(data, key, value); //定义响应式数据
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); //递归对象

    Object.defineProperty(data, key, {
      get: function get() {
        //获取值可以做一些操作
        return value;
      },
      set: function set(newValue) {
        //值可改变时可以做一些操作
        if (newValue === value) {
          return;
        }

        console.log("值发生变化了");
        value = newValue;
      }
    });
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return false;
    }

    return new Observer(data); //用来观测对象
  }

  function initState(vm) {
    var opts = vm.$options; // vue 的数据来源 属性 方法 数据 计算属性 watch  vue的初始化流程

    if (opts.props) {
      initProps(vm);
    }

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
