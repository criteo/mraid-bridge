import { isFunction } from "../src/utils";

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
