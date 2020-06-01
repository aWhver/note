# 模拟原生数组splice方法

### 思路

- `splice`方法返回被截取的元素集合且改变原有数组及length属性
- 该方法接收0-3个参数，参数不同，执行结果不一样
  - 无参数返回空数组，对原数组无影响
  - 一个参数，从传入位置起截取至最后一位
  - 2个参数，从传入位置起截取**固定位数**
  - 3个参数，从传入位置起截取**固定位数**，并且从截取位置插入传入的元素

**-ps-**: 如果不是绑定在原型上，原数组作为一个参数传入的话，还需要做类型判断，抛出错误；挂载在原型上，如果不是相应类型，浏览器会自动识别错误

```javascript
Array.prototype.mockSlice = function (startIndex, endIndex) {
  var arr = [];
  for (i = startIndex; i < (endIndex || this.length); i++) {
    arr.push(this[i]);
  }
  return arr;
};
Array.prototype.mockSplice = function () {
  var argsLen = arguments.length;
  if (argsLen === 0) {
    return [];
  }
  var length = this.length;
  // 开始截取的位置
  var startIndex = arguments[0] || 0;
  // 结束截取的位置
  var endIndex = startIndex + (arguments[1] || length);
  // 被截取的元素集合
  var sliceEles = this.mockSlice(startIndex, endIndex);
  // 结束截取的位置右侧未被截取的
  var right = this.mockSlice(endIndex);
  var addEles = [];
  var _self = this;
  var addIndex = startIndex;
  // 需要被添加的元素
  for (let i = 2; i < argsLen; i++) {
    addEles.push(arguments[i]);
  }
  addEles.concat(right).forEach(function (v, index) {
    _self[startIndex + index] = v;
    addIndex++;
  });
  this.length = addIndex;

  return sliceEles;
};
```
