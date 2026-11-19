import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default function buildServiceWorker() {
  let outDir;

  return {
    name: 'simpleshop-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const source = await readFile(new URL('./worker.js', import.meta.url), 'utf8');
      const entries = (await readdir(outDir, { recursive: true, withFileTypes: true }))
        .filter((entry) => entry.isFile() && !['sw.js', 'connection.json'].includes(entry.name)
          && !entry.name.endsWith('.map'))
        .map((entry) => resolve(entry.parentPath, entry.name))
        .sort();
      const hash = createHash('sha256').update(source);
      const urls = [];

      for (const entry of entries) {
        const url = '/' + entry.slice(outDir.length + 1).replaceAll('\\', '/');
        urls.push(url);
        hash.update(url).update(await readFile(entry));
      }

      const config = { version: hash.digest('hex').slice(0, 20), urls };
      await writeFile(resolve(outDir, 'sw.js'), 'const BUILD = ' + JSON.stringify(config) + ';\n' + source);
    },
  };
}
