import { Anything } from "./utils";
import { ExpandProperties } from "./expand";

export enum Orientation {
  Portrait = "portrait",
  Landscape = "landscape",
  None = "none",
}

export class OrientationProperties {
  allowOrientationChange: boolean | Anything;

  forceOrientation: Orientation | Anything;

  constructor(allowOrientationChange: boolean, forceOrientation: Orientation) {
    this.allowOrientationChange = allowOrientationChange;
    this.forceOrientation = forceOrientation;
  }

  clone(): OrientationProperties {
    return new OrientationProperties(
      this.allowOrientationChange,
      this.forceOrientation
    );
  }
}

export const defaultOrientationProperties = new OrientationProperties(
  true,
  Orientation.None
);

export function joinedOrientations(): string {
  return `[${Object.values(Orientation).join(", ")}]`;
}

export function validateOrientationProperties(
  orientationProperties: OrientationProperties | Anything
): string | null {
  if (!orientationProperties) {
    return "Orientation properties object is not passed";
  }
  if (Object.keys(orientationProperties).length === 0) {
    return "Orientation properties object is empty";
  }
  let hasAnyProperty = false;
  Object.keys(defaultOrientationProperties).forEach((property) => {
    if (Object.prototype.hasOwnProperty.call(orientationProperties, property)) {
      hasAnyProperty = true;
    }
  });
  if (!hasAnyProperty) {
    return "The orientation properties object does not contain the 'allowOrientationChange' or 'forceOrientation' properties";
  }

  const { allowOrientationChange, forceOrientation } = orientationProperties;

  if (allowOrientationChange) {
    if (typeof allowOrientationChange !== "boolean") {
      return "'allowOrientationChange' should be boolean";
    }
  }

  if (forceOrientation) {
    if (Object.values(Orientation).includes(forceOrientation)) {
      return null;
    }
    return `'forceOrientation' should be one of ${joinedOrientations()}`;
  }
  return null;
}
