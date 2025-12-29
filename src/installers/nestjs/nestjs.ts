import { execa } from "execa";
import path from "path";
import fs from "fs-extra";

export async function createNestApp(projectName: string) {
    await execa(
        "npx",
        ["@nestjs/cli", "new", projectName, "-p", "npm"],
        { stdio: "inherit" }
    );

 const mainPath = path.join(projectName, "src", "main.ts");
 await fs.writeFile(mainPath, mainTemplate);
}

const mainTemplate = `import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
    .setTitle('My Project API')
    .setDescription('The my project API description')
    .setVersion('1.0')
    .addTag('my project')
    .build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, documentFactory);

	app.enableCors();
	app.use(helmet());
	app.use(cookieParser());

	await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
`.trimStart();