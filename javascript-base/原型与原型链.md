# 原型与原型链

## 1、理解原型设计模式以及 `JavaScript`中的原型规则

**原型设计模式**：

原型模式（prototype）是指用原型实例指向创建对象的种类，并且通过拷贝这些原型创建新的对象。

个人理解就是 js 继承的几种方式

* 构造函数模式。通过 new 一个构造函数得到一个对象`obj`，obj 可以访问到构造函数下的定义的方法和属性
* 原型模式。直接将对象 A 的 prototype 赋值给对象 B，可以得到方法和属性共享
* 工厂模式。在函数内创建一个对象，给对象赋予属性及方法再将对象返回

**原型规则**：

* 所有的引用类型\(对象、函数、数组\)，具有对象特征，可以自由扩展属性
* 每个引用类型都有一个隐式原型：`__proto__`，属性值是一个普通对象
* 每个所有函数都有属于自己的`prototype`属性\(显示原型\)，值是一个普通对象
* 构造函数的原型\(prototype\)等于构造函数实例化的对象的`__proto__`
* 当试图得到一个对象的属性/方法时，如果这个对象本身没有这个属性，那么会去它的**proto**（即它的构造函数的 prototype）中去寻找
* 每个构造函数的`prototype`的`constructor`属性默认等于构造函数本身

## 2、instanceof 底层实现原理，手动实现一个 instanceof

原理：instanceof 左边一般是实例化后的对象或者构造函数，右边是构造函数，如果一个对象是某个类型的实例，就是只要右边变量的 prototype 在左边变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例

```javascript
function mockInstancof(leftValue, rightValue) {
  var rightPrototype = rightValue.prototype;
  var leftProto = leftValue.__proto__;
  while (true) {
    if (leftProto === null) {
      return false;
    }
    if (rightPrototype === leftProto) {
      return true;
    }
    leftProto = leftProto.__proto__;
  }
}
```

## 3、继承的几种方式以及优缺点

```javascript
function Parent() {
  this.name = 'Inigo';
  this.sex = 'male';
}
Parent.prototype.getName = function() {
  return this.name;
};
```

