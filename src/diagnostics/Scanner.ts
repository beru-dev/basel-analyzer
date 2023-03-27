import { Token, TokenType, LinePosition } from "./token";

export default class Scanner {
    private baselPackage: string
    private start = 0;
    private current = 0;
    private line = 0;
    private breakIndex = 0;
    constructor(baselPackage: string) {
        this.baselPackage = baselPackage;
    }

    scan(): Token {
        while(this.current < this.baselPackage.length) {
            this.start = this.current;
            const line_position: LinePosition = [
                this.line,
                this.current - this.breakIndex,
                this.line,
                this.current - this.breakIndex + 1
            ];
            const char = this.baselPackage[this.current];

            switch(char) {
                case '{': return this.buildTokenAndIncrementIndex(TokenType.LeftBrace, null, line_position);
                case '}': return this.buildTokenAndIncrementIndex(TokenType.RightBrace, null, line_position);
                case '[': return this.buildTokenAndIncrementIndex(TokenType.LeftBracket, null, line_position);
                case ']': return this.buildTokenAndIncrementIndex(TokenType.RightBracket, null, line_position);
                case '=': return this.buildTokenAndIncrementIndex(TokenType.Equals, null, line_position);
                case ',': return this.buildTokenAndIncrementIndex(TokenType.Comma, null, line_position);
                case ':': return this.buildTokenAndIncrementIndex(TokenType.Colon, null, line_position);
                case ';': return this.buildTokenAndIncrementIndex(TokenType.Semicolon, null, line_position);
                case '"':
                case '\'':
                    return this.string(char)
                case ' ':
                case '\r':
                case '\t':
                    this.current++;
                    return this.scan()
                case '\n':
                    this.current++;
                    this.line++;
                    this.breakIndex = this.current;
                    return this.scan()
                // case '\n': 
                //     this.line += 1;
                //     this.breakIndex = this.current + 1;
                //     return this.scan()
                case '@': return this.autofill()
                default: return this.other(char)
            }
        }

        return new Token(TokenType.EOF, null, [0, 0, 0, 0])
    }

    nextIsEOF(): boolean {
        return !Boolean(this.baselPackage[this.current + 1]);
    }

    peek(char: string): boolean {
        return this.baselPackage[this.current + 1] === char
    }

    private buildTokenAndIncrementIndex(type: TokenType, lexeme: string | null, linePosition: [number, number, number, number]): Token {
        this.current++;
        return new Token(type, lexeme, linePosition);
    }

    private string(quoteType: string): Token {
        this.start++;
        this.current = this.start;
        const lineStart = this.line;
        const lineStartOffset = this.start - this.breakIndex;

        for(; this.current < this.baselPackage.length; this.current++) {
            const char = this.baselPackage[this.current];

            if(char === "\n") {
                this.line++;
                this.breakIndex = this.current + 1;
            }

            if(char === quoteType) {
                const string = new Token(
                    TokenType.StringLiteral,
                    this.baselPackage.slice(this.start, this.current),
                    [lineStart, lineStartOffset, this.line, this.current - this.breakIndex]
                );

                this.current++;

                return string;
            }
        }

        return new Token(
            TokenType.Error,
            this.baselPackage.slice(this.start + 1, this.baselPackage.length - 1),
            [lineStart, lineStartOffset, this.line, this.baselPackage.length - this.breakIndex]
        );
    }

    private autofill(): Token {
        return new Token(TokenType.Identifier, null, [0,0,0,0])
    }

    private other(char: string): Token {
        if (this.is_digit(char)) {
            return this.number();
        }
        if (this.is_alpha(char)) {
            return this.identifier();
        };

        throw new Error("Scan: Syntax error");
    }
    
    private is_alpha(c: string): boolean {
        return (c >= 'a' && c <= 'z')
        || (c >= 'A' && c <= 'Z')
        || c == '_'
    }

    private is_digit(c: string): boolean {
        return c >= '0' && c <= '9'
    }

    private number(): Token {
        const [line_start, line_start_offset] = this.get_line_position();

        while(this.current < this.baselPackage.length) {
            const char = this.baselPackage[this.current + 1];
            
            if (char && this.is_digit(char)) {
                this.current++;

                continue
            }

            return new Token(
                TokenType.Number,
                this.baselPackage.substring(this.start, this.current + 1),
                [
                    line_start,
                    line_start_offset,
                    this.line,
                    this.current - this.breakIndex
                ]
            );
        }

        throw new Error("Unterminated number");
    }

    private identifier(): Token {
        const [line_start, line_start_offset] = this.get_line_position();

        while(this.current < this.baselPackage.length) {
            const char = this.baselPackage[this.current + 1];
            if (this.is_alphanumeric(char)) {
                this.current++;
                
                continue
            }

            this.current++;

            return new Token(
                TokenType.Identifier,
                this.baselPackage.substring(this.start, this.current),
                [
                    line_start,
                    line_start_offset,
                    this.line,
                    this.current - this.breakIndex
                ]
            );
        }

        throw new Error("Unterminated number");
    }

    private get_line_position(): [number, number] {
        return [this.line, this.current - this.breakIndex];
    }

    private is_alphanumeric(c: string): boolean {
        return this.is_alpha(c) || this.is_digit(c);
    }
}