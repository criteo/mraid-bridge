import { Anything } from "./utils";

export class ExpandProperties {
  /**
   * Width of creative in pixels, default is full screen width
   */
  width: number | Anything;

  /**
   * Height of creative in pixels, default is full screen height
   */
  height: number | Anything;

  /**
   * true, SDK will stop showing default close graphic and rely on ad creative’s custom close indicator.
   * false (default), SDK will display the default close graphic.
   *
   * Not supported by SDK and always returns false
   */
  useCustomClose: boolean | Anything = false;

  /**
   * true, the SDK is providing a modal container for the expanded ad.
   * false, the SDK is not providing a modal container for the expanded ad.
   *
   * It is read-only and always equals to true
   */
  isModal: boolean | Anything = true;

  constructor(width: number | Anything, height: number | Anything) {
    this.width = width;
    this.height = height;
  }
}

export function isValidExpandPropertiesObject(
  properties: ExpandProperties | Anything
) {
  if (properties == null) return false;
  if (typeof properties !== "object") return false;

  let hasAnyProperty = false;

  Object.keys(new ExpandProperties(0, 0)).forEach((property) => {
    if (Object.prototype.hasOwnProperty.call(properties, property)) {
      hasAnyProperty = true;
    }
  });

  return Object.keys(properties).length === 0 || hasAnyProperty;
}

/**
 * Value that indicates to use default expand properties size (max available size)
 */
export const defaultPropertiesValue = -1;
