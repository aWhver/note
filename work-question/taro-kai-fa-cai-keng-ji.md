# taro开发踩坑记

## 基于taroV2.0.4

### 微信小程序

* 基于同一基础组件嵌套不能超过2层。否则即使使用`addGlobalClass`也无法修改样式。比如定义了一个基础组件 `ButtonBase`，再基于 `ButtonBase` 封装 `Button`, 然后在页面引用 `Button`，传递`className`下去，在当前页面也无法修改`ButtonBase`的样式。在`h5`没有这个问题,因为没有作用域这个问题。
* 基础组件例如`Button`、`Icon`这类,只能从**taro**引入，从其他地方或者自己定义的的文件引入，以这些组件作为导入名时，不会报错，但是热更新，编译结果一直是之前的未使用这些组件名的代码编译的代码。
* `children`是只读的，无法操作，也无法解构。
* 多行溢出省略，必须加上`white-space: pre-wrap`或者 `white-space: normal !important;`。否则无法换行。`-webkit-orient-box: vertical` 上面必须加 `/* autoprefixer: off */` ，因为taro编译把它去掉了。[参考链接](https://stackoverflow.com/questions/46152850/webkit-box-orient-styling-disappears-from-styling)
* 1px使用问题。`px`一定要使用**大写**，否则在h5下几乎看不见，在小程序下没问题
* 一个tsx文件只能暴露出一个组件，其余都不能暴露。
* 在class组件中，在render方法外渲染组件，方法必须要用`render`开头

  \`\`\`javascript

class A extends Taro.Component {

// 这里必须用render开头 renderBody\(\) { return  body }

render\(\) { return  头部 {this.renderBody\(\)} } }

```text
- canvas绘制海报canvas单位和canvas坐标转换问题

微信小程序中使用的是`rpx`单位，canvas宽高都是`rpx`单位，但是画布上的坐标点确实以`px`计算的，如果单位没有转换的话，在canvas转换成图片时会出现比例对不上的情况，比如你设置canvas宽为`200rpx`,然后画布坐标设为`200`，这其实已经超出画布了，绘制的图片只是一部分，并不是完整的。

解决方法是：需要通过获取设备像素比(pixelRadio)和设备宽度根据设计稿去动态计算画布上的坐标点。如果海报是确定的尺寸会好一些，通常cnavas和海报尺寸确定，如果海报内容不确定，通常是图片尺寸不一致，首先要通过`getImageInfo`来获取图片width、height来设置canvas大小，还要根据像素比对海报进行缩放避免失帧。
```javascript
  // 这里是部分代码
 /**
   * @description 计算坐标点上的尺寸(px转换rpx)，以设计稿750为准
   *
   * @param {number} size
   * @returns 坐标点 @type {number}
   */
  function calcSize(size: number) {
    const { windowWidth } = getSystemInfoSync();
    // 如果是固定尺寸的海报的话下面的 2 就是pixelRadio，canvas也不用动态计算，直接计算坐标点来适配就好了
    const scale = windowWidth / 2 / 375;
    return scale * size;
  }

  useEffect(() => {
    getImageInfo({ src: propaganda }).then(res => {
      /**
       * 因为宣传图尺寸不固定，所以需要动态计算canvas尺寸
       * canvas上的坐标点都是px，而canvas是rpx，所有都要通过calcSize方法计算换成rpx的尺寸才对得上
       */
      const canvasWidth = 750;
      // 得到图片宽高比
      const imgRadio = res.height / res.width;
      // canvas宽度就是绘制图片宽度
      setCanvasWidth(canvasWidth);
      // canvas高度是图片高度 + 400（绘制标题和小程序码的高度）
      setCanvasHeight(res.height * canvasWidth + 400);
      imgHeight = res.height * canvasWidth;
    });
  }, [propaganda]);

  // 绘制海报
  function drawPoster() {
    ctx.beginPath();
    ctx.setFillStyle("#fff");
    ctx.fillRect(0, 0, calcSize(canvasWidth), calcSize(canvasHeight));
    ctx.drawImage(propaganda, 0, 0, calcSize(canvasWidth), calcSize(imgHeight));
    ctx.closePath();
  }

  render() {
    <Canvas
        canvasId="share"
        style={{ width: pxTransform(canvasWidth), height: pxTransform(canvasHeight) }}
        className="share-canvas"
      />
      // canvas生成的海报地址，这里海报尺寸也要动态计算
      {tempFilePath && (
        <View className="poster-overlay">
          <Image
            className="poster"
            style={{ width: pxTransform(calcSize(canvasWidth)), height: pxTransform(calcSize(canvasHeight)) }}
            src={tempFilePath}
          ></Image>
        </View>
      )}
  }
```

* 静态资源缓存

微信小程序具有很严重的缓存，在开发过程中，用到一些静态资源\(图片/css\),如果静态资源放在服务器上，动过外链引入，我们在开发过程中用了这个资源，但是服务器上还没有，后续上线访问会读取dns的缓存，因为之前是错误的资源，访问过了，后面更新读取到的也是旧的资源，导致资源错误。

* 解决方案：1、删除微信，重新下载
* 解决方案：2、资源加上版本号（可能还需要删除小程序再次进入）
* 登陆授权拒绝返回信息

ios返回 `getPhoneNumber:fail user deny`；android 返回 `getPhoneNumber:fail:user deny`

## 转h5

### 单位表现形式不一样

转微信小程序字体是正常的，但是转h5后rem大小空间过小，会换行\(iphonese机器\)，h5偏大，页面和设计稿有差距

### 自定义bar

* 默认没有隐藏taro自带的tabbar（添加taro-tabbar\_\_tabbar-hide类名）。需要从二级页面返回调用hideBar隐藏tabbar（头部bar也是自定义）

