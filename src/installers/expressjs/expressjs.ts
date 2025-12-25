import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

export async function createExpressApp(projectName: string) {
    await fs.ensureDir(projectName)
    await execa("npm", ["init", "-y"], {
        cwd: projectName,
        stdio: "inherit",
    });
    const dtosDir = path.join(projectName, "src", "dtos");
    const handlersDir = path.join(projectName, "src", "handlers");
    const repositoriesDir = path.join(projectName, "src", "repositories");
    const servicesDir = path.join(projectName, "src", "services");
    const routesDir = path.join(projectName, "src", "routes");
    const middlewareDir = path.join(projectName, "src", "middleware");
    await Promise.all([
        fs.ensureDir(dtosDir),
        fs.ensureDir(handlersDir),
        fs.ensureDir(repositoriesDir),
        fs.ensureDir(servicesDir),
        fs.ensureDir(routesDir),
        fs.ensureDir(middlewareDir),
    ]);

    const idParamDtoPath = path.join(dtosDir, "idParam.dto.ts");
    const paginationDtoPath = path.join(dtosDir, "pagination.dto.ts");
    const responseDtoPath = path.join(dtosDir, "response.dto.ts");
    await Promise.all([
        fs.ensureFile(idParamDtoPath),
        fs.ensureFile(paginationDtoPath),
        fs.ensureFile(responseDtoPath),
    ]);

    await Promise.all([
        fs.writeFile(idParamDtoPath, idParamDtoTemplate),
        fs.writeFile(paginationDtoPath, paginationDtoTemplate),
        fs.writeFile(responseDtoPath, responseDtoTemplate),
    ]);

    const appFilePath = path.join(projectName, "src", "app.ts");
    const indexFilePath = path.join(projectName, "index.ts");
    await Promise.all([
        fs.ensureFile(appFilePath),
        fs.ensureFile(indexFilePath),
    ]);

    await Promise.all([
        fs.writeFile(appFilePath, appTemplate),
        fs.writeFile(indexFilePath, indexTemplate),
    ]);
}
const appTemplate = `import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import morgan from "morgan";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // mabe AI will help to generate the json file
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

export default app;`;

const indexTemplate = `import app from "./src/app";

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(\`Server is running on port \${ port }\`);
});`;

const idParamDtoTemplate = `export type IdParam = {
	id: string;
};`;

const paginationDtoTemplate = `export type Pagination = {
	page: number;
	limit: number;
};`;

const responseDtoTemplate = `export type Response<T> = {
	data?: T;
	message: string;
	statusCode: number;
	success: boolean;
};`;