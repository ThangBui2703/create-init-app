import { execa } from "execa";

export async function configBiome(projectName: string) {
    execa("npx", ["biome", "init"], {
        cwd: projectName,
        stdio: "inherit"
    });
}