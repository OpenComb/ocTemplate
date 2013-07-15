ocTemplate 是一个为“面向二次发开项目”而设计的 Node.js 模板引擎。

ocTemplate 允许开发者使用 jQuery 处理模板结构，除此以外 ocTemplate 和其他的模板引擎没有太大的区别。
例如你正在开发一个blog程序而且采用了 ocTemplate 做为模板引擎，当有人基于你的blog程序进行二次开发时（他们使用你的blog程序，但是想改些地方），
可以不必修改你的模板源代码，而是在ocTemplate渲染一个模板前加载这个模板，用 jQuery 修改模板上的内容，就像在浏览器里操作网页元素一样。
这些操作都在后端 Nodejs 里实现。

> 你可以在模板上使用这些jQuery函数来控制模板的内容和结构：$.fn.append()/prepend()/after()/before()/attr()/addClass()/removeClass() ... ...

在二次开发时避免修改原来程序的源代码，有两个好处：

* 原来程序在发布新版本时，不会出现源代码冲突。

* “补丁”代码可以作为独立的项目分发。


ocTemplate 依赖jsdom，并且对 jsdom 做了修改，解除了 jsdom 对 contextify C++ 的依赖，使 ocTemplate 能够在纯JavaScript环境中工作。

ocTemplate 没有像 jade 那样简化 html 语法，jade的模板语法简洁、干静，没有多余的字符，非常适合“敏捷”开发，但是无法和 jQuery 兼容。所以 ocTemplate 仍然保持完整的 html 语法。





# 快速开始

```
npm install octemplate
```

hello.js :
```javascript
var tplCache = require("octemplate") ;

tplCache.template(__dirname+"/templates/hello.html",function(err,tpl){

	tpl.render(
	
		// data model
		{
			foo: 'bar'
		}
		
		// render callback
		, function(err,buff){
			console.log(''+buff) ;
		}
	) ;
}) ;
```

templates/hello.html :
```html

<div>
	hello, world.
</div>

<div>
	Value of the variable foo is: {@foo}
</div>

```


# 表达式

模板表达式的基本形式是：`{@ expression }`，它可以用于文本和标签属性中。

```html
<div>
	Value of the variable foo is: {@foo}
</div>
```

### 在标签中使用模板表达式：

```html
<div {@foo}="123"></div>
```

渲染后的结果是：
```html
<div bar="123"></div>
```

### 在标签的属性值中使用模板表达式：

```html
<div foo="value of variable foo is: {@bar}"></div>
```

### 作为标签的属性值：

```html
<div foo="@bar"></div>
```
所有以`@`开头的属性值，将被视做一个表达式，计算后的结果以字符串的形式输出。

> 注意：有些模板标签的属性必须是表达式才有意义，漏掉`@`模板引擎不会报告错误，但逻辑并不正确，这是一个常见的新手错误。例如：

```html
<if condition="foo">Variable foo is avalid.</if>
```
这是错误的，condition 会收到一个字符串：`"foo"` 而不是变量 `foo`，因此判断总是为 true 。

```html
<!-- 不能漏掉那个 @ -->
<if condition="@foo">Variable foo is avalid.</if>
```

### 多行表达式

ocTemplate 仅支持单行表达式，如果提供多行表达式，只会执行第一行并返回其结果。

```html
result of expression: {@ var i=123; return i } .
```

渲染结果：
```html
result of expression: undefined .
```

这不是预期的效果。这种情况下，可以使用匿名函数来包装多行表达式：

```html
result of expression: {@ (function(){ var i=123; return i ;})() } .
```

渲染结果：
```html
result of expression: 123 .
```

用 `(function(){ ... })()` 模式将多行表达式包装起来即可。
	
	
### $model

预置变量`$model`是模板中所有变量的名称空间。

`{@foo}` 和 `{@$model.foo}` 在`foo`变量存在时，效果相同；如果`foo`变量不存在，则`{@foo}`抛出异常（会打断后文的模板内容渲染），`{@$model.foo}`则输出 `"undefined"` 。

因此`$model.foo`适合用于不确定是否存在的变量，它的效果类似于：

```javascript
{@ typeof foo!='undefined'? foo: undefined}
```
	
---
	
# 标签

## &lt;if&gt;

属性：

* [必须] `condition`: 条件表达式

example：

```html
<if condition="@foo=='bar'">
	{@foo}
</if>
```

> 注意：不要漏掉 condition 属性里的 `@`，否则会被当作一个字符串，那多半不是你想要的效果。

## &lt;foreach&gt;

属性：

* [必须] `for`: 循环目标对象表达式，表达式返回的结果可以是 Object 或 Array 。

* [可选] `var`: 迭代变量名称，创建对应变量保存每一轮迭代出来的值。

	`var`需要的是一个字符串作为变量名称，如果提供表达式，则表达式的结果会被转换成字符串传递给`var`(这可能不是你想要的)。
	
* [可选] `key`: 迭代键或下标变量名称。

	提供给`for`属性的如果是一个 Object，则`key`对应名称的变量中存入的是Object的属性名；如果提供Array类型给`for`，则为数组下标。
	
example：

```html
<foreach for="@foo" key="key" var="item">
	attribute {@key} of variable foo is: {@item}
</foreach>
```

