import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/server.mjs',
  external: ['express', 'mongoose', 'axios', 'vite'],
}).catch(() => process.exit(1));
