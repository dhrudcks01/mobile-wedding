/* eslint-disable @typescript-eslint/no-require-imports */
// 테스트에서만 기존 TypeScript 컴파일러로 .ts 파일을 읽습니다. 앱 실행에는 사용하지 않습니다.
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const originalLoad = Module._load;
Module._load = function (name, parent, main) {
  if (name === "server-only") return {};
  if (name.startsWith("@/")) name = path.join(root, "src", name.slice(2));
  return originalLoad.call(this, name, parent, main);
};
require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(result.outputText, filename);
};
