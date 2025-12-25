import { execa } from "execa";
import path from "path";
import fs from "fs-extra";

export async function configTypescript(projectName: string) {
	await execa("npx", ["tsc", "--init"], {
		cwd: projectName,
		stdio: "inherit"
	});
	const tsconfigPath = path.join(projectName, "tsconfig.json");
	await fs.writeFile(tsconfigPath, tsconfigTemplate);

	const packageJsonPath = path.join(projectName, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	packageJson.scripts["start"] = "node ./dist/index.js";
	packageJson.scripts["build"] = "tsc --build";
	await fs.writeJson(packageJsonPath, packageJson, {
		spaces: 2,
	});
}


const tsconfigTemplate = `{
	"compilerOptions": {
		"rootDir": ".",
		"outDir": "./dist",

		"module": "CommonJS",
		"target": "ES2022",
		"esModuleInterop": true,
		"resolveJsonModule": true,
		"types": ["jest"],

		"sourceMap": true,
		"declaration": true,
		"declarationMap": true,

		"noUncheckedIndexedAccess": true,
		"exactOptionalPropertyTypes": true,

		"strict": true,
		"isolatedModules": true,
		"noUncheckedSideEffectImports": true,
		"moduleDetection": "force",
		"skipLibCheck": true
	}
}`.trimStart();



