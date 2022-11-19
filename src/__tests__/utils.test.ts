import {isFilledValue} from "../utils";

describe("utils tests", () => {
    it("isFilledValue works correctly", () => {
        expect(isFilledValue(0)).toBe(true);
    })
})
