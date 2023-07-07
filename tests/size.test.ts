import { Size } from "../src/size";

test("when clone then should return object with same values", () => {
  const size = new Size(222, 333);

  const clonedSize = size.clone();

  expect(clonedSize.width).toBe(size.width);
  expect(clonedSize.height).toBe(size.height);
});

test("when clone then should return different object", () => {
  const size = new Size(222, 333);

  const clonedSize = size.clone();

  expect(size !== clonedSize).toBe(true);
});
