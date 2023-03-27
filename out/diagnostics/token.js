"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.Token = void 0;
class Token {
    constructor(tokenType, lexeme, line_position) {
        this.tokenType = tokenType;
        this.lexeme = lexeme;
        this.line_position = line_position;
    }
}
exports.Token = Token;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["LeftBrace"] = 0] = "LeftBrace";
    TokenType[TokenType["RightBrace"] = 1] = "RightBrace";
    TokenType[TokenType["LeftBracket"] = 2] = "LeftBracket";
    TokenType[TokenType["RightBracket"] = 3] = "RightBracket";
    TokenType[TokenType["Equals"] = 4] = "Equals";
    TokenType[TokenType["Comma"] = 5] = "Comma";
    TokenType[TokenType["Colon"] = 6] = "Colon";
    TokenType[TokenType["Semicolon"] = 7] = "Semicolon";
    TokenType[TokenType["Identifier"] = 8] = "Identifier";
    TokenType[TokenType["StringLiteral"] = 9] = "StringLiteral";
    TokenType[TokenType["Number"] = 10] = "Number";
    TokenType[TokenType["PackageFill"] = 11] = "PackageFill";
    TokenType[TokenType["VehicleFill"] = 12] = "VehicleFill";
    TokenType[TokenType["GlobalFill"] = 13] = "GlobalFill";
    TokenType[TokenType["WindowFill"] = 14] = "WindowFill";
    TokenType[TokenType["ErrorFill"] = 15] = "ErrorFill";
    TokenType[TokenType["Error"] = 16] = "Error";
    TokenType[TokenType["EOF"] = 17] = "EOF";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
//# sourceMappingURL=token.js.map