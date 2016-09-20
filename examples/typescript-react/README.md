# Example TypeScript+React Project

+ 用 TypeScript 2.0 Beta 版，有不少功能上的提升。
+ 用 tslint 保证风格统一。装上 vscode 插件，实时确认风格。
+ 用 typings 为 npm 依赖包加上 API 类型文件。
+ 用 quickpack 为项目打包
+ 用 tape 和 enzyme 做 React 单元测试

# 运行 React 单元测试

单元测试用 node 运行。先编译 TypeScript：

```
npm run build
```

然后运行测试：

```
npm run test

> typescript2-react-starter@1.0.0 test /Users/howard/p/typescript2-react-starter
> node -r ./source-map-support build/src/**_test.js

TAP version 13
# <HelloList> should have 'length' number of li elements
ok 1 should be equal

1..1
# tests 1
# pass  1

# ok
```

# VSCode 调试器

可以在 VSCode 里用调试器运行测试，方便排错。

打开测试文件 (后缀为 '_test.tsx') 按 F5 键就会启动程序。

# 浏览器运行

在浏览器运行应用需要用 quickpack 打包:

```
npm bundle
```

浏览器打开 `index.html` 即可运行。

```
open index.html
```

# Suggested Exercise

[Rewrite An Redux App with TypeScript](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo)
