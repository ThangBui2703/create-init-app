import { execa } from "execa";
import path from "path";
import fs from "fs-extra";

export async function configBiome(projectName: string) {
    const eslintConfigPath = path.join(projectName, "eslint.config.mjs");
    const prettierConfigPath = path.join(projectName, ".prettierrc");
    await Promise.all([
        execa("npx", ["biome", "init"], {
            cwd: projectName,
            stdio: "inherit"
        }),
        execa("npm", ["remove", "@eslint/eslintrc","@eslint/js","eslint","eslint-config-prettier","eslint-plugin-prettier","typescript-eslint", "prettier"],{
            cwd: projectName,
            stdio: "inherit"
        }),
        fs.remove(eslintConfigPath),
        fs.remove(prettierConfigPath),
    ]);    
}