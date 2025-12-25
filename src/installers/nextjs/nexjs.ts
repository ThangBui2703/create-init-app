import { execa } from "execa";

export async function createNextApp(projectName: string) {
    const arg = [
        "create-next-app@latest",
        projectName,
        "--ts",
        "--tailwind",
        "--react-compiler",
        "--biome",
        "--app",
        "--src-dir",
        "--import-alias",
        "@/*"
    ]
    await execa(
        "npx",
        arg,
        { stdio: "inherit" }
    );

}
