import path from 'node:path';
import fs from 'node:fs/promises';

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

async function printMonkeyScript(projectDir) {
  const scriptMainFile = path.resolve(projectDir, 'main.js');
  const manifestFile = path.resolve(projectDir, 'manifest.toml');

  const manifestBlock = await printManifest(manifestFile);
  const codeBlock = await printScript(scriptMainFile);
  const content = `${manifestBlock}\n\n!(() => {\n${codeBlock}\n})();`;

  return content;
}

const outDir = 'dist';
async function initOutputDir() {
  if (await fs.exists(outDir)) {
    await fs.rm(outDir, { recursive: true, force: true });
  }
  await fs.mkdir(outDir);
}

const projectDirs = [];
const scriptsDir = path.resolve(import.meta.dirname, './scripts');

const projectDirFlag = process.argv[2];
if (projectDirFlag) {
  const projectDir = path.resolve(scriptsDir, projectDirFlag);
  projectDirs.push(projectDir);
} else {
  const dirs = await fs.readdir(scriptsDir);
  for (const dir of dirs) {
    const dirPath = path.resolve(scriptsDir, dir);
    const stat = await fs.stat(dirPath);

    if (stat.isDirectory()) {
      projectDirs.push(dirPath);
    }
  }
}

await initOutputDir();
for (const projectDir of projectDirs) {
  console.log('Build monkey script project:', path.basename(projectDir));
  const monkeyScript = await printMonkeyScript(projectDir);
  await fs.writeFile(path.resolve(outDir, `${path.basename(projectDir)}.js`), monkeyScript, 'utf-8');
}
