import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/server.cjs',
  external: ['express', 'mongoose', 'axios', 'vite', 'jsonwebtoken'],
  define: {
    'import.meta.url': JSON.stringify('file://placeholder'),
  },
}).catch(() => process.exit(1));