1、原型链继承 \*\*原理\*\*：通过将父类的实例赋值给子类的\`prototype\` \`\`\`javascript function Children\(\) {} Children.prototype = new Parent\(\); Parent.prototype.age = 24; var instanceC = new Children\(\); console.log\(instanceC.name\); // Inigo console.log\(instanceC.age\); // 24 \`\`\` \*\*优点\*\*： - 实例是父类的实例，也是子类的实例 - 实现简单 - 父类新增原型方法/原型属性，子类都能访问到 \*\*缺点\*\*： - 无法实现多继承 - 来自原型对象的所有属性被所有实例共享，一个属性被修改，所有实例的属性都修改 - 创建子类实例时，无法向父类构造函数传参 - 如果要为子类添加属性和方法，需要放置在子类\`prototype\`的赋值之后，在之前的话会被父类实例覆盖

2、构造函数继承\(call\) \*\*原理\*\*：在子类构造函数执行父类构造函数用 call 改变 this 指针 \`\`\`javascript function Children\(\) { Parent.call\(this\); } var instanceC = new Children\(\); console.log\(instanceC.sex\); // male console.log\(instanceC.getName\); // undefined console.log\(instanceC instanceof Parent\); // false console.log\(instanceC instanceof Children\); // true \`\`\` \*\*优点\*\*： - 可以 call 多个父类来实现多继承 - 可以向父类构造函数传递参数 - 子类新增的属性/方法是子类的，与父类无关，各个实例之间不会共享引用属性/方法 \*\*缺点\*\*： - 只能实现父类的属性/方法继承，\`prototype\` 上的无法继承 - 实例是子类的实例，与父类无关 - 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

3、拷贝继承 \*\*原理\*\*：通过遍历将父类的属性/方法赋值给子类 \`\`\`javascript function Children\(\) { this.name = 'zhaojuntong'; } var instanceC = new Children\(\); var instanceP = new Parent\(\); for \(var p in instanceP\) { Children.prototype\[p\] = instanceofP\[p\]; } console.log\(instanceC.name\); // zhaojuntong console.log\(instanceC.getName\(\)\); // zhaojuntong \`\`\` \*\*优点\*\*： - 可以实现多继承 \*\*缺点\*\*： - 因为要拷贝父类的属性/方法，效率较低，内存占用高 - 不可枚举属性无法获取

4、实例继承 \*\*原理\*\*： \`\`\`javascript function Children\(age\) { var instance = new Parent\(\); instance.age = age \|\| '24'; return instance; } var instanceC = new Children\('twenty four'\); console.log\(instanceC.age\); // twenty four console.log\(instanceC.getName\(\)\); // Inigo \`\`\` \*\*优点\*\*： - 不管是通过 new 还是直接调用都具有相同效果 \*\*缺点\*\*： - 实例是父类的实例，与子类无关 - 不支持多继承

5、组合继承 \*\*原理\*\*：原型继承和构造函数继承的结合体，构造函数弥补了原型继承的一些缺点 \`\`\`javascript function Children\(\) { Parent.call\(this\); } Children.prototype = new Parent\(\); var instanceofC = new Children\(\); var instanceofP = new Parent\(\); instanceofC.fn.push\(function getAge\(\) {}\); console.log\(instanceC.sex\); // male console.log\(instanceC.getName\(\)\); // Inigo console.log\(instanceC instanceof Parent\); // true console.log\(instanceofP.fn\); // \[\]; 子类修改没有触发到父类，不存在引用属性共享 \`\`\` \*\*优点\*\*： - 实例是子类和父类的实例 - 可以传递参数给父类 - 多继承 - 不存在引用属性共享，子类可以随意修改 - 函数可复用 - 父类及 prototype 上的属性/方法都可以继承 \*\*缺点\*\*： - 父类构造函数调用 2 次

6、组合寄生式继承 \*\*原理\*\*：通过创建一个新的构造函数，将父类的 prototype 赋值给新构造函数，新构造函数实例化赋值给子类。这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点 \`\`\`javascript function Children\(\) { Parent.call\(this\); } function Super\(\) {} Super.prototype = Parent.prototype; Children.prototype = new Super\(\); var instanceC = new Children\(\); console.log\(instanceC.sex\); // male console.log\(instanceC.getName\(\)\); // Inigo console.log\(instanceC instanceof Parent\); // true console.log\(instanceC instanceof Children\); // true \`\`\` \*\*优点\*\*： - 弥补了上面几种方式的所有缺点，算是完美 \*\*缺点\*\*： - 实现较复杂，实际业务中结合这种模式需要足够多的思考

## 4、至少说出一种开源项目\(如 `Node`\)中应用原型继承的案例

React组件

。。目前没看过什么源码，无法说出原理

## 5、描述 `new`一个对象的详细过程，手动实现一个 `new`操作符

1、创建一个实例对象

2、`this`指向新构造的实例对象

3、执行构造函数中的代码

4、默认返回该对象

分析：

1、首先需要通过构造函数实例化一个对象，所以需要一个构造函数

2、this指向新的实例对象，所有需要`call`、`apply` 来改变指针

3、执行构造函数中代码，`call`、`apply`已经执行过了

4、返回新的对象

```javascript
function newOperator() {
  var _constructor = [].shift.call(arguments); // 得到构造函数
  var args = [].slice.call(arguments); // 将类数组变成数组，这里是除去构造函数之后的参数
  // 创建对象并将__proto__与构造函数prototype联系起来
  // 方式1:
  var obj = Object.create(_constructor.prototype); // 使用指定的原型对象及其属性去创建一个新的对象
  // 方式2:
  // var obj = new Object(); // 或者Object.create({});
  // obj.__proto__ = _constructor.prototype; // 构造函数prototype指向对象__proto__
  var returnValue = _constructor.apply(obj, args); // 改变this指针

  if (typeof returnValue === 'object' && returnValue !== null) { // 如果构造函数有返回值且是对象时用返回值
    return returnValue;
  }
  return obj;
}

