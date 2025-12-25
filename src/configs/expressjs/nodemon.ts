import path from "path";
import fs from "fs-extra";

export async function configNodemon(projectName: string) {
    const packageJsonPath = path.join(projectName, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.scripts["dev"] = "nodemon index.ts";
    await fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2,
    });

}