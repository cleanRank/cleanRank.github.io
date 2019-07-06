# 说明、

这是nodejs的debug调试工具，可以帮助我们调试代码，非常方便，在nodejs版本高于8的时候，老旧的node-inspector已经淘汰了，安装不了。
所以需要安装node-inspect



#安装
 打开cmd 全局安装$ npm install -g node-respect
                  npm install --global node-inspect

#使用

打开文件目录执行命令 node --inspect-brk promise.js



会有如下提示：
Debugger listening on ws://127.0.0.1:9229/ff3d33a3-83ee-4cef-9483-82164a6aeb73
For help, see: https://nodejs.org/en/docs/inspector

打开浏览器：chrome://inspect/#devices
点击inspect
就会调到代码debug中，接下来可以愉快的打上断点、console以及watch等


https://github.com/nodejs/node-inspect