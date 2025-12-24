#!/usr/bin/env node
import { createProject } from "./create.js";
import { ask } from "./ask.js";

async function main() {
    const answers = await ask();
    await createProject(answers);
}

main().catch((error) => {
    console.error("error:", error);
    process.exit(1);
});

