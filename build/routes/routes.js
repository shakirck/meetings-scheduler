"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerspec = exports.options = void 0;
const auth_1 = __importDefault(require("./auth/auth"));
const schedules_routes_1 = __importDefault(require("./schedule/schedules.routes"));
const express_1 = require("express");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API'
        },
    },
    apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts', './src/models/**/*.ts', './src/middlewares/**/*.ts', './src/config/**/*.ts', './src/**/*.js']
};
exports.swaggerspec = (0, swagger_jsdoc_1.default)(exports.options);
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/schedule", schedules_routes_1.default);
router.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerspec));
router.use('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(exports.swaggerspec);
});
exports.default = router;
