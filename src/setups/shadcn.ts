import { execa } from "execa";

export async function setupShadcn(projectName: string) {
    const args = [
        "shadcn@latest",
        "init",
        "dialog",
        "avatar",
        "button-group",
        "calendar",
        "card",
        "carousel",
        "chart",
        "checkbox",
        "drawer",
        "dropdown-menu",
        "input-group",
        "label",
        "pagination",
        "select",
        "sheet",
        "skeleton",
        "sonner",
        "spinner",
        "table",
        "textarea",
    ]
    await execa("npx", args, {
        cwd: projectName,
        stdio: "inherit",
    });
}