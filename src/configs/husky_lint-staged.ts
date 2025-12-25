import fs from "fs-extra";
import path from "path";

export async function setupHuskyLintStaged(projectName: string) {

    const preCommitPath = path.join(projectName, ".husky", "pre-commit");
    const prePushPath = path.join(projectName, ".husky", "pre-push");
    await Promise.all([
        fs.ensureFile(preCommitPath),
        fs.ensureFile(prePushPath)
    ]);

    await Promise.all([
        fs.writeFile(preCommitPath, `npx lint-staged`),
        fs.writeFile(prePushPath, `npm run build`)
    ]);

    const packageJsonPath = path.join(projectName, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson["lint-staged"] = {
        "*.{ts,tsx,js,jsx,json,css}": [
            "npm run format",
            "npm run lint",
        ],
    };
    packageJson.scripts["prepare"] = "husky";
    packageJson.scripts["lint"] = "biome check";
    packageJson.scripts["format"] = "biome format --write";
    await fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2,
    });
}