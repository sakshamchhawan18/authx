"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrap = void 0;
const asyncWrap = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncWrap = asyncWrap;
