import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read all swagger JSON files
const swagger = JSON.parse(
  readFileSync(join(__dirname, 'swagger.json'), 'utf8')
);
const authSwagger = JSON.parse(
  readFileSync(join(__dirname, 'authSwagger.json'), 'utf8')
);
const categorySwagger = JSON.parse(
  readFileSync(join(__dirname, 'categorySwagger.json'), 'utf8')
);
const productSwagger = JSON.parse(
  readFileSync(join(__dirname, 'productSwagger.json'), 'utf8')
);
const orderSwagger = JSON.parse(
  readFileSync(join(__dirname, 'orderSwagger.json'), 'utf8')
);
const orderDetailSwagger = JSON.parse(
  readFileSync(join(__dirname, 'orderDetailSwagger.json'), 'utf8')
);
const personSwagger = JSON.parse(
  readFileSync(join(__dirname, 'personSwagger.json'), 'utf8')
);
const accountSwagger = JSON.parse(
  readFileSync(join(__dirname, 'accountSwagger.json'), 'utf8')
);

// Merge all swagger JSON files into a single specification
const swaggerSpec = {
  ...swagger,
  paths: {
    ...swagger.paths,
    ...authSwagger.paths,
    ...categorySwagger.paths,
    ...productSwagger.paths,
    ...orderSwagger.paths,
    ...orderDetailSwagger.paths,
    ...personSwagger.paths,
    ...accountSwagger.paths,
  },
  components: {
    ...swagger.components,
    schemas: {
      ...swagger.components?.schemas,
      ...authSwagger.components?.schemas,
      ...categorySwagger.components?.schemas,
      ...productSwagger.components?.schemas,
      ...orderSwagger.components?.schemas,
      ...orderDetailSwagger.components?.schemas,
      ...personSwagger.components?.schemas,
      ...accountSwagger.components?.schemas,
    },
  },
};

export { swaggerSpec, swaggerUi };
