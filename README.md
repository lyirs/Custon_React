# 从零开始实现React18

♢ 定义项目结构（monorepo）

♢ 定义开发规范
```
pnpm i eslint -D -w
pnpm i -D -w @typescript-eslint/eslint-plugin 
pnpm i prettier -D -w
pnpm i eslint-config-prettier eslint-plugin-prettier -D -w
pnpm i husky -D -w
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D -w
```
♢ 定义打包工具
```
pnpm i -D -w rollup
```
♢ React项目结构
- react（宿主环境无关的公用方法）
- shared（公用辅助方法，宿主环境无关）

♢ JSX转换 运行时实现 （编译时由babel编译实现）
- 实现jsx方法
  - jsxDEV方法（dev环境）
  - jsx方法（prod环境）
  - React.createElement方法

♢ 实现打包流程
```
pnpm i -D -w rollup-plugin-typescript2
pnpm i -D -w @rollup/plugin-commonjs
pnpm i -D -w rimraf
pnpm i -D -w rollup-plugin-generate-package-json
```
对应上述3方法，打包对应文件：
- react/jsx-dev-runtime.js（dev环境）
- react/jsx-rumtime.js（prod环境）
- React

♢ 调试打包结果

在dist/node_modules/react中
```
pnpm link --global
```
在npx create-react-app创建的react项目中
```
pnpm link react --global
```

♢ 实现Reconciler架构 （diff算法）

ReactElement如果作为核心模块操作的数据结构，存在的问题：
- 无法表达节点之间的关系
- 字段有限，不好拓展（比如：无法表达状态）

所以，需要一种新的数据结构，他的特点：
- 介于ReactElement与真实UI节点之间
- 能够表达节点之间的关系
- 方便拓展（不仅作为数据存储单元，也能作为工作单元）

这就是FiberNode（虚拟DOM在React中的实现）

对于同一个节点，比较其ReactElement与fiberNode，生成子fiberNode。并根据比较的结果生成不同标记（插入、删除、移动......），对应不同宿主环境API的执行。

当所有ReactElement比较完后，会生成一棵fiberNode树，一共会存在两棵fiberNode树：
- current：与视图中真实UI对应的fiberNode树
- workInProgress：触发更新后，正在reconciler中计算的fiberNode树

以DFS（深度优先遍历）的顺序遍历ReactElement，这是个递归的过程，存在递、归两个阶段：
- 递：对应beginWork
- 归：对应completeWork

♢ 触发更新

常见的触发更新的方式
- ReactDOM.createRoot().render（或老版的ReactDOM.render）
- this.setState
- useState的dispatch方法
 
更新机制的组成部分
- 代表更新的数据结构 —— Update
- 消费update的数据结构 —— UpdateQueue