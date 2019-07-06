
输入并搜索
Home
1.1. 前言
1.2. 1、GitBook简介
1.3. 2、GitBook安装
1.4. 3、GitBook使用
1.5. 4、GitBook常用命令
1.6. 5、MarkDown简介
1.7. 6、MarkDown常用标签
1.8. 7、GitBook个性化配置
本书使用 GitBook 发布
1、GitBook简介
GitBook简介
Modern book format and toolchain using Git and Markdown

这是 gitbook 项目主页上对 gitbook 的定义。

咋一看 GitBook 的名字，你可能会认为它是关于 Git 的一本书。而当你有所了解之后，你也许会认为它是一个使用 Git 构建电子书的工具。其实不然，GitBook 与 Git 的关系，就像雷锋塔和雷锋那样，没有一点关系！

这里写图片描述
实际上，GitBook 是一个基于 Node.js 的命令行工具，支持 Markdown 和 AsciiDoc 两种语法格式，可以输出 HTML、PDF、eBook 等格式的电子书。所以我更喜欢把 GitBook 定义为文档格式转换工具。

所以，GitBook 不是 Markdown 编辑工具，也不是 Git 版本管理工具。市面上我们可以找到很多 Markdown 编辑器，比如 Typora、MacDown、Bear、MarkdownPad、MarkdownX、JetBrains’s IDE（需要安装插件）、Atom、简书、CSDN 以及 GitBook 自家的 GitBook Editor 等等。

这里写图片描述
但 GitBook 又与 Markdown 和 Git 息息相关，因为只有将它们结合起来使用，才能将它们的威力发挥到极致！因此，通常我们会选择合适的 Markdown 编辑工具以获得飞一般的写作体验；使用 GitBook 管理文档，预览、制作电子书；同时通过 Git 管理书籍内容的变更，并将其托管到云端（比如 GitHub、GitLab、码云，或者是自己搭建的 Git 服务器），实现多人协作。

这里写图片描述
因此，写一本书用到的东西有 GitBook + WebStorm + Markdown + Git。

GitBook: 生成电子书的工具。
WebStorm: 编辑器。
Markdown: 一种语言。
Git: 目前最常用的分布式版本控制系统。
本书也是使用 gitbook 生成，所以在看到这里的时候，你应该对 gitbook 的魔力有了初步印象！

GitBook安装
gitbook 的安装像喝水一样简单，详细指南可以参考 gitbook 文档
$ npm install -g gitbook-cli

检查是否安装成功
$ gitbook -V

需要注意的是：首先需要安装 nodejs ， 以便能够使用 npm 来安装 gitbook。


GitBook使用
gitbook 的基本用法非常简单，基本上就只有两步：

使用 gitbook init 初始化书籍目录
使用 gitbook serve 编译书籍
下面将结合一个非常简单的实例，来介绍 gitbook 的基本用法。

gitbook init
在根目录下执行gitbook init命令会生成README.md和SUMMARY.md2个文件

这里写图片描述
README.md 和 SUMMARY.md 是两个必须文件

README.md 是对书籍的简单介绍：

这里写图片描述
SUMMARY.md 是书籍的目录结构：

这里写图片描述
gitbook serve
书籍目录结构创建完成以后，就可以使用 gitbook serve 来编译和预览书籍了：

  D:\waterElephant\data\share\gitbook>gitbook serve
  Live reload server started on port: 35729
  Press CTRL+C to quit ...

  info: 7 plugins are installed
  info: loading plugin "livereload"... OK
  info: loading plugin "highlight"... OK
  info: loading plugin "search"... OK
  info: loading plugin "lunr"... OK
  info: loading plugin "sharing"... OK
  info: loading plugin "fontsettings"... OK
  info: loading plugin "theme-default"... OK
  info: found 4 pages
  info: found 17 asset files
  info: >> generation finished with success in 3.1s !

  Starting server ...
  Serving book on http://localhost:4000
从上面执行结果可以看出，gitbook启动的web 服务默认监听4000端口，而重启监控进程默认监听35729端口

浏览器访问http://localhost:4000

这里写图片描述
如果同一台机器需要启动多个gitbook服务，可以修改对应的web 服务监听端口和监控进程的端口

  D:\waterElephant\data\share\gitbook>gitbook --lrport 35730 --port 4001 serve
  Live reload server started on port: 35730
  Press CTRL+C to quit ...

  info: 7 plugins are installed
  info: loading plugin "livereload"... OK
  info: loading plugin "highlight"... OK
  info: loading plugin "search"... OK
  info: loading plugin "lunr"... OK
  info: loading plugin "sharing"... OK
  info: loading plugin "fontsettings"... OK
  info: loading plugin "theme-default"... OK
  info: found 4 pages
  info: found 18 asset files
  info: >> generation finished with success in 2.8s !

  Starting server ...
  Serving book on http://localhost:4001
