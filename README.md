ocTemplate 是一个为“面向二次发开项目”而设计的 Node.js 模板引擎。

ocTemplate 允许开发者使用 jQuery 处理模板结构，除此以外 ocTemplate 和其他的模板引擎没有太大的区别。
例如你正在开发一个blog程序而且采用了 ocTemplate 做为模板引擎，当有人基于你的blog程序进行二次开发时（他们使用你的blog程序，但是想改些地方），
可以不必修改你的模板源代码，而是在ocTemplate渲染一个模板前加载这个模板，用 jQuery 修改模板上的内容，就像在浏览器里操作网页元素一样。

> 你可以在模板上使用这些jQuery函数来控制模板的内容和结构：$.fn.append()/prepend()/after()/before()/attr()/addClass()/removeClass() ... ...

在二次开发时避免修改原来程序的源代码，有两个好处：

* 原来程序在发布新版本时，不会出现源代码冲突。

* “补丁”代码可以作为独立的项目分发。


ocTemplate 依赖jsdom，并且对 jsdom 做了修改，接触了 jsdom 对 contextify C++ 的依赖，使 ocTemplate 能够在纯JavaScript环境中工作。

ocTemplate 没有像 jade 那样简化 html 语法，jade的模板语法简洁、干静，没有多余的字符，非常适合“敏捷”开发，但是无法和 jQuery 兼容。所以 ocTemplate 仍然保持完整的 html 语法。
