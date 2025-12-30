import { execa } from "execa";

export async function createReactTSRouterApp(projectName: string) {
    const args = [
        "create-tsrouter-app@latest",
        projectName,
        "--template",
        "file-router",
        "--tailwind",
        "--toolchain",
        "biome",
        "--add-ons",
        "shadcn,tanstack-query,compiler,form",
    ]
    await execa("npx", args, {
        stdio: "inherit",
    });
}