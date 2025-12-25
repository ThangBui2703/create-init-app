import path from "path";
import fs from "fs-extra";

export async function setupDockerPostgres(projectName: string) {
    const dockerComposePath = path.join(projectName, "docker-compose.yml");
    await fs.ensureFile(dockerComposePath);
    await fs.writeFile(dockerComposePath, dockerComposeTemplate);
}

const dockerComposeTemplate = `
version: '3'
services:
  postgres:
    image: postgres:17
    ports:
    - 5432:5432
    environment:
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres
    - POSTGRES_DB=postgres
    volumes:
    - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
`;