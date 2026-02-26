import * as esbuild from "esbuild";
import fs from "fs";

// Ensure dist directory exists
fs.mkdirSync("dist", { recursive: true });

// Build client bundle
await esbuild.build({
  entryPoints: ["src/client.jsx"],
  bundle: true,
  outfile: "dist/client.js",
  format: "esm",
  platform: "browser",
  jsx: "automatic",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  // Keep React.lazy dynamic import as-is
  splitting: false,
});

// Build server
await esbuild.build({
  entryPoints: ["src/server.jsx"],
  bundle: true,
  outfile: "dist/server.js",
  format: "esm",
  platform: "node",
  jsx: "automatic",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  // Don't bundle node_modules for server
  packages: "external",
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});

console.log("Build complete!");
