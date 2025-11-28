"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
// Supertest instance for calling the API
exports.api = (0, supertest_1.default)(app_1.default);
