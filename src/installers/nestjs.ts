import { execa } from "execa";

export async function createNestApp(projectName: string) {
    await execa(
        "npx",
        ["@nestjs/cli", "new", projectName],
        { stdio: "inherit" }
    );
}
