"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
exports.prismaMock = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    session: {
        create: jest.fn(),
        deleteMany: jest.fn(),
    }
};
