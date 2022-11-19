import { Scheme } from "../scheme";
import { string } from "../string-unit";
import { number } from "../number-unit";

const isValid = () => ({ hasError: false, errors: {}})

describe("Scheme tests", () => {

    describe("type tests", () => {
        it("tests type types", () => {
            const scheme = new Scheme<{ str: string; num: number }>({ str: string(), num: number() })
            const value = { str: "", num: 0 };
            const wrong = { str: 0, num: "" };
            expect(scheme.validate(value)).resolves.toEqual({ hasError: false, errors: {} });
            // @ts-ignore
            expect(scheme.validate(wrong)).resolves.toEqual({ hasError: true, errors: { str: "Not a string", num: "Not a number"}})
        });

        it("passes nullable values", () => {
            const scheme = new Scheme<{ str: string | null; num: number | null }>({ str: string().nullable(), num: number().nullable() });
            const values = { str: null, num: null };

            expect(scheme.validate(values)).resolves.toEqual({ hasError: false, errors: {} });
        });

        it("doesn't pass nullable values if required", () => {
            const required = "Required"
            const scheme = new Scheme<{ str: string | null; num: number | null }>({ str: string().isRequired(required).nullable(), num: number().isRequired(required).nullable() });
            const values = { str: null, num: null };

            expect(scheme.validate(values)).resolves.toEqual({ hasError: true, errors: { str: required, num: required }});
        });
    })

    describe("Scheme throws error on non object type", () => {
        it("Scheme throws error on non object type", () => {
            const scheme = new Scheme({});

            // @ts-ignore
            expect(() => scheme.validate("string")).rejects.toThrow();
            expect( () => scheme.validate(null)).rejects.toThrow();
            // @ts-ignore
            expect( () => scheme.validate(10)).rejects.toThrow();
            // @ts-ignore
            expect( () => scheme.validate(true)).rejects.toThrow();

        })
    })

    describe("Scheme conditional tests", () => {
        const valid = { truthy: true, falsy: false, test: "", test2: "test2" };
        const notValid = { truthy: true, falsy: false, test: "Test", test2: "" };
        const error = "Error"

        it("Scheme checks condition if truthy", () => {
            const scheme = new Scheme<typeof valid>({ test: string() })
                .if([
                    {
                        condition: ({ truthy }) => Boolean(truthy),
                        scheme: { test: string().isRequired(error) }
                    },
                ]);

            expect(scheme.validate(valid)).resolves.toEqual({ hasError: true, errors: { test: error }});
        })

        it("Scheme doesn't check condition if falsy", () => {
            const scheme = new Scheme<typeof valid>({ test: string() })
                .if([
                    {
                        condition: ({ falsy }) => Boolean(falsy),
                        scheme: { test: string().isRequired(error) }
                    },
                ])

            expect(scheme.validate(valid)).resolves.toEqual(isValid());
        })

        it("Scheme works with several conditions", () => {
            const scheme = new Scheme<typeof valid>({ test: string() })
                .if([
                    {
                        condition: false,
                        scheme: { test: string().isRequired(error) }
                    },
                    {
                        condition: true,
                        scheme: { test2: string().isRequired(error) }
                    }
                ])

            expect(scheme.validate(valid)).resolves.toEqual(isValid());
            expect(scheme.validate(notValid)).resolves.toEqual({ hasError: true, errors: { test2: error }});
        })
    })
});
