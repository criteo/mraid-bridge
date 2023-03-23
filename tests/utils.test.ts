import { isFunction, isNumber } from "../src/utils";

function dummyFunction(param1: string, param2: any) {
  console.log("Doing important thing");
}

describe("when call isFunction", () => {
  test("with anonymous function parameter should return true", () => {
    expect(isFunction(() => {})).toBe(true);
  });

  test("with local function parameter should return true", () => {
    expect(isFunction(dummyFunction)).toBe(true);
  });

  it.each(["string", true, {}])(
    "with not a function should return false",
    (param: any) => {
      expect(isFunction(param)).toBe(false);
    }
  );
});

describe("when call isNumber", () => {
  it.each([-123, 0, 23456, NaN, Infinity, -Infinity])(
    "with %p should return true",
    (number) => {
      expect(isNumber(number)).toBe(true);
    }
  );

  it.each(["string", true, new Set(), {}, dummyFunction])(
    "with %p should return false",
    (param) => {
      expect(isNumber(param)).toBe(false);
    }
  );
});
