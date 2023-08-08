import { Position } from "../src/position";

test("when clone then should return object with same values", () => {
  const position = new Position(12, 13, 222, 333);

  const clonedPosition = position.clone();

  expect(clonedPosition.x).toBe(position.x);
  expect(clonedPosition.y).toBe(position.y);
  expect(clonedPosition.width).toBe(position.width);
  expect(clonedPosition.height).toBe(position.height);
});

test("when clone then should return different object", () => {
  const position = new Position(12, 13, 222, 333);

  const clonedPosition = position.clone();

  expect(position !== clonedPosition).toBe(true);
});
