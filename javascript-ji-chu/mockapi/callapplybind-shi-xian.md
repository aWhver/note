# call、apply、bind实现

## call实现

```javascript
    var obj = {
        name: 'inigo'
        testfn: function() {
          console.log(this.name)
        }
    };
    function fn() {
      console.log(this.name)
      for(var k in arguments) {
        console.log(arguments[k]);
      }
    }
    // fn.call(obj);
    // es5版本
    function customCallOfEs5() {
      var fn = arguments[0];
      var context = arguments[1];
      if (typeof context === 'object') {
        context = context || 'window';
      } else {
        context = Object.create(null)
      }
      // 生成唯一的key，避免多次调用重复
      var fnKey = Math.random.toString(36).slice(2);
      context[fnKey] = fn; // 等同于obj.testfn();
      var args = [];
      for (var i = 2; i < arguments.length; i++ ) {
        var param = arguments[i];
        switch(typeof param) {
          case 'number':
            args.push(param);
            break;
          case 'string':
            args.push('"' + param + '"');
            break;
          case 'object':
            args.push(JSON.stringify(param))
        }
      }
      console.log(args);
      var result = eval('context[fnKey](' + args + ')')
      delete context[fnKey];
      return result;
    }
    // customCallOfEs5(fn, obj, { age: 25 }, 'programmer', 170, null);

    // es6版本
    function customCallOfEs6(fn, context, ...args) {
      if (typeof context === 'object') {
        context = context || 'window';
      } else {
        context = Object.create(null)
      }
      const fnKey = Math.random().toString(36).slice(2);
      context[fnKey] = fn;
      const result = context[fnKey](...args)
      delete context[fnKey];

      return result;
    }
    customCallOfEs6(fn, obj, { age: 25 }, 'programmer', 170, null);
```

## apply实现

```javascript
  function customApplyOfEs5() {
    var fn = arguments[0];
    var context = arguments[1];
    var args = arguments[2];
    if (typeof context === 'object') {
      context = context || 'window';
    } else {
      context = Object.create(null);
    }
    var fnKey = Math.random().toString(36).slice(2);
    var _args = [];
    context[fnKey] = fn;
    if (Object.prototype.toString.call(args) !== '[object Array]') {
      throw new Error('第三个参数请传入数组')
    }
    for (var i = 0, length = args.length; i < length; i++) {
      var param = args[i];
      switch(typeof param){
        case 'number':
          _args.push(param);
          break;
        case 'string':
          _args.push('"' + param + '"');
          break;
        case 'object':
          _args.push(JSON.stringify(param));
      }
    }
    var result = eval('context[fnKey](' + _args + ')');
    delete context[fnKey];
    return result;
  }
  // customApplyOfEs5(fn, obj, [{ age: 25 }, 'programmer', 170, null]);

  function customApplyOfEs6(fn, context, arg) {
    if (typeof context === 'object') {
      context = context || 'window';
    } else {
      context = Object.create(null);
    }
    if (Object.prototype.toString.call(arg) !== '[object Array]') {
      throw new Error('第三个参数请传入数组')
    }
    const fnKey = Math.random().toString(36).slice(2);
    context[fnKey] = fn;
    const result = context[fnKey](...arg);

    return result;
  }
  customApplyOfEs6(fn, obj, [{ age: 25 }, 'programmer', 170, null]);
```

## bind实现

```javascript
  function customBindOfEs5() {
    var fn = arguments[0];
    var context = arguments[1];
    var args = Array.from(arguments);
    if (typeof context === 'object') {
      context = context || 'window';
    } else {
      context = Object.create(null);
    }
    // 创建一个空函数用于过渡继承
    var F = function () {};
    F.prototype = fn.prototype;
    var bound = function() {
      var _args = args.concat(Array.from(arguments));
      var combineArgs = [];
      for(var i = 2, length = _args.length; i< length; i++) {
        var param = _args[i];
        switch(typeof param){
          case 'number':
            combineArgs.push(param);
            break;
          case 'string':
            combineArgs.push('"' + param + '"');
            break;
          case 'object':
            combineArgs.push(JSON.stringify(param));
            break;
        }
      }
      return eval('customCallOfEs5(fn, context,' + combineArgs + ')');
      // return eval('fn.call(context,' + combineArgs + ')');
    };
    bound.prototype = new F();
    return bound;
  }
  // customBindOfEs5(fn, obj, 3)(4);

  function customBindOfEs6(fn, context, ...restArgs) {
    const args = Array.from(arguments);
    if (typeof context === 'object') {
      context = context || 'window';
    } else {
      context = Object.create(null);
    }
    // 创建一个空函数用于过渡继承
    const F = function () {};
    F.prototype = fn.prototype;
    const bound = function() {
      return customCallOfEs6(fn, context, ...restArgs, ...arguments);
      // return fn.call(context, ...restArgs, ...arguments)
    }
    bound.prototype = new F();
    return bound;
  }
  customBindOfEs6(fn, obj, 23)(47);
```

