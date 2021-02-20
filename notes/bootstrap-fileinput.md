# Bootstrap-fileinput

> [bootstrap-fileinput](https://github.com/kartik-v/bootstrap-fileinput): An enhanced HTML 5 file input for Bootstrap 4.x./3.x with file preview, multiple selection, and more features.

## 用法

按如下路径引用资源

```html
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.1.4/css/fileinput.min.css" rel="stylesheet"/>

<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.1.4/js/fileinput.min.js"></script>

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

<!-- 多语言 -->
<!-- (1) 加载所需的语言 js 文件（例如俄语加载 js/locales/ru.js）-->
<!-- 这些必须在 fileinput.js 之后加载 -->
<!-- (2) 将插件中的语言属性设置为你需要的语言（例如 langage:'ru'）-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.1.4/js/locales/(lang).js"></script>
```

初始化插件

```js
// initialize with defaults
$("#input-id").fileinput();

// with plugin options
$("#input-id").fileinput({ showUpload: false, previewFileType: "any" });
```
