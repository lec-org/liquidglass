import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// 类型声明也可被 NodeNext 项目消费，内部引用使用明确的 .js 扩展名。
async function patchDeclarations(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await patchDeclarations(path);
    else if (entry.name.endsWith(".d.ts")) {
      const text = await readFile(path, "utf8");
      await writeFile(
        path,
        text.replace(
          /((?:from|import)\s+["'])(\.[^"']+)(["'])/g,
          (match, before, target, after) => {
            return /\.(js|css)$/.test(target)
              ? match
              : before + target + ".js" + after;
          },
        ),
      );
    }
  }
}
await patchDeclarations("dist/types");
await copyFile("src/styles.css", "dist/styles.css");
