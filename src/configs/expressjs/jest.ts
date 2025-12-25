import path from "path";
import fs from "fs-extra";

export async function configJest(projectName: string) {
    const jestConfigPath = path.join(projectName, "jest.config.mjs");
    await fs.ensureFile(jestConfigPath);
    await fs.writeFile(jestConfigPath, jestConfigTemplate);

    const packageJsonPath = path.join(projectName, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.scripts["test:unit"] = "jest --testPathPatterns=unit";
    packageJson.scripts["test:integration"] = "jest --testPathPatterns=integration";
    packageJson.scripts["test"] = "jest";
    await fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2,
    });

    const testUnitDir = path.join(projectName, "test", "unit");
    const testIntegrationDir = path.join(projectName, "test", "integration");
    await Promise.all([
        fs.ensureDir(testUnitDir),
        fs.ensureDir(testIntegrationDir),
    ]);

}

const jestConfigTemplate = `/** @type {import('jest').Config} */

export default {
	clearMocks: true,
	coverageProvider: "v8",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
};
`.trimStart();