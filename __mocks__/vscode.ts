export enum DiagnosticSeverity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}

export type Diagnostic = {
    message: string
    severity: DiagnosticSeverity
    range: Range
}

export class Range {
    start: Position;
    end: Position;
    constructor(start: Position, end: Position) {
        this.start = start;
        this.end = end;
    }
}

export class Position {
    line: number;
    position: number;
    constructor(line: number, position: number) {
        this.line = line;
        this.position = position;
    }
}