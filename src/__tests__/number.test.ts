import { number } from "../number-unit";

const isValid = () => ({ hasError: false, error: null })
const notValid = (error: string) => ({ hasError: true, error });

describe("NumberUnit tests", () => {
    it("NumberUnit validate number value", () => {
        const num = number();

        expect(num.validate(0)).toEqual(isValid());
        expect(num.validate("0")).toEqual(notValid("Not a number"));
        expect(num.validate(null)).toEqual(notValid("Not a number"));
        expect(num.validate(undefined)).toEqual(notValid("Not a number"));
        expect(num.validate({})).toEqual(notValid("Not a number"));
        expect(num.validate(false)).toEqual(notValid("Not a number"));
    })

    it("NumberUnit passes validation if nullable", () => {
        const typeError = "Number"
        const num = number(typeError).nullable();

        expect(num.validate(1)).toEqual(isValid());
        expect(num.validate(null)).toEqual(isValid());
        expect(num.validate(undefined)).toEqual(isValid());
        expect(num.validate(false)).toEqual(notValid(typeError));
    })

    it("NumberUnit fails validation for nullable if required", () => {
        const num = number().nullable().isRequired("Required");

        expect(num.validate(0)).toEqual(isValid());
        expect(num.validate(null)).toEqual(notValid("Required"));
        expect(num.validate(undefined)).toEqual(notValid("Required"));
    })

    it("NubmerUnit checks min value", () => {
        const error = "Minimum exceeds"
        const num = number().min(12, error);

        expect(num.validate(2)).toEqual(notValid(error));
        expect(num.validate(11)).toEqual(notValid(error));
        expect(num.validate(12)).toEqual(isValid());
        expect(num.validate(13)).toEqual(isValid());
    })

    it ("NumberUnit checks max value", () => {
        const error = "Maximum exceeds"
        const num = number().max(12, error);

        expect(num.validate(11)).toEqual(isValid());
        expect(num.validate(12)).toEqual(isValid());
        expect(num.validate(13)).toEqual(notValid(error));

    })
})
