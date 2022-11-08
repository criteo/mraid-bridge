import mraid from "../src/mraid";

test("getVersion should return 1", () => {
  expect(mraid.getVersion()).toBe("1.0");
});
