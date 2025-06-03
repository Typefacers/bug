import fs from 'node:fs/promises'
import ts from 'typescript'

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.png')) {
    return {
      url: new URL(specifier, context.parentURL).href,
      shortCircuit: true,
    }
  }
  if (specifier.endsWith('.tsx')) {
    return {
      url: new URL(specifier, context.parentURL).href,
      shortCircuit: true,
    }
  }
  if (specifier.endsWith('.tsx')) {
    return {
      url: new URL(specifier, context.parentURL).href,
      shortCircuit: true,
    }
  }
  if (!specifier.startsWith('node:') && !specifier.endsWith('.ts')) {
    for (const ext of ['.ts', '.tsx']) {
      try {
        const url = new URL(specifier + ext, context.parentURL)
        await fs.access(url)
        return { url: url.href, shortCircuit: true }
      } catch {
        // continue
      }
    }
  }
  return defaultResolve(specifier, context, defaultResolve)
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.png')) {
    return {
      format: 'module',
      source: `export default ${JSON.stringify(url)};`,
      shortCircuit: true,
    }
  }
  if (url.endsWith('.tsx')) {
    const source = await fs.readFile(new URL(url), 'utf8')
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: url,
    })
    return { format: 'module', source: result.outputText, shortCircuit: true }
  }
  return defaultLoad(url, context, defaultLoad)
}
