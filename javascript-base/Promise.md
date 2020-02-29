#### 手写Promise思路
- 首先`Promise`是可以通过**new + 构造函数**返回一个Promise，即定义一个构造函数
- 原生`Promise`接受一个执行函数，执行函数包括2个参数，resolve成功函数和reject失败函数
- 三个状态：`pending`、`fulFilled`、`rejected`
- `Promise`可以同时执行多次`then`，所以需要建立2个保存`resolve`和`reject`执行函数的数组。可以用发布订阅的模式

```javascript
  var promise = new Promise((resolve, reject) => {
    resolve('promise);
  });
  promise.then(res => {
    console.log(res);
  });
  promise.then(res => {
    console.log(res);
  });
  // output: promise、promise
```
- 支持链式调用，返回`新的Promise`
- `Promise` 静态方法 `resolve`、`reject` 返回终值的`Promise`(Promsie.resolve/reject())
- `Promise`分为 `ES Promise` 和 `Promise/A+` 规范

```javascript
/**
 * 1、当用 new 执行构造函数时，需要接受一个执行函数，执行函数包括2个参数，resolve成功函数和reject失败函数
 * 2、三个状态：1、pending(可以转变成fulFilled/rejected);2、fulFilled(成功，不可变);3、rejected（失败，不可变）
 * 3、因为可以链式调用所以需要返回Promise
 */

/**
 * @description Promise的参数，是一个函数，该函数包括2个参数函数resolve、reject
 * 1、resolve: 触发成功的函数
 * 2、reject: 触发失败的函数
 * @param {*} exector
 */
function CustomPromise(exector) {
  var _self = this;
  _self.status = 'pending';
  // resolve的值
  _self.data = undefined;
  // 失败值
  _self.error = undefined;
  _self.onFulFilleds = []; // resolve函数集合
  _self.onRejecteds = []; // reject函数集合
  function resolve(datas) {
    // 使用定时器是因为只有在执行环境堆栈仅包含平台代码时才可被调用
    // 原因见底部链接
    setTimeout(() => {
      // 只有pending状态才允许修改
      if (_self.status === 'pending') {
        _self.status = 'fulFilled';
        _self.data = datas;
        // 触发resolve
        _self.onFulFilleds.forEach(fn => fn());
      }
    });
  }
  function reject(errors) {
    if (_self.status === 'pending') {
      _self.status = 'rejected';
      _self.error = errors;
      // 触发reject
      _self.onRejecteds.forEach(fn => fn());
    }
  }
  exector(resolve, reject);
}

CustomPromise.prototype.then = function(resolve, reject) {
  var onFulFilled = typeof resolve === 'function' ? resolve : value => value;
  var onRejected = typeof reject === 'function' ? reject : value => value;
  var result, error;
  // 返回新的Promise，保证能够链式调用以及每个then返回的Promise状态相互独立
  var promise = new CustomPromise((resolve1, reject1) => {
    try {
      if (this.status === 'fulFilled') {
        result = onFulFilled(this.data);
        handleResult(promise, result, resolve1, reject1);
      }
      if (this.status === 'rejected') {
        error = onRejected(this.error);
        reject1(error);
      }

      if (this.status === 'pending') {
        // 发布订阅的模式，在等待过程中订阅，在resolve/reject时发布（执行）
        this.onFulFilleds.push(() => {
          // onFulFilled(this.data);
          try {
            result = onFulFilled(this.data);
            handleResult(promise, result, resolve1, reject1);
          } catch (err) {
            reject1(err);
          }
        });

        this.onRejecteds.push(() => {
          error = onRejected(this.error);
          reject1(error);
        });
      }
    } catch (err) {
      console.log('error', err);
      return new CustomPromise((resolve2, reject2) => {
        reject2(err);
      });
    }
  });

  return promise;
};

// 错误捕获
CustomPromise.prototype.catch = function(catchError) {
  return this.then(null, catchError);
};

/**
 * @description 处理then的resolve函数返回的结果
 * 结果分为3种：
 * 1、Promise
 * 2、拥有thenable的对象(Promsie/A+)
 * 3、基础数据类型、null、undefined
 *
 * @param {*} newPromise then 返回的新的Promise对象
 * @param {*} result resolve 返回的值
 * @param {*} resolve newPromise的回调函数第一个参数函数
 * @param {*} reject newPromise的回调函数第二个参数函数
 */
function handleResult(newPromise, result, resolve, reject) {
  if (newPromise === result) {
    reject('promise循环引用');
  }
  if (result instanceof Promise) {
    // Promise对象
    result.then(resolve, reject);
  } else if (
    result !== null &&
    (typeof result === 'object' || typeof result === 'function')
  ) {
    // 拥有thenable的对象
    var then = result.then;
    if (Object.prototype.toString.call(then) === '[object Function]') {
      then(
        res => {
          handleResult(newPromise, res, resolve, reject);
        },
        error => {
          reject(error);
        }
      );
    } else {
      // 普通对象
      resolve(result);
    }
  } else {
    resolve(result); // 基础类型值，null、undefined
  }
}

var promise = new CustomPromise((resolve, reject) => {
  console.log(1);
  resolve(3);
});
promise
  .then(res => {
    console.log('data:' + res);
    return 4;
  })
  .then(
    res => {
      // throw new Error("43432");
      console.log(res, 'res');
    },
    err => {
      console.log(err);
    }
  )
  .catch(error => {
    console.log(error, 'err');
  });
console.log(2);
// output： 1 2 data:3 4res
```
**resolve使用定时器原因：[原因(看注释部分)](https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/#note-4)**