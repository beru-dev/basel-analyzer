"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = __importDefault(require("../../src/diagnostics/Parser"));
// import { Token, TokenType } from "../../src/diagnostics/token";
// import fs from "fs";
// import path from "path";
// const mockPackage = (fs.readFileSync(path.join(__dirname + "../../../src/mock/mock.package.ts"))).toString();
describe("Parser", () => {
    it("should return an empty array if no errors are found", () => {
        const baselPackage = `import { JSONPackage } from "@partner-core/json-package-types";

export const partner: JSONPackage = {}`;
        const parser = new Parser_1.default(baselPackage).parse();
        expect(parser.getDiagnostics()).toEqual([]);
    });
    it("should recognize errors in the import statement", () => {
        const parser = new Parser_1.default(`import { JSONPackage } from "wrong";`).parse();
        expect(parser.getDiagnostics()).toEqual([{
                message: "Expected '@partner-core/json-package-types'",
                range: {
                    end: {
                        line: 0,
                        position: 34,
                    },
                    start: {
                        line: 0,
                        position: 29,
                    },
                },
                severity: 0,
            }]);
    });
    it("should recognize errors in packageProperties", () => {
        const baselPackage = `import { JSONPackage } from "@partner-core/json-package-types";

export const partner: JSONPackage = {
    packageProperties: [
        "testy_way_too_long_to_fit_in_properties",
        "testyInvalidChars"
    ]
}`;
        const parser = new Parser_1.default(baselPackage).parse();
        expect(parser.getDiagnostics()).toEqual([
            {
                message: "Package property 'testy_way_too_long_to_fit_in_properties' should be 22 characters or less",
                range: {
                    start: {
                        line: 4,
                        position: 9,
                    },
                    end: {
                        line: 4,
                        position: 48,
                    }
                },
                severity: 0,
            },
            {
                message: "Package property 'testyInvalidChars' should only contain lowercase alphanumeric characters and '_'",
                range: {
                    start: {
                        line: 5,
                        position: 9,
                    },
                    end: {
                        line: 5,
                        position: 26,
                    }
                },
                severity: 0,
            }
        ]);
    });
});
//# sourceMappingURL=Parser.spec.js.map