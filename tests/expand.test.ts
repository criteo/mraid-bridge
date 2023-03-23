import { isValidExpandPropertiesObject } from "../src/expand";

describe("when call isValidExpandPropertiesObject", () => {
  it.each([true, false, 134, NaN, { name: "string" }, () => {}])(
    "with %p should return false",
    (param) => {
      expect(isValidExpandPropertiesObject(param)).toBe(false);
    }
  );

  it.each([
    {},
    { width: 1 },
    { height: 1 },
    { useCustomClose: true },
    { isModal: true },
    { width: 1, height: 1, useCustomClose: false, isModal: true },
  ])("with %p should return true", (param) => {
    expect(isValidExpandPropertiesObject(param)).toBe(true);
  });
});
