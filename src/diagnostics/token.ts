export class Token {
    tokenType: TokenType
    lexeme: string | null
    line_position: LinePosition
    constructor(tokenType: TokenType, lexeme: string | null, line_position: LinePosition) {
        this.tokenType = tokenType;
        this.lexeme = lexeme;
        this.line_position = line_position;
    }
}

export enum TokenType {
    LeftBrace,
    RightBrace,
    LeftBracket,
    RightBracket,
    Equals,
    Comma,
    Colon,
    Semicolon,
    Identifier,
    StringLiteral,
    Number,
    PackageFill,
    VehicleFill,
    GlobalFill,
    WindowFill,
    ErrorFill,
    Error,
    EOF
}

export type LinePosition = [number, number, number, number];