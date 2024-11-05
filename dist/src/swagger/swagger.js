"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        produces: ['application/json'],
        // Define info object
        info: {
            title: 'REST API Docs',
            version: '1.0.0',
            contact: {
                email: 'anwarmahedisr@gmail.com',
                name: 'Anwar Hossain',
            },
            description: 'Custom structure to build an REST API using Express.js',
            license: {
                name: 'All Rights Reserved',
            },
        },
        // Define security protocols
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'Enter JWT token',
                },
            },
        },
        host: 'http://localhost:4000',
    },
    host: 'localhost:4000',
    schemes: ['http', 'https'],
    basePath: '/api/v2',
    apis: ['./src/resources/**/*.controller.ts'],
    persistAuthorization: true,
    persistAuthorizationInSession: true,
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Swagger page
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Docs in JSON format
    app.get('/docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log(`Docs available at http://localhost:${port}/api-docs`);
}
exports.default = swaggerDocs;
//# sourceMappingURL=swagger.js.map