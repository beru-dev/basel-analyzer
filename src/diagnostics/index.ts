// import { Diagnostic, DiagnosticSeverity, Range, Position } from "vscode";

// export default (baselPackage: string): Diagnostic[] => {

//     baselPackage = "temp";

//     return [
//         {
//             message: "property error",
//             range: new Range(
//                 new Position(15, 9),
//                 new Position(15, 20)
//             ),
//             severity: DiagnosticSeverity.Error
//         }
//     ]
// }

import { Diagnostic } from "vscode";
import Parser from "./Parser";

export default (baselPackage: string): Diagnostic[] => {
    const parsed = new Parser(baselPackage).parse();

    return parsed.getDiagnostics();
}