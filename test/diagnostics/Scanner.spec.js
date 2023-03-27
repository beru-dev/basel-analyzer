"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scanner_1 = __importDefault(require("../../src/diagnostics/Scanner"));
const token_1 = require("../../src/diagnostics/token");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mockPackage = (fs_1.default.readFileSync(path_1.default.join(__dirname + "../../../src/mock/mock.package.ts"))).toString();
describe("scanner", () => {
    it("should scan through the import statement", () => {
        const scanner = new Scanner_1.default(mockPackage);
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.Identifier, "import", [0, 0, 0, 6]));
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.LeftBrace, null, [0, 7, 0, 8]));
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.Identifier, "JSONPackage", [0, 9, 0, 20]));
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.RightBrace, null, [0, 21, 0, 22]));
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.Identifier, "from", [0, 23, 0, 27]));
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.StringLiteral, "@partner-core/json-package-types", [0, 29, 0, 61]));
        expect(scanner.scan()).toEqual(new token_1.Token(token_1.TokenType.Semicolon, null, [0, 62, 0, 63]));
    });
});
//# sourceMappingURL=Scanner.spec.js.map