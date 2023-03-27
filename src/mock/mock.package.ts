import { JSONPackage } from "@partner-core/json-package-types";

export const partner: JSONPackage = {
    _doc: {
        partnerName: "",
        cdkEngineer: "",
        parameters: {
            
        }
    },
    packageAlias: "testy",
    partnerName: "testy",
    packageOptions: {},
    packageProperties: [
        "testy_id",
        "testy_label"
    ],
    customProperties: [],
    lifecycleEvents: {},
    globalScripts: {
        css: [],
        js: [
            {
                alias: "testy-script",
                elType: "ScriptBlock",
                tag: "script",
                attributes: {
                    classList: [
                        "abc",
                        "def"
                    ]
                },
            }
        ]
    },
    components: []
}