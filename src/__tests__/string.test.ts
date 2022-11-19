import { string } from "../string-unit";


const isValid = () => ({ hasError: false, error: null })
const notValid = (error: string ) => ({ hasError: true, error });

describe("String tests", () => {
    it ("checks is string", () => {
        const str = string()
        expect(str.validate("")).resolves.toEqual(isValid());
        expect(str.validate(0)).resolves.toEqual(notValid("Not a string"));
    })

    it("string is required", () => {
        const str = string().nullable().isRequired("String required");

        expect(str.validate("")).resolves.toEqual(notValid("String required"));
        expect(str.validate("value")).resolves.toEqual(isValid());
        expect(str.validate(null)).resolves.toEqual(notValid("String required"));
        expect(str.validate(undefined)).resolves.toEqual(notValid("String required"));
    })

    it("string can be nullable", () => {
        const str = string().nullable();
        expect(str.validate(null)).resolves.toEqual(isValid());
        expect(str.validate(undefined)).resolves.toEqual(isValid());
        expect(str.validate("")).resolves.toEqual(isValid());
    })

    it("string matches", () => {
        const str = string().isMatches(/test/, "Wrong Format");
        expect(str.validate("test")).resolves.toEqual(isValid());
        expect(str.validate("tesx")).resolves.toEqual(notValid("Wrong Format"));
    })

    it("string checks optional value matches only is filled", () => {
        const str = string().optional().isMatches(/test/, "Wrong Format");
        expect(str.validate("")).resolves.toEqual(isValid());
        expect(str.validate("test")).resolves.toEqual(isValid());
    })
})
