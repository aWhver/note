# ios端不支持正则后行断言

在代码中使用了后行断言捕获信息，在开发者工具和安卓机器上正常，编译也能通过，但是在ios上打开小程序白屏。因为后行断言属于`es7`的提案，ios微信浏览器还不支持

```javascript
const appidRag = /(?<=wxtp\;\/\/)[\d\w]+/;
```

**?&lt;=**在iOS上会引起异常