浏览器访问http://localhost:4001

这里写图片描述
GitBook常用命令
直接看gitbook help

  D:\waterElephant\data\share\gitbook>gitbook help
  build [book] [output]       build a book
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --format                Format to build to (Default is website; Values are website, json, ebook)
      --[no-]timing           Print timing debug information (Default is false)
      --通过gitbook build命令可以对当前书籍进行编辑，也就是生成对应的HTML文件，会放在_book目录下面

  serve [book] [output]       serve the book as a website for testing
      --port                  Port for server to listen on (Default is 4000)
      --lrport                Port for livereload server to listen on (Default is 35729)
      --[no-]watch            Enable file watcher and live reloading (Default is true)
      --[no-]live             Enable live reloading (Default is true)
      --[no-]open             Enable opening book in browser (Default is false)
      --browser               Specify browser for opening book (Default is )
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --format                Format to build to (Default is website; Values are website, json, ebook)
      --启动gitbook服务，会自动先执行gitbook build

  install [book]              install all plugins dependencies
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --安装所有插件依赖项

  parse [book]                parse and print debug information about a book
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --解析并打印有关书籍的调试信息

  init [book]                 setup and create files for chapters
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --通过gitbook init来初始化一本书，会自动建立一个readme.md和summary.md文件

  pdf [book] [output]         build a book into an ebook file
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --把电子书转化成pdf格式

  epub [book] [output]        build a book into an ebook file
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --把电子书转化成epub格式

  mobi [book] [output]        build a book into an ebook file
      --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
      --把电子书转化成mobi格式
导出pdf遇到的问题
    D:\waterElephant\data\share\gitbook>gitbook pdf
    info: 7 plugins are installed
    info: 6 explicitly listed
    info: loading plugin "highlight"... OK
    info: loading plugin "search"... OK
    info: loading plugin "lunr"... OK
    info: loading plugin "sharing"... OK
    info: loading plugin "fontsettings"... OK
    info: loading plugin "theme-default"... OK
    info: found 6 pages
    info: found 20 asset files

    EbookError: Error during ebook generation: 'ebook-convert'
错误提示：ebook-convert不是内部或外部命令，原因是GitBook在生成PDF的过程中使用到calibre的转换功能，没有安装calibre或安装了calibre没有配置环境变量都会导致转换PDF失败

calibre下载地址https://calibre-ebook.com/download_windows64
配置环境变量(配置环境变量之后要重启)

https://blog.csdn.net/zl1zl2zl3/article/details/71123902
然后就可以通过gitbook pdf转换电子书了
    C:\Users\admin\Desktop\gitbook>gitbook pdf
    info: 7 plugins are installed
    info: 6 explicitly listed
    info: loading plugin "highlight"... OK
    info: loading plugin "search"... OK
    info: loading plugin "lunr"... OK
    info: loading plugin "sharing"... OK
    info: loading plugin "fontsettings"... OK
    info: loading plugin "theme-default"... OK
    info: found 6 pages
    info: found 20 asset files
    info: >> generation finished with success in 7.7s !
    info: >> 1 file(s) generated

    C:\Users\admin\Desktop\gitbook>gitbook epub
    info: 7 plugins are installed
    info: 6 explicitly listed
    info: loading plugin "highlight"... OK
    info: loading plugin "search"... OK
    info: loading plugin "lunr"... OK
    info: loading plugin "sharing"... OK
    info: loading plugin "fontsettings"... OK
    info: loading plugin "theme-default"... OK
    info: found 6 pages
    info: found 21 asset files
    info: >> generation finished with success in 16.2s !
    info: >> 1 file(s) generated

    C:\Users\admin\Desktop\gitbook>gitbook mobi
    info: 7 plugins are installed
    info: 6 explicitly listed
    info: loading plugin "highlight"... OK
    info: loading plugin "search"... OK
    info: loading plugin "lunr"... OK
    info: loading plugin "sharing"... OK
    info: loading plugin "fontsettings"... OK
    info: loading plugin "theme-default"... OK
    info: found 6 pages
    info: found 22 asset files
    info: >> generation finished with success in 22.3s !
    info: >> 1 file(s) generated
更多的常用命令可参考http://www.imooc.com/article/284494?block_id=tuijian_wz


