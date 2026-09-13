import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    // First-pass gate: keep `npm run lint` usable. Pre-existing cascading-render
    // and admin-link patterns stay as warnings until those files are cleaned up.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "coverage/**",
      "lib/generated/**",
    ],
  },
];

export default eslintConfig;
