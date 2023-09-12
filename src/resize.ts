// eslint-disable-next-line max-classes-per-file
import { Anything, isNumber } from "./utils";
import { Size } from "./size";
import { Position } from "./position";

export enum ClosePosition {
  TopLeft = "top-left",
  TopRight = "top-right",
  Center = "center",
  BottomLeft = "bottom-left",
  BottomRight = "bottom-right",
  TopCenter = "top-center",
  BottomCenter = "bottom-center",
}

export class ResizeProperties {
  /**
   * Width in density-independent pixels
   */
  width: number | Anything;

  /**
   * Height in density-independent pixels
   */
  height: number | Anything;

  /**
   * Horizontal delta from upper left corner of banner in density-independent pixels
   */
  offsetX: number | Anything;

  /**
   * Vertical delta from upper left corner of banner in density-independent pixels
   */
  offsetY: number | Anything;

  /**
   * Indicates the origin of container supplied close event region relative to
   * resized creative
   */
  customClosePosition: ClosePosition | Anything;

  /**
   * Tells the container whether it should allow the resized
   * creative to be drawn fully/partially offscreen
   */
  allowOffscreen: boolean | Anything;

  constructor(
    width: number | Anything,
    height: number | Anything,
    offsetX: number | Anything,
    offsetY: number | Anything,
    customClosePosition: ClosePosition | Anything = ClosePosition.TopRight,
    allowOffscreen: boolean | Anything = true
  ) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.customClosePosition = customClosePosition;
    this.allowOffscreen = allowOffscreen;
  }

  copy(): ResizeProperties {
    return new ResizeProperties(
      this.width,
      this.height,
      this.offsetX,
      this.offsetY,
      this.customClosePosition,
      this.allowOffscreen
    );
  }
}

export class ResizePropertiesValidator {
  private closeRegionSize = 50;

  private halfCloseRegionSize = this.closeRegionSize / 2;

  /**
   * Defines minimum size of ad which equals to size of close region
   */
  private adMinSize = this.closeRegionSize;

  /**
   * Validates resize properties according to mraid spec
   * @returns string with error message if something is invalid or null
   * if properties are passed correctly
   *
   * @param resizeProperties to validate
   * @param maxSize - current max size that is available to resize to
   * @param currentPosition - current ad position
   */
  validate(
    resizeProperties: ResizeProperties | Anything,
    maxSize: Size,
    currentPosition: Position
  ): string | null {
    if (!resizeProperties) {
      return "Resize properties object is not passed";
    }
    if (Object.keys(resizeProperties).length === 0) {
      return "Resize properties object is empty";
    }

    const widthErrorMessage = this.validateSize(
      resizeProperties.width,
      "width",
      maxSize.width
    );
    if (widthErrorMessage) {
      return widthErrorMessage;
    }

    const heightErrorMessage = this.validateSize(
      resizeProperties.height,
      "height",
      maxSize.height
    );
    if (heightErrorMessage) {
      return heightErrorMessage;
    }

    const offsetXErrorMessage = this.validateOffset(
      resizeProperties.offsetX,
      "offsetX"
    );
    if (offsetXErrorMessage) {
      return offsetXErrorMessage;
    }

    const offsetYErrorMessage = this.validateOffset(
      resizeProperties.offsetY,
      "offsetY"
    );
    if (offsetYErrorMessage) {
      return offsetYErrorMessage;
    }

    const customClosePositionErrorMessage = this.validateCustomClosePosition(
      resizeProperties.customClosePosition
    );
    if (customClosePositionErrorMessage) {
      return customClosePositionErrorMessage;
    }

    const allowOffscreenErrorMessage = this.validateAllowOffscreen(
      resizeProperties.allowOffscreen
    );
    if (allowOffscreenErrorMessage) {
      return allowOffscreenErrorMessage;
    }

    return this.validateCloseButtonPosition(
      resizeProperties,
      maxSize,
      currentPosition
    );
  }

