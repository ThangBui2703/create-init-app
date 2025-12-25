import { execa } from "execa";
import fs from "fs-extra";

export async function createExpressApp(projectName: string) {
    await fs.ensureDir(projectName)
    await execa("npm", ["init", "-y"], {
        cwd: projectName,
        stdio: "inherit",
    });

}
