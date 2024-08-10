import path from 'node:path';
import fs from 'node:fs/promises';

const projectDirFlag = process.argv[2];
if (!projectDirFlag) {
  console.error('require projectDir');
  process.exit(1);
}

const projectDir = path.resolve(import.meta.dirname, './scripts', projectDirFlag);

async function printManifest(src) {
  const manifest = await import(src).then(m => m.default);
  const lines = [];
  lines.push('// ==UserScript==');

  Object.entries(manifest).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      value.forEach(oneVal => {
        lines.push(`// @${field}    ${oneVal}`);
      });
    } else {
      lines.push(`// @${field}    ${value}`);
    }
  });

  lines.push('// ==/UserScript==');
  return lines.join('\n');
}

async function printScript(entrypoint) {
  const bundle = await Bun.build({
    entrypoints: [entrypoint],
    splitting: false,
    target: 'browser',
    format: 'esm',
    minify: false,
  });

  const artifacts = bundle.outputs;
  return artifacts[0].text();
}

async function printMonkeyScript() {
  const scriptMainFile = path.join(projectDir, 'main.js');
  const manifestFile = path.join(projectDir, 'manifest.toml');

  const manifestBlock = await printManifest(manifestFile);
  const codeBlock = await printScript(scriptMainFile);
  const content = `${manifestBlock}\n\n!(() => {\n${codeBlock}\n})();`;

  return content;
}

const outDir = 'dist';
if (await fs.exists(outDir)) {
  await fs.rm(outDir, { recursive: true, force: true });
}
await fs.mkdir(outDir);
const monkeyScript = await printMonkeyScript();
await fs.writeFile(path.join(outDir, `${path.basename(projectDir)}.js`), monkeyScript, 'utf-8');
