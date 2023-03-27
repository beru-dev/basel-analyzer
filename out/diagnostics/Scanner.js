"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("./token");
class Scanner {
    constructor(baselPackage) {
        this.start = 0;
        this.current = 0;
        this.line = 0;
        this.breakIndex = 0;
        this.baselPackage = baselPackage;
    }
    scan() {
        while (this.current < this.baselPackage.length) {
            this.start = this.current;
            const line_position = [
                this.line,
                this.current - this.breakIndex,
                this.line,
                this.current - this.breakIndex + 1
            ];
            const char = this.baselPackage[this.current];
            switch (char) {
                case '{': return this.buildTokenAndIncrementIndex(token_1.TokenType.LeftBrace, null, line_position);
                case '}': return this.buildTokenAndIncrementIndex(token_1.TokenType.RightBrace, null, line_position);
                case '[': return this.buildTokenAndIncrementIndex(token_1.TokenType.LeftBracket, null, line_position);
                case ']': return this.buildTokenAndIncrementIndex(token_1.TokenType.RightBracket, null, line_position);
                case '=': return this.buildTokenAndIncrementIndex(token_1.TokenType.Equals, null, line_position);
                case ',': return this.buildTokenAndIncrementIndex(token_1.TokenType.Comma, null, line_position);
                case ':': return this.buildTokenAndIncrementIndex(token_1.TokenType.Colon, null, line_position);
                case ';': return this.buildTokenAndIncrementIndex(token_1.TokenType.Semicolon, null, line_position);
                case '"':
                case '\'':
                    return this.string(char);
                case ' ':
                case '\r':
                case '\t':
                    this.current++;
                    return this.scan();
                case '\n':
                    this.current++;
                    this.line++;
                    this.breakIndex = this.current;
                    return this.scan();
                // case '\n': 
                //     this.line += 1;
                //     this.breakIndex = this.current + 1;
                //     return this.scan()
                case '@': return this.autofill();
                default: return this.other(char);
            }
        }
        return new token_1.Token(token_1.TokenType.EOF, null, [0, 0, 0, 0]);
    }
    nextIsEOF() {
        return !Boolean(this.baselPackage[this.current + 1]);
    }
    peek(char) {
        return this.baselPackage[this.current + 1] === char;
    }
    buildTokenAndIncrementIndex(type, lexeme, linePosition) {
        this.current++;
        return new token_1.Token(type, lexeme, linePosition);
    }
    string(quoteType) {
        this.start++;
        this.current = this.start;
        const lineStart = this.line;
        const lineStartOffset = this.start - this.breakIndex;
        for (; this.current < this.baselPackage.length; this.current++) {
            const char = this.baselPackage[this.current];
            if (char === "\n") {
                this.line++;
                this.breakIndex = this.current + 1;
            }
            if (char === quoteType) {
                const string = new token_1.Token(token_1.TokenType.StringLiteral, this.baselPackage.slice(this.start, this.current), [lineStart, lineStartOffset, this.line, this.current - this.breakIndex]);
                this.current++;
                return string;
            }
        }
        return new token_1.Token(token_1.TokenType.Error, this.baselPackage.slice(this.start + 1, this.baselPackage.length - 1), [lineStart, lineStartOffset, this.line, this.baselPackage.length - this.breakIndex]);
    }
    autofill() {
        return new token_1.Token(token_1.TokenType.Identifier, null, [0, 0, 0, 0]);
    }
    other(char) {
        if (this.is_digit(char)) {
            return this.number();
        }
        if (this.is_alpha(char)) {
            return this.identifier();
        }
        ;
        throw new Error("Scan: Syntax error");
    }
    is_alpha(c) {
        return (c >= 'a' && c <= 'z')
            || (c >= 'A' && c <= 'Z')
            || c == '_';
    }
    is_digit(c) {
        return c >= '0' && c <= '9';
    }
    number() {
        const [line_start, line_start_offset] = this.get_line_position();
        while (this.current < this.baselPackage.length) {
            const char = this.baselPackage[this.current + 1];
            if (char && this.is_digit(char)) {
                this.current++;
                continue;
            }
            return new token_1.Token(token_1.TokenType.Number, this.baselPackage.substring(this.start, this.current + 1), [
                line_start,
                line_start_offset,
                this.line,
                this.current - this.breakIndex
            ]);
        }
        throw new Error("Unterminated number");
    }
    identifier() {
        const [line_start, line_start_offset] = this.get_line_position();
        while (this.current < this.baselPackage.length) {
            const char = this.baselPackage[this.current + 1];
            if (this.is_alphanumeric(char)) {
                this.current++;
                continue;
            }
            this.current++;
            return new token_1.Token(token_1.TokenType.Identifier, this.baselPackage.substring(this.start, this.current), [
                line_start,
                line_start_offset,
                this.line,
                this.current - this.breakIndex
            ]);
        }
        throw new Error("Unterminated number");
    }
    get_line_position() {
        return [this.line, this.current - this.breakIndex];
    }
    is_alphanumeric(c) {
        return this.is_alpha(c) || this.is_digit(c);
    }
}
exports.default = Scanner;
//# sourceMappingURL=Scanner.js.map