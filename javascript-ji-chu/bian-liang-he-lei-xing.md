# 变量和类型

## 1、javascript规定了几种语言类型

7种。string、number、boolean、null、undefined、object，还有es6的symbol

## 2、javascript对象的底层数据结构是什么

都是从引擎层的 Object 类来的，然后 HeapObject 往下派生

## 3、Symbol在实际开发中的应用？手动实现一个Symbol

消除魔法字符串、模拟类私有属性

```javascript
var root = this;
function Symbol(description) {
  // symbol不能使用new
  if (this instance Symbol) {
    throw new Error('Symbol is not a consturctor');
  }
  var descripStr = description ? description : '';
  // 创建一个纯对象
  var symbol = Object.create({
    // 可以进行string转换
    toString: function() {
      return descripStr ? `symbol(${descripStr})` : `symbol`
    }
  });
  Object.defineProperties(symbol, {
    __Description__: {
      value: descripStr,
      writable: false,
      enumerable: false,
      configurable: false
    }
  });

  //每次调用Symbol得到一个新对象，值是唯一的
  return symbol;
}
root.Symbol = Symbol;
```

## 4、JavaScript中的变量在内存中的具体存储形式

js数据类型主要分为基本数据类型和引用数据类型，内存分为栈内存和堆内存。基本数据类型存于栈内存，大小固定，是值存储；而引用类型引用地址存于栈内存，对象存于堆内存中，无序排列，js不允许直接操作堆内存，所以操作对象实际上是对引用地址的操作

## 5、基本类型对应的内置对象，以及他们之间的装箱拆箱操作

number -&gt; Number对象、string -&gt; String对象、boolean -&gt; Boolean对象、nu l l、undefined没有内置对象。装箱就是基本数据类型转换成引用类型的操作；拆箱就是装箱反操作。我们经常会用到一些方法会基本数据类型进行操作，比如说 `字符串切割` ，字符串本身是没有这些方法的，但是可以通过对应的包装对象进行临时操作，用完就销毁，形成包装对象的过程就叫做装箱。拆箱就是通过调用 `valueOf`、`toString` 转换成基本数据类型

## 6、理解值类型和引用类型

值类型就是基本类型，存于栈内存中，有系统自动分配，大小固定，可以直接操作值，性能好；引用类型就是对象，存于堆内存中，引用地址存于栈内存中，无序排列，js不允许直接操作堆内存中对象，通过栈内存中引用指针来改变对象，操作对象一般都是操作指针

## 7、`null`和 `undefined` 的区别

1、null表示对象占位符，什么也没有，而undefined表示未定义

2、数据类型不同

## 8、至少可以说出三种判断 `JavaScript`数据类型的方式，以及他们的优缺点，如何准确的判断数组类型

1、`typeof`。优点：使用方便，简单粗暴；缺点：无法区分 `数组` 和 `Object`

2、`Object.prototype.toString`。优点：准确得出每种数据类型\(判断数组类型最好的方式\)

3、`constructor`。缺点：custructor可以被篡改，有时候不一定准确

4、`instanceof`。缺点：需要准确知道要判断的实例类型

## 9、可能发生隐式类型转换的场景以及转换原则，应如何避免或巧妙应用

场景：1、一元运算符、逻辑运算符、比较运算符、时间对象前加 `+`、if表达式

原则：都是转换为数据类型的原始值，优先调用`valueOf`，如果不是原始值则调用`toString`方法\(date对象除外，直接调用toString\)。

避免：使用比较运算符用`===`、`!==`

巧妙利用：if表达式真/假值转换为true/false

## 10、出现小数精度丢失的原因， `JavaScript`可以存储的最大数字、最大安全数字， `JavaScript`处理大数字的方法、避免精度丢失的方法

因为 Javascript 采用 IEEE 754 双精度版本（64位），并且只要采用 IEEE 754 的语言都有该问题。在计算机中都是用二进制表示十进制的。在表示小数的时候，在转化二进制的时候有些数是不能完整转化的，比如0.3，转化成二进制是一个很长的循环的数，是超过了`JavaScript`能表示的范围的，所以近似等于0.30000000000000004。

用二进制表示 `0.1`;

```javascript
var num1 = 0.1; // 十进制
var num2 = 0.2;
var binaryNum1 = num.toString(2); // 转换为2进制
var binaryNum2 = num.toString(2); // 转换为2进制
console.log(binaryNum1, binaryNum2);
binaryNum1 => 0.0001100110011001100110011001100110011001100110011001101
binaryNum2 => 0.001100110011001100110011001100110011001100110011001101
```

根据国际标准IEEE 754，任意一个二进制浮点数V可以表示成下面的形式：

> v = \(-1\)s  _M_  2E
>
> * \(-1\)s 表示符号位,s=0,是正数；s=1,是负数
> * M 表示有效数字，范围是 `[1,2)`
> * 2E表示指数位

所以binaryNum1、binaryNum2也可以表示为：

```javascript
binaryNum1 = 2^-4 * 1.100110011001100110011001100110011001100110011001101
binaryNum2 = 2^-3 * 1.100110011001100110011001100110011001100110011001101
```

能表示的最大数：253。Number类型统一按浮点数处理，64位存储，整数是按最大54位来算最大最小数的，否则会丧失精度。

能表示的最大安全数：253 - 1。在\(2-53, 253\)范围内需要遵循`one-by-one` 规则，即双精度和整数一对一对应

处理大数字方法：首先将`Number`转换为`String`，再转换为`Array`，将数组length短的用`0`补齐\(补前面\),之后再把相同位数的的数字相加得到一个新数组，再将这个新数组转换为数字

避免精度丢失方法：`parseFloat(num.toFixed(10))`或者使用`big.js`

