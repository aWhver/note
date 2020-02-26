#### 基于taroV2.0.4
##### 微信小程序
- 基于同一基础组件嵌套不能超过2层。否则即使使用`addGlobalClass`也无法修改样式。比如定义了一个基础组件 `ButtonBase`，再基于 `ButtonBase` 封装 `Button`, 然后在页面引用 `Button`，传递`className`下去，在当前页面也无法修改`ButtonBase`的样式。在`h5`没有这个问题,因为没有作用域这个问题。
- 基础组件例如`Button`、`Icon`这类,只能从**taro**引入，从其他地方或者自己定义的的文件引入，以这些组件作为导入名时，不会报错，但是热更新，编译结果一直是之前的未使用这些组件名的代码编译的代码。
- `children`是只读的，无法操作，也无法解构。
- 多行溢出省略，必须加上`white-space: pre-wrap`或者 `white-space: normal !important;`。否则无法换行