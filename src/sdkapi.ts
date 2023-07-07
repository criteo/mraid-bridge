import { MraidPlacementType } from "./placement";
import { SafeString } from "./utils";

/**
 * API for SDK to communicate with mraid object
 */
export interface SDKApi {
  /**
   * Notify mraid object that script has been loaded into container
   *
   * @param placementType - Ad placement inside app
   */
  notifyReady(placementType: MraidPlacementType): void;

  /**
   * Notify mraid object about SDK error
   */
  notifyError(message: string, action: SafeString): void;

  /**
   * Report mraid object about currentViewability/viewabilityChange
   *
   * @param isViewable
   * "true" -> ad is currently visible
   * "false" -> ad is off-screen
   */
  setIsViewable(isViewable: boolean): void;

  /**
   * Report mraid object about max available size ad can expand to
   *
   * SDK should report this before invoking {@link notifyReady} and
   * every time max available size changes(orientation change, app resize etc.)
   *
   * @param width in density-independent pixels
   * @param height in density-independent pixels
   * @param pixelMultiplier multiplier to calculate pixel dimension
   * widthInPixels = width * pixelMultiplier
   */
  setMaxSize(width: number, height: number, pixelMultiplier: number): void;

  /**
   * Report mraid object about screen size of a device. This includes
   * area reserved by system (status bars, navigation bars etc.).
   * Screen size will change if device is turned from portrait to
   * landscape.
   *
   * SDK should report this before invoking {@link notifyReady}.
   *
   * @param width in density-independent pixels
   * @param height in density-independent pixels
   */
  setScreenSize(width: number, height: number): void;

  /**
   * Report mraid object about successful expand
   */
  notifyExpanded(): void;

  /**
   * Report mraid object about successful close
   */
  notifyClosed(): void;
}
