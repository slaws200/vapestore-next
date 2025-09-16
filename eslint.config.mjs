import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"], // только для TypeScript-файлов
    rules: {
      // "no-console": "warn",
      // "@typescript-eslint/explicit-function-return-type": "off",
      "react-hooks/exhaustive-deps": "off",
      allowShortCircuit: "true",
    },
  },

  {
    files: ["**/*.js"], // только для JS
    rules: {
      "no-var": "error",
    },
  },
];

export default eslintConfig;
