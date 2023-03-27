"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Scanner_1 = __importDefault(require("./Scanner"));
const token_1 = require("./token");
class Parser {
    constructor(baselPackage) {
        this.diagnostics = [];
        this.packageProperties = [];
        this.scanner = new Scanner_1.default(baselPackage);
    }
    parse() {
        if (!this.isNotValidBoilerplate())
            return this;
        this.topLevelKeys();
        return this;
    }
    getDiagnostics() {
        return this.diagnostics;
    }
    isNotValidBoilerplate() {
        if (!this.expectToken("Expected import keyword", token_1.TokenType.Identifier, "import")
            || !this.expectToken("Expected '{' token", token_1.TokenType.LeftBrace)
            || !this.expectToken("Expected 'JSONPackage'", token_1.TokenType.Identifier, "JSONPackage")
            || !this.expectToken("Expected '}' token", token_1.TokenType.RightBrace)
            || !this.expectToken("Expected from keyword", token_1.TokenType.Identifier, "from")
            || !this.expectToken("Expected '@partner-core/json-package-types'", token_1.TokenType.StringLiteral, "@partner-core/json-package-types")
            || !this.expectToken("Expected ';' token", token_1.TokenType.Semicolon)
            || !this.expectToken("Expected export token", token_1.TokenType.Identifier, "export")
            || !this.expectToken("Expected const token", token_1.TokenType.Identifier, "const")
            || !this.expectToken("Expected partner token", token_1.TokenType.Identifier, "partner")
            || !this.expectToken("Expected ':' token", token_1.TokenType.Colon)
            || !this.expectToken("Expected JSONPackage token", token_1.TokenType.Identifier, "JSONPackage")
            || !this.expectToken("Expected '=' token", token_1.TokenType.Equals)
            || !this.expectToken("Expected '{' token", token_1.TokenType.LeftBrace))
            return false;
        return true;
    }
    topLevelKeys() {
        while (!this.scanner.nextIsEOF()) {
            const token = this.scanner.scan();
            if (token.tokenType === token_1.TokenType.RightBrace)
                return;
            if (token.tokenType !== token_1.TokenType.Identifier)
                continue;
            console.log("LEXEME", token.lexeme);
            switch (token.lexeme) {
                case "packageProperties":
                    this.diagnosePackageProperties();
                    break;
                default: continue;
            }
        }
    }
    diagnosePackageProperties() {
        this.expectToken("Expected ':'", token_1.TokenType.Colon);
        this.expectToken("Expected '['", token_1.TokenType.LeftBracket);
        while (!this.scanner.nextIsEOF()) {
            const token = this.scanner.scan();
            switch (token.tokenType) {
                case token_1.TokenType.StringLiteral: {
                    if (!token.lexeme)
                        throw new Error("Invalid identifier lexeme");
                    if (token.lexeme.length > 22) {
                        this.diagnostics.push({
                            range: new vscode_1.Range(new vscode_1.Position(token.line_position[0], token.line_position[1]), new vscode_1.Position(token.line_position[2], token.line_position[3])),
                            message: `Package property '${token.lexeme}' should be 22 characters or less`,
                            severity: vscode_1.DiagnosticSeverity.Error
                        });
                    }
                    if (this.checkInvalidChars(token.lexeme)) {
                        this.diagnostics.push({
                            range: new vscode_1.Range(new vscode_1.Position(token.line_position[0], token.line_position[1]), new vscode_1.Position(token.line_position[2], token.line_position[3])),
                            message: `Package property '${token.lexeme}' should only contain lowercase alphanumeric characters and '_'`,
                            severity: vscode_1.DiagnosticSeverity.Error
                        });
                    }
                    this.packageProperties.push(token.lexeme);
                    continue;
                }
                case token_1.TokenType.Comma: continue;
                case token_1.TokenType.RightBracket:
                    // if(this.scanner.peek(",")) this.scanner.scan();
                    return;
                default:
                    this.diagnostics.push({
                        range: new vscode_1.Range(new vscode_1.Position(token.line_position[0], token.line_position[1]), new vscode_1.Position(token.line_position[2], token.line_position[3])),
                        message: "Syntax error in packageProperties array.",
                        severity: vscode_1.DiagnosticSeverity.Error
                    });
            }
        }
    }
    checkInvalidChars(lexeme) {
        return /[^a-z|_|\d]/.test(lexeme);
    }
    expectToken(message, tokenTypeToCheck, lexemeToCheck) {
        const { tokenType, lexeme, line_position } = this.scanner.scan();
        const [lineStart, posStart, lineEnd, posEnd] = line_position;
        if (tokenType !== tokenTypeToCheck
            || (lexemeToCheck && lexeme !== lexemeToCheck)) {
            this.diagnostics.push({
                message,
                range: new vscode_1.Range(new vscode_1.Position(lineStart, posStart), new vscode_1.Position(lineEnd, posEnd)),
                severity: vscode_1.DiagnosticSeverity.Error
            });
            return false;
        }
        return true;
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map