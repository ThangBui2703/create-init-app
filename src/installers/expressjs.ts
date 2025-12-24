import { execa } from "execa";

export async function createNextExpressApp(projectName: string) {
    await execa(
        "npx",
        ["create-next-app@latest", projectName, "--use-npm"],
        { stdio: "inherit" }
    );
}
