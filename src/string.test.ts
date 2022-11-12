import { string } from "./string-unit";


const isValid = () => ({ hasError: false, error: null })
const notValid = (error: string ) => ({ hasError: true, error });

describe("String tests", () => {
    it ("checks is string", () => {
        const str = string()
        expect(str.validate("")).toEqual(isValid());
        expect(str.validate(0)).toEqual(notValid("Not a string"));
    })

    it("string is required", () => {
        const str = string().isRequired("String required");

        expect(str.validate("")).toEqual(notValid("String required"));
        expect(str.validate("value")).toEqual(isValid());
    })

    it("string can be nullable", () => {
        const str = string().nullable();
        expect(str.validate(null)).toEqual(isValid());
        expect(str.validate(undefined)).toEqual(isValid());
        expect(str.validate("")).toEqual(isValid());
    })

    it("string matches", () => {
        const str = string().isMatches(/test/, "Wrong Format");
        expect(str.validate("test")).toEqual(isValid());
        expect(str.validate("tesx")).toEqual(notValid("Wrong Format"));
    })

    it("string checks matches only is filled", () => {
        const str = string().nullable().isMatches(/test/, "Wrong Format");
        expect(str.validate("")).toEqual(isValid());
        expect(str.validate("test")).toEqual(isValid());
    })
})
