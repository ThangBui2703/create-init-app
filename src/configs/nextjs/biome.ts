import fs from "fs-extra";
import path from "path";

export async function setupBiome(projectName: string, isShadcn: boolean) {

    const biomePath = path.join(projectName, "biome.json");
    const biomeConfig = await fs.readJson(biomePath);
    const ignoreFiles = [...biomeConfig.files.includes, "!**/app/globals.css"]
    if (isShadcn) {
        ignoreFiles.push("!**/components/ui");
    }
    biomeConfig.files.includes = ignoreFiles;
    await fs.writeJson(biomePath, biomeConfig, {
        spaces: 2,
    });

}