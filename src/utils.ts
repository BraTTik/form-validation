export const isString = (value: any): value is string => typeof value === "string";

export const isNumber = (value: any): value is number => typeof value === "number" && !isNaN(value);

export const isNotNullable = (value: any) => value !== null && value !== undefined;

export const isNull = (value: any) => value === null || value === undefined;

export const isEmptyString = (value: string) => {
    return value.trim().length === 0;
}

export const isFilledValue = <T>(value: T) => isNotNullable(value) && (isNumber(value) || isString(value) && !isEmptyString(value));

export const isMatches = (value: string, test: string | RegExp): boolean => {
    if (test instanceof RegExp) {
        return test.test(value);
    }
    return value === test;
};
