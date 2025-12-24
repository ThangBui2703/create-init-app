import { execa } from "execa";

export async function createReactApp(projectName: string) {
    await execa(
        "npm",
        ["create", "vite@latest", projectName, "--", "--template", "react"],
        { stdio: "inherit" }
    );
}
