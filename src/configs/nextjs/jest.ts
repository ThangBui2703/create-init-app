import path from "path";
import fs from "fs-extra";

export async function setupJest(projectName: string) {
    const jestConfigPath = path.join(projectName, "jest.config.ts");
    await fs.ensureFile(jestConfigPath);
    await fs.writeFile(jestConfigPath, jestConfigTemplate);

    const packageJsonPath = path.join(projectName, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.scripts["test:unit"] = "jest --testPathPatterns=unit";
    packageJson.scripts["test:integration"] = "jest --testPathPatterns=integration";
    await fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2,
    });

    const testUnitDir = path.join(projectName, "src", "backend", "test", "unit");
    const testIntegrationDir = path.join(projectName, "src", "backend", "test", "integration");
    await Promise.all([
        fs.ensureDir(testUnitDir),
        fs.ensureDir(testIntegrationDir),
    ]);

}

const jestConfigTemplate = `import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

export default config;
`.trimStart();