MarkDown简介
这是 Daring Fireball 创始人 John Gruber 关于 Markdown 的设计初衷的阐述：
Markdown is not a replacement for HTML, or even close to it. Its syntax is very small, 
corresponding only to a very small subset of HTML tags. The idea is not to create a syntax 
that makes it easier to insert HTML tags. In my opinion, HTML tags are already easy to insert. 
The idea for Markdown is to make it easy to read, write, and edit prose.HTML is a publishing 
format; Markdown is a writing format. Thus, Markdown’s formatting syntax only addresses 
issues that can be conveyed inplain text.

For any markup that is not covered by Markdown’s syntax, you simply use HTML itself. There’s 
no need to preface it or delimit it to indicate that you’re switching from Markdown to HTML; 
you just use the tags.

The only restrictions are that block-level HTML elements — e.g. <div>, <table>, <pre>, <p>, 
etc. —must be separated from surrounding content by blank lines, and the start and end tags 
of the block should not be indented withtabs or spaces. Markdown is smart enough not to add 
extra (unwanted) <p> tags around HTML block-level tags.
翻译：
Markdown并不是HTML的替代品，甚至跟HTML很像。它的语法非常简单，只对应于非常小的HTML标记子集。其目的不是
创建一种更容易插入HTML标记的语法。在我看来，HTML标签已经很容易插入了。markdown的思想是使阅读、编写和编
辑散文变得容易。html是一种发布格式；markdown是一种书写格式。因此，Markdown的格式化语法只处理可以在纯文
本中传递的问题。

对于Markdown语法中没有涉及的任何标记，您只需使用HTML本身。不需要在它的前面加上前缀或分隔符来表示您正在
从markdown切换到html；您只需要使用标记。

唯一的限制是块级HTML元素（例如<div>、<table>、<pre>、<p>等）必须用空行与周围内容分隔，并且块的开始和结
束标记不应使用制表符或空格缩进。markdown足够聪明，不会在HTML块级标记周围添加额外（不需要的）标记。
举几个例子：

HTML 注释(Markdown也支持)：
  <!--鬼刀一开看不见-->
HTML 超链接：跳进黄浦江

 <a href="https://baike.baidu.com/item/%E9%BB%84%E6%B5%A6%E6%B1%9F/80117?fr=aladdin">跳进黄浦江</a>
