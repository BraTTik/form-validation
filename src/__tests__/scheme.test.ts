import { Scheme } from "../scheme";
import {string} from "../string-unit";

describe("Scheme tests", () => {

    describe("string tests", () => {
        const scheme = new Scheme<{ str: string }>({ str: string() })

        it("tests string type", () => {
            const value = { str: "value" };
            expect(scheme.validate(value)).toEqual({ hasError: false, errors: {} });
        })
    })
});
