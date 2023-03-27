"use strict";
// import { Diagnostic, DiagnosticSeverity, Range, Position } from "vscode";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = __importDefault(require("./Parser"));
exports.default = (baselPackage) => {
    const parsed = new Parser_1.default(baselPackage).parse();
    return parsed.getDiagnostics();
};
//# sourceMappingURL=index.js.map