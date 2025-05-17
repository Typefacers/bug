export async function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.png')) {
    return { url: new URL(specifier, context.parentURL).href, shortCircuit: true };
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.png')) {
    return {
      format: 'module',
      source: `export default ${JSON.stringify(url)};`,
      shortCircuit: true,
    };
  }
  return defaultLoad(url, context, defaultLoad);
}