function Car(brand) {
  this.brand = brand || 'Bentley';
  this.price = '¥200W';
};
Car.prototype.getPrice = function() {
  return this.price;
};

var car = newOperator(Car, 'Porsche');
console.log(car.brand); // Porsche
console.log(car.getPrice()); // ¥200W
```

## 6、理解 `es6 class`构造以及继承的底层实现原理

就是构造函数，与函数式不同的是，所有的原型属性/防范，类的属性/方法都可以放在花括号之间，方便统一管理，带箭头函数的就是类的属性/方法，es5写法就是挂载在原型上的；参数可以通过constructor属性访问，还可以通过static显示设定静态类型。通过babel将class编译可以看出来底层依然是构造函数。

es6代码：

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
```

编译后的es5:

```javascript
"use strict";

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
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

var Parent =
  /*#__PURE__*/
  (function() {
    function Parent(name) {
      _classCallCheck(this, Parent);

      this.name = name;
    }

    _createClass(Parent, [
      {
        key: "getName",
        value: function getName() {
          return this.name;
        }
      }
    ]);

    return Parent;
  })();
```

可以看出 `Parent` 就是一个构造函数，

step1: 调用`_classCallCheck`检验当前实例对象是否是构造函数实例，不是则抛出错误。实际上通过`instanceof`和`Symbol.hasInstance` 判断

Step2: 调用 `_createClass`，将构造函数和class下的方法装进数组传入，通过遍历用`Object.defineProperty`将方法绑定到构造函数的`prototype`上, **这里绑定到原型上还是实例上需要看是否使用箭头函数，末尾会解释**

**继承原理**：

es6:

```javascript
class Children extends Parent{
  constructor(name) {
    super();
    this.name = name || 'children';
  }
}
```

编译后es5:

```javascript
"use strict";

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  // 父类的prorotype赋值给子类的prototype
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  // Object.setPrototypeOf修改对象的__proto__，使父类和子类能够在同一原型链上
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  // Object.setPrototypeOf是es6的提案，如果不支持就使用自定义的方法，用传统修改__proto__的方式
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

var Children =
  /*#__PURE__*/
  (function(_Parent) {
    // 继承父类的prototype
    _inherits(Children, _Parent);

    function Children(name) {
      var _this;

      _classCallCheck(this, Children);

      _this.name = name || "children";
      return _possibleConstructorReturn(_this);
    }

    return Children;
  })(Parent);
```

可以看出class的继承本质上也是原型链继承 **ps**: 继承的编译代码只是子类的，父类在上面，跑的时候，父类代码也要用上

**注意：** 需要关注下在class中使用箭头函数的场景

```javascript
class Greet {
  sayHello = () => {
    console.log('Hi! Inigo')
  }
}

class Hello extends Greet {
  sayHello() {
    console.log('Hi! Juntong')
  }
}

const greeting = new Hello();
greeting.sayHello();
```

猜测一下打印的是什么？

答案是：**Hi！Inigo**

接下来我们改造一下

```javascript
class Greet {
  // 这里将箭头函数改为es5函数
  sayHello() {
    console.log('Hi! Inigo')
  }
}

const greeting = new Hello();
greeting.sayHello();
```

再次打印结果是：**Hi！Juntong**

为什么会有这样的原因呢？

因为使用箭头函数是挂载在实例下的，而es5函数是挂载在`prorotype`下的。看编译后的代码，可以看出，箭头函数的是通过`Object.defineProperty`直接挂载在实例下的，由原型链可以得知，会优先调用实例下的函数。具体的可以通过在线编译器编译查看编译后代码。

所以`class`中使用箭头函数，有可能无法重写父类函数。

