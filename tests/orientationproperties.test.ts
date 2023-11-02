import {
  joinedOrientations,
  Orientation,
  OrientationProperties,
} from "../src/orientationproperties";

test("when clone orientation properties should have the same values", () => {
  const orientationProperties = new OrientationProperties(
    true,
    Orientation.Landscape
  );

  const clonedOrientationProperties = orientationProperties.clone();

  expect(orientationProperties).toEqual(clonedOrientationProperties);
});

test("when joinedOrientations() should return correct joined string", () => {
  const orientationsString = joinedOrientations();
  expect(orientationsString).toBe("[portrait, landscape, none]");
});