  private joinedClosePosition(): string {
    return `[${Object.values(ClosePosition).join(", ")}]`;
  }

  private validateSize(
    value: number | Anything,
    side: string,
    maxSize: number
  ): string | null {
    if (value || value === 0) {
      if (!isNumber(value)) {
        return `${side} should be valid integer`;
      }
      if (!Number.isFinite(value)) {
        return `${side} should be valid integer`;
      }
      if (value < this.adMinSize) {
        return `${side} should be at least ${this.adMinSize}`;
      }
      if (value > maxSize) {
        return `${side} is bigger than getMaxSize().${side}`;
      }
    } else {
      return `${side} property is required`;
    }
    return null;
  }

  private validateOffset(
    value: number | Anything,
    side: string
  ): string | null {
    if (value || value === 0) {
      if (!isNumber(value)) {
        return `${side} should be valid integer`;
      }
      if (!Number.isFinite(value)) {
        return `${side} should be valid integer`;
      }
    } else {
      return `${side} property is required`;
    }
    return null;
  }

  private validateCustomClosePosition(
    value: ClosePosition | Anything
  ): string | null {
    if (value) {
      if (typeof value === "string") {
        if (!Object.values(ClosePosition).includes(value as ClosePosition)) {
          return `customClosePosition should be one of ${this.joinedClosePosition()}`;
        }
      } else {
        return "customClosePosition should be a string";
      }
    }

    return null;
  }

  private validateAllowOffscreen(value: boolean | Anything) {
    if (value) {
      if (typeof value === "boolean") {
        return null;
      }
      return "allowOffscreen should be boolean";
    }
    return null;
  }

  private isCloseButtonOnScreen(
    closeX: number,
    closeY: number,
    maxSize: Size
  ): boolean {
    return (
      closeX >= 0 &&
      closeX <= maxSize.width - this.closeRegionSize &&
      closeY >= 0 &&
      closeY <= maxSize.height - this.closeRegionSize
    );
  }

  private validateCloseButtonPosition(
    resizeProperties: ResizeProperties | Anything,
    maxSize: Size,
    currentPosition: Position
  ): string | null {
    const newAdX = currentPosition.x + resizeProperties.offsetX;
    const newAdY = currentPosition.y + resizeProperties.offsetY;
    const closeRegionLocation =
      resizeProperties.customClosePosition ?? ClosePosition.TopRight;

    let closeX = 0;
    let closeY = 0;

    switch (closeRegionLocation) {
      case ClosePosition.TopCenter:
        closeX =
          newAdX + (resizeProperties.width / 2 - this.halfCloseRegionSize);
        closeY = newAdY;
        break;
      case ClosePosition.TopRight:
        closeX = newAdX + resizeProperties.width - this.closeRegionSize;
        closeY = newAdY;
        break;
      case ClosePosition.TopLeft:
        closeX = newAdX;
        closeY = newAdY;
        break;
      case ClosePosition.Center:
        closeX =
          newAdX + (resizeProperties.width / 2 - this.halfCloseRegionSize);
        closeY =
          newAdY + (resizeProperties.height / 2 - this.halfCloseRegionSize);
        break;
      case ClosePosition.BottomCenter:
        closeX =
          newAdX + (resizeProperties.width / 2 - this.halfCloseRegionSize);
        closeY = newAdY + resizeProperties.height - this.closeRegionSize;
        break;
      case ClosePosition.BottomRight:
        closeX = newAdX + resizeProperties.width - this.closeRegionSize;
        closeY = newAdY + resizeProperties.height - this.closeRegionSize;
        break;
      case ClosePosition.BottomLeft:
        closeX = newAdX;
        closeY = newAdY + resizeProperties.height - this.closeRegionSize;
        break;
      default:
        break;
    }

    if (this.isCloseButtonOnScreen(closeX, closeY, maxSize)) {
      return null;
    }

    return "Close button will be offscreen";
  }
}
