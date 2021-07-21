/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
    // 解析：传入的html字符串变成AST（js对象，类似于虚拟dom）
  const ast = parse(template.trim(), options)
  // 优化：标记静态节点
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 代码生成，将AST转化成渲染函数字符串，new Function（str）
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})