#### ios10不支持calc计算属性

用flex代替，需要注意的是，对于嵌套的flex，如果最里层也需要撑开的话，包裹的每一层都必须要传递`flex`。</br>

由于ios10（iphone se）不支持 `calc` 计算属性。使用下面的方式无法在该机型下展现 `ir-pull-loading-container` 的子元素，此时的高度为0。用flex代替的话，需要每一层(直到 `customer-visit-page`)都使用 `transition` 类名来传递 `flex`, 才能使 `ir-pull-loading-container` 铺满，中间隔了一层都不行

```html
  <div class="header" />
  <div class="transition">
    <div class="transition user-profile-content visit">
      <div class="customer-visit-page">
        <div class="date-range-picker pick-date">子元素，高度确定</div>
        <div class="transition ir-pull-loading-container">
          需要自动撑开的子元素
        </div>
      </div>
    </div>
  </div>
```

```css
.transition {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.ir-pull-loading-container {
  overflow: hidden;
}
.user-profile-content {
  height: 100%;
}
.customer-visit-page {
  height: calc(100% - 80px);
}
```