> 注意：只有for属性是一个表达式（`@`开头），`key` 和 `var` 只是简单是字符型属性值，它们作为变量名称

# &lt;loop&gt;

这是一个简化的 for 循环。

> &lt;loop&gt; 仅支持针对整数的迭代

属性：

* [必须] `end`: 循环结束数值（包含`end`值）。

* [可选] `start`: 循环开始数值。默认为:1。

* [可选] `step`: 循环步长。默认为:1。

* [可选] `var`: 迭代变量名称，创建对应变量保存每一轮迭代出来的值。

这些属性可以是普通属性值或表达式，无论什么类型都会被转换成整数。

example：

foo = 7
```html
<loop end="@foo" step="2" start="2" var="value">
	{@ value}
</loop>
```

结果：
```
	2
	4
	6
```


## &lt;elseif&gt;

在所有流程控制标签中提供 else if 效果；支持： &lt;if&gt;, &lt;loop&gt;, &lt;foreach&gt; 等

属性：

* [必须] `condition`， 参看 &lt;if&gt; 同名属性

## &lt;else&gt;

在所有流程控制标签中提供 else 效果；支持： &lt;if&gt;, &lt;loop&gt;, &lt;foreach&gt; 等

无属性

## &lt;continue&gt;

在所有流程控制标签中提供 continue 效果；支持： &lt;if&gt;, &lt;loop&gt;, &lt;foreach&gt; 等

无属性

## &lt;break&gt;

在所有流程控制标签中提供 break 效果；支持： &lt;if&gt;, &lt;loop&gt;, &lt;foreach&gt; 等

无属性

## &lt;include&gt;

引用另一个模板。

属性：

* [必须] `file`: 引用模板的文件路径，可以是表达式或普通文本属性。

	路径查找规则和 Nodejs 相同；如果提供给file的是一个相对路径，则相对当前模板的位置。

* [可选] `model`: 传递给被引用模板的变量模型。
	
	如果希望将当前模板的所有变量都传给被应用模板，可以这样：`model="@$model"`。`$model`是当前模板的名称空间。

---

# $helper

某些较复杂的逻辑或表达式不适合出现在模板，我们将他们封装到了 $helper 对象中。

`$helper` 是一个对象，该对象提供了一组状态无关的方法，用来简化模板表达式的逻辑，预置了下列方法：

* addslashes(text)
	
	为 `\`,`"`,`'` 以及 0字节 添加转义斜线。
	
* eq (lft,rgt)

	如果 lft 和 rgt 相等(==)，返回true，否则返回false。

* gt (lft,rgt)

	如果 lft 大于 rgt(&gt;)，返回true，否则返回false。
	
* lt (lft,rgt)

	如果 lft 小于 rgt(&lt;)，返回true，否则返回false。
	
* ge (lft,rgt)
	
	如果 lft 大于等于(&gt;=) rgt，返回true，否则返回false。
	
* le (lft,rgt)
	
	如果 lft 小于等于(&lt;=) rgt，返回true，否则返回false。

> 比较运算符中的 `&lt;` 和 `&gt;` 与模板中的标签边界符号相冲突，所以必须使用 $helper 中的比较方法(compare methods)。

example:

```html
<if condition="@ $helper.gl(foo,bar)">
	variable foo is greater then variable bar .
<else>
	variable foo is not greater then variable bar .
</if>
```
---

# 后端 jQuery 操作

以上都是内容和其他模板引擎没有太大区别，接下来才是 ocTemplate 的重点。

ocTemplate 支持 jQuery, 每一个模板对象都可以被当作一个独立的 browser 环境，jQuery可以在模板对象(template)内运行，其行为和在浏览器里完全一致。

```javascript
var tplCache = require("octemplate") ;

// 加载 template
tplCache(__dirname+"/templates/hello.html",function(err,tpl){

	// 处理模板加载错误 err
	// todo ...

	// 在导航菜单中加入一个菜单项
	tpl.$("ul.navMenu").append("<li><a href='javascript:alert(\"hello world.\")'>hello</a></li>") ;

	// 重新编译模板
	tpl.compile() ;
}) ;
```

也可以在向模板中添加流程控制标签和表达式 (Cool!)：

```javascript

	// ...

	// 在导航菜单中加入一个菜单项
	// (使用 <if> 判断是否存在变量 username，并将 username 里的值输出到 alert 里 )
	tpl.$("ul.navMenu").append(
		"<if condition='@$model.username'>"
			+ "<li>"
				"<a href='javascript:alert(\"hello, {@$model.username}\"+)'>hello</a>"
			+ "</li>
		+ "</if>"
	) ;
	
	// ...
```

在 ocTemplate 的模板中执行事件相关的jQuery操作没有意义：有些事件可能不会触发，即使触发也不会发生在浏览器里，与用户交互无关。

一个错误的例子：
```javascript

	tpl.$("ul li a.login").click(function(){
		// 永远不会触发的事件
		alert("you want login?") ;
	}) ;

```

上面的用法实际上是混淆的前端和后端的区别，ocTempate 对jQuery 的支持，仅仅用于控制模板文件里的内容，不直接支持网页的前端行为。