Markdown 超链接3种写法之Inline超链：跳进黄浦江

 [跳进黄浦江](https://baike.baidu.com/item/%E9%BB%84%E6%B5%A6%E6%B1%9F/80117?fr=aladdin)
Markdown 超链接3种写法之Reference超链：跳进黄浦江

 [跳进黄浦江][imagehh][imagehh]: https://baike.baidu.com/item/%E9%BB%84%E6%B5%A6%E6%B1%9F/80117?fr=aladdin
Markdown 超链接3种写法之自动超链：https://baike.baidu.com/item/%E9%BB%84%E6%B5%A6%E6%B1%9F/80117?fr=aladdin

 <https://baike.baidu.com/item/%E9%BB%84%E6%B5%A6%E6%B1%9F/80117?fr=aladdin>
 MarkDown常用标签
以下所有内容分为2行，第一行表示展示的效果，第二行是代码(这是样式)

<span style="color:red;">以下所有内容分为2行，第一行表示展示的效果，第二行是代码(这是代码)
这是最大的一级标题(样式)
# 这是最大的一级标题(代码)
稍微小一点的标题(样式)
## 稍微小一点的标题(代码)
再小一点的标题(样式)
### 再小一点的标题(代码)
越来越小的标题(样式)
#### 越来越小的标题(代码)
更小的标题(样式)
##### 更小的标题(代码)
最小的标题(样式)
###### 最小的标题(代码)
# 耍流氓的标题不是标题，最多6个#(样式)
####### 耍流氓的标题不是标题，最多6个#(代码)
左边一个点 重点关注 右边一个点(样式)

左边一个点 `重点关注` 右边一个点(代码)这个表示引用一段文字
带链接的一级标题，我要跳到百度去(样式)
# [带链接的一级标题，我要跳到百度去](https://www.baidu.com)(代码)
空链接的三级标题，哪都不去，就是喜欢蓝色标题(样式)
### [空链接的三级标题，哪都不去，就是喜欢蓝色标题](#)(代码)
一个普通的链接，跳到测试环境(样式)

[一个普通的链接，跳到测试环境](http://47.100.207.117:18091/#/dashboard)(代码)
章节跳转，相对路径(样式)

[章节跳转，相对路径](../Chapter1/README.md)(代码)
锚点用法(样式)

[锚点用法](#jump)(代码)
跳回来(样式)

<span id="comeback">跳回来(代码)
这句话以一个实心圆点开头(加号/减号/星号后面有个空格)(样式)
这句话以一个空心圆点开头(回车接+号再加个空格)(样式)
这句话以实心小正方形开头(2个回车接+号再加个空格)(样式)
下面是几种横线的写法(3个横杠，3条下划线，3个星号)
---(代码)
___(代码)
***(代码)
这是加粗的文本(样式)

**这是加粗的文本**(代码)
另一种加粗的文本(样式)

__另一种加粗的文本__(代码)
这是斜体文本(2颗心离得太远，就会变得不正经)(样式)

*这是斜体文本(2颗心离得太远，就会变得不正经)*(代码)
另一种斜体/不正经的文本(样式)

_另一种斜体/不正经的文本_(代码)
这个表示引用一段文字，常用语引用代码或者命令(一个大于符号'>'开头)

可以嵌套使用
D:\waterElephant\data\share\gitbook>gitbook serve
Live reload server started on port: 35729
Press CTRL+C to quit ...
info: 7 plugins are installed
info: loading plugin "livereload"... OK
info: loading plugin "highlight"... OK
info: loading plugin "search"... OK
info: found 6 pages
info: found 20 asset files
info: >> generation finished with success in 3.3s !

带序号的内容(样式)

什么数字开头不重要(样式)
全部写1都行(样式)
自动递增(样式)

1. 带序号的内容(代码)
    33. 什么数字开头不重要(代码)
    22. 全部写1都行(代码)
    65. 自动递增(代码)
这是一段缩进码(前面一个回车)(代码)
常用语代码引用(代码)
或者命令执行过程(代码)
console.info("条形码“围栏”");
var foo = function (bar) {
  return bar++;
};
表格标题(样式)	我也是表格标题(样式)
第一行	列与列之间用竖线隔开，注意每行的列数要一致
第二行	标题下有一行内容为横杠的数据，最少3个横杠，无上限
第三行	天苍苍野茫茫，风吹草低建兰祥
| 表格标题(代码) | 我也是表格标题(代码) |
| --- | -------------------------------------------- |
| 第一行 | 列与列之间用竖线隔开，注意每行的列数要一致 |
| 第二行 | 标题下有一行内容为横杠的数据，最少3个横杠，无上限 |
| 第三行 | 天苍苍野茫茫，风吹草低建兰祥 |
表格标题(样式)	我也是表格标题(样式)
第一行	这个表格的内容右对齐
第二行	在第二行的横杠后面加一个冒号
| 表格标题(代码) | 我也是表格标题(代码) |
| ------:| -----------:|
| 第一行   | 这个表格的内容右对齐 |
| 第二行 | 在第二行的横杠后面加一个冒号 |  
图片描述

![图片描述](https://octodex.github.com/images/stormtroopocat.jpg "图片悬浮提示文字")(代码)
图片变小居中
<div align=center><div style="width:200px;">![图片变小居中](https://octodex.github.com/images/stormtroopocat.jpg "图片悬浮提示文字")
图片另一种写法

![图片另一种写法][image1](image1是一个变量)(代码)
[image1]: https://octodex.github.com/images/dojocat.jpg  "这是一个变量"(代码) 
跳转到这里(样式)

<span id = "jump">跳转到这里(代码)    
跳回去(超链接形式的锚点)(样式)

<a href="#comeback">跳回去(超链接形式的锚点)</a>(代码) 
GitBook个性化配置
book.json
可以通过配置 book.json 文件来修改 gitbook 在编译书籍时的行为，例如：修改书籍的名称，显示效果等等。
GitBook.com
GitBook.com 是一个围绕 gitbook 发行书籍的社区，于 2014 年初创，GitBook.com 提供免费和付费的服务，而且免费账户就可以享受诸多服务，包括：

1 本私有书籍
托管不限数量的公开书籍
售卖不限数量的书籍，并分享 80% 的书籍收入
不限数量的协作者
免费的在线书籍编辑器
对于普通用户来说，免费账号就已经够用，因为虽然限制为 1 本私有书籍，但是并没有限制书籍的大小， 所以对于个人的学习笔记来说非常合适，用户甚至可以将所有知识归类放入一本私有书籍中！当然， GitBook.com 限制私有书籍数量但不限公开书籍数量的政策，显然是鼓励用户能够共享知识！