import { createReactTSRouterApp } from "../installers/reactTSRouter";

export async function setupReactTSRouter(projectName: string) {
    await createReactTSRouterApp(projectName);
}