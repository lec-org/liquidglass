import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: { index: "src/index.ts", workspace: "src/workspace.tsx" },
      formats: ["es", "cjs"],
      fileName: (format, entry) => entry + (format === "es" ? ".js" : ".cjs"),
    },
    rolldownOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-resizable-panels",
        "@daypicker/react",
        "@daypicker/react/locale",
      ],
    },
  },
});
