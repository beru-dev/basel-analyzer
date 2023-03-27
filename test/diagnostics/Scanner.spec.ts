import Scanner from "../../src/diagnostics/Scanner";
import { Token, TokenType } from "../../src/diagnostics/token";
import fs from "fs";
import path from "path";

const mockPackage = (fs.readFileSync(path.join(__dirname + "../../../src/mock/mock.package.ts"))).toString();

describe("scanner", () => {
    it("should scan through the import statement", () => {
        const scanner = new Scanner(mockPackage);

        expect(scanner.scan()).toEqual(new Token(TokenType.Identifier, "import", [0, 0, 0, 6]));
        expect(scanner.scan()).toEqual(new Token(TokenType.LeftBrace, null, [0, 7, 0, 8]));
        expect(scanner.scan()).toEqual(new Token(TokenType.Identifier, "JSONPackage", [0, 9, 0, 20]));
        expect(scanner.scan()).toEqual(new Token(TokenType.RightBrace, null, [0, 21, 0, 22]));
        expect(scanner.scan()).toEqual(new Token(TokenType.Identifier, "from", [0, 23, 0, 27]));
        expect(scanner.scan()).toEqual(new Token(TokenType.StringLiteral, "@partner-core/json-package-types", [0, 29, 0, 61]));
        expect(scanner.scan()).toEqual(new Token(TokenType.Semicolon, null, [0, 62, 0, 63]));
    });
});