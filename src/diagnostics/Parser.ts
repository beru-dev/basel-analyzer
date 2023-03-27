import { Diagnostic, DiagnosticSeverity, Range, Position } from "vscode";
import Scanner from "./Scanner";
import { LinePosition, TokenType } from "./token";

export default class Parser {
    private scanner: Scanner;
    private diagnostics: Diagnostic[] = [];
    private packageProperties: string[] = [];
    constructor(baselPackage: string) {
        this.scanner = new Scanner(baselPackage);
    }

    parse(): Parser {
        if(!this.isNotValidBoilerplate()) return this;

        this.topLevelKeys();

        return this;
    }

    getDiagnostics(): Diagnostic[] {
        return this.diagnostics;
    }

    private isNotValidBoilerplate(): boolean {
        if(
            !this.expectToken("Expected import keyword", TokenType.Identifier, "import")
            || !this.expectToken("Expected '{' token", TokenType.LeftBrace)
            || !this.expectToken("Expected 'JSONPackage'", TokenType.Identifier, "JSONPackage")
            || !this.expectToken("Expected '}' token", TokenType.RightBrace)
            || !this.expectToken("Expected from keyword", TokenType.Identifier, "from")
            || !this.expectToken("Expected '@partner-core/json-package-types'", TokenType.StringLiteral, "@partner-core/json-package-types")
            || !this.expectToken("Expected ';' token", TokenType.Semicolon)
            || !this.expectToken("Expected export token", TokenType.Identifier, "export")
            || !this.expectToken("Expected const token", TokenType.Identifier, "const")
            || !this.expectToken("Expected partner token", TokenType.Identifier, "partner")
            || !this.expectToken("Expected ':' token", TokenType.Colon)
            || !this.expectToken("Expected JSONPackage token", TokenType.Identifier, "JSONPackage")
            || !this.expectToken("Expected '=' token", TokenType.Equals)
            || !this.expectToken("Expected '{' token", TokenType.LeftBrace)
        ) return false;

        return true;
    }

    private topLevelKeys() {
        while(!this.scanner.nextIsEOF()) {
            const token = this.scanner.scan();
            if(token.tokenType === TokenType.RightBrace) return;
            if(token.tokenType !== TokenType.Identifier) continue;

            switch(token.lexeme) {
                case "packageProperties":
                    this.diagnosePackageProperties();
                    break;
                default: continue;
            }
        }
    }

    private diagnosePackageProperties() {
        this.expectToken("Expected ':'", TokenType.Colon);
        this.expectToken("Expected '['", TokenType.LeftBracket);

        while(!this.scanner.nextIsEOF()) {
            const token = this.scanner.scan();

            switch(token.tokenType) {
                case TokenType.StringLiteral: {
                    if(!token.lexeme) throw new Error("Invalid identifier lexeme");

                    if(token.lexeme.length > 22) {
                        this.diagnostics.push({
                                range: new Range(
                                    new Position(token.line_position[0], token.line_position[1]),
                                    new Position(token.line_position[2], token.line_position[3])
                                ),
                                message: `Package property '${token.lexeme}' should be 22 characters or less`,
                                severity: DiagnosticSeverity.Error
                            }
                        );
                    }

                    if(this.checkInvalidChars(token.lexeme)) {
                        this.diagnostics.push({
                                range: new Range(
                                    new Position(token.line_position[0], token.line_position[1]),
                                    new Position(token.line_position[2], token.line_position[3])
                                ),
                                message: `Package property '${token.lexeme}' should only contain lowercase alphanumeric characters and '_'`,
                                severity: DiagnosticSeverity.Error
                            }
                        );
                    }

                    this.packageProperties.push(token.lexeme);

                    continue;
                }
                case TokenType.Comma: continue;
                case TokenType.RightBracket:
                    // if(this.scanner.peek(",")) this.scanner.scan();
                    return;
                default:
                    this.diagnostics.push({
                        range: new Range(
                            new Position(token.line_position[0], token.line_position[1]),
                            new Position(token.line_position[2], token.line_position[3])
                        ),
                        message: "Syntax error in packageProperties array.",
                        severity: DiagnosticSeverity.Error
                    }
                );
            }
        }
    }

    private checkInvalidChars(lexeme: string): boolean {
        return /[^a-z|_|\d]/.test(lexeme);
    }

    private expectToken(message: string, tokenTypeToCheck: TokenType, lexemeToCheck?: string): boolean | LinePosition {
        const { tokenType, lexeme, line_position } = this.scanner.scan();
        const [lineStart, posStart, lineEnd, posEnd] = line_position;

        if(
            tokenType !== tokenTypeToCheck
            || (lexemeToCheck && lexeme !== lexemeToCheck)
        ) {
            this.diagnostics.push({
                message,
                range: new Range(
                    new Position(lineStart, posStart),
                    new Position(lineEnd, posEnd)
                ),
                severity: DiagnosticSeverity.Error
            });

            return false;
        }

        return true;
    }
}