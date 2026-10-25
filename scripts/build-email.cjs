const fs = require("node:fs");
const path = require("node:path");
const esbuild = require("esbuild");

const output = path.resolve(
  __dirname,
  "../../server/src/Services/generated/OrderEmail.cjs"
);

fs.mkdirSync(path.dirname(output), { recursive: true });

esbuild.buildSync({
  entryPoints: [
    path.resolve(
      __dirname,
      "../src/features/emails/pages/OrderEmail.jsx"
    ),
  ],
  outfile: output,
  bundle: true,
  platform: "node",
  format: "cjs",
  packages: "external",
  jsx: "automatic",
});

console.log("Email component built successfully.");