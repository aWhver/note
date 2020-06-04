# indexOf 多方式实现

### 思路

- 拥有`indexOf`方法的对象有 `String`、`Array`
- 接受 2 个参数，第 1 个是目标值，第 2 个开始搜索位置(很少用)
- 目标值匹配的是一个整体，目标值需要所有元素都在检测的数据源里，且顺序要对应
- `indexOf`第 2 个参数为负数时 `String`的表现为从 `0开始`，而 `Array` 表现为从末尾开始
- 匹配多字符的结果情况：

```javascript
const str = 'easfdsfe';
str.indexOf('as'); // 1
str.indexOf('ys'); // -1
str.indexOf('af'); // -1
```

#### 方式一：正则 exec 方法

```javascript
function mockIndexOf(eles, target, startIndex = 0) {
  const dataType = Object.prototype.toString.call(eles);
  if (dataType === '[object String]') {
    const regex = new RegExp(target, 'ig');
    regex.lastIndex = startIndex;
    const result = regex.exec(str);
    return result ? result.index : -1;
  }
  if (dataType === '[object Array]') {
    const len = eles.length;
    const _startIndex = startIndex >= 0 ? startIndex : startIndex + len;
    return eles.findIndex((v, index) => startIndex <= index && v === target);
  }
  throw new Error('第一个参数请传入数组或者字符串');
}
```

#### 方式二：字符串 match 和 substr 方法

```javascript
function mockIndexOf(eles, target, startIndex = 0) {
  const dataType = Object.prototype.toString.call(eles);
  if (dataType === '[object Array]') {
    const len = eles.length;
    const _startIndex = startIndex >= 0 ? startIndex : startIndex + len;
    return eles.findIndex((v, index) => {
      return _startIndex <= index && v === target;
    });
  }
  if (dataType === '[object String]') {
    const len = eles.length;
    const _startIndex =
      startIndex >= 0 ? (startIndex < len ? startIndex : len) : 0;
    const result = eles.substr(_startIndex).match(target);
    console.log(result, eles.substr(startIndex), target);
    return result ? result.index + _startIndex : -1;
  }
  throw new Error('第一个参数请传入数组或者字符串');
}
```
