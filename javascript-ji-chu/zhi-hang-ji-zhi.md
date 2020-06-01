# 1、详细描述 EventLoop机制

javascript拥有唯一的事件循环机制，但是js有任务队列之说，可以有多个。

什么是事件循环？

* 首先，js单线程，自上而下执行代码
* 然后任务分为宏任务和微任务，从另一个维度分任务有同步和异步之分

js有一个主线程和调用栈。当代码执行时，会执行所有的script代码和宏任务，宏任务一般是同步任务，也有异步任务\(比如定时器\)，但是微任务都是异步任务。所以代码执行过程如下：

* 代码执行，遇到全局代码，直接压入调用栈执行，执行完等待弹栈
* 如果遇到宏任务
  * 同步任务的话，直接压入调用栈执行，执行完等待弹栈
  * 异步任务的话，将其压入任务队列，这里的任务队列包括全局的和宏任务的，注册一个回调事件，压入执行栈，此时这里已经是一个同步任务了，等待下次循环时候执行，这里**循环结束指的是所有的全局代码和微任务执行完毕**
* 如果遇到微任务
  * 微任务包括promise.then\(这里不是值Promise,Promise是构造函数，new的时候会立即执行\)、MutationObserver。
  * 微任务会被压入微任务队列，接着往下执行全局代码，待全局代码执行完后，然后再将微任务从队列取出压入调用栈执行，等待执行完弹栈
  * 检查微任务队列是否还有任务，有的话，将队列任务压入调用栈执行，等待执行完弹栈；如果没有任务队列结束本次事件，进行下一次事件循环，从宏任务开始

上面的执行过程就被称为`事件循环`

```javascript
new Promise(function() {
  console.log('promise1');
}).then(function() { // 微任务
  console.log('then1');
});

setTimeout(function() { // 宏任务
  console.log('setTimeout1');
});

console.log('global code'); // 全局代码
```

按照上面的过程结果是：promise1、global code、then1、setTimeout1。

上面说的`循环结束指的是所有的全局代码和微任务执行完毕`,下面我们看个例子

```javascript
var statrTime = +new Date();
setTimeout(function() {
  console.log('timeout2');
  console.log('time: ', +new Date() - statrTime);
}, 300);
new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('then1');
});
setTimeout(function() {
  console.log('timeout1');
});
console.log('global code')
console.time();
var fragment = document.createDocumentFragment();
for (var i = 0; i < 1000000; i++) {
  var node = document.createElement('span');
  node.innerText = i;
  fragment.appendChild(node);
}
console.timeEnd()
```

![](https://github.com/aWhver/for-PicGo/blob/master/images/eventloop-case.png)

可以看出在300ms定时器的里时间是1326ms，远超过300ms，这是怎么回事呢。

首先按照上面的说法，遇到定时器会将定时器压入任务队列，注册一个回调事件，告诉浏览器我现在不执行，等300ms再来调用我，然后向下执行。300ms后到了，就去执行任务队列执行定时器，此时发现任务队列中有for循环在执行，还没执行完，此时已经在队列中了，而js是单线程的，代码只能依次运行，所以就等，等待for循环结束后，再去任务队列中的任务，之前的回调已经在了，所以接着执行。

**ps**：事件的循环结束是以微任务队列中有没有任务，没有就进行下一次循环。不管有没有执行到微任务，这个检查微任务队列的过程都是有的。

这里有个外国人博客可以看出入栈过程：[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

![](https://github.com/aWhver/for-PicGo/blob/master/images/stack.gif)

