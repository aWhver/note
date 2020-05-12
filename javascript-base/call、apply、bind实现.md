#### apply实现
```javascritp
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