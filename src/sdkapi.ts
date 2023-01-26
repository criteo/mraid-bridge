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
   * "false" -> ad is off screen
   */
  setIsViewable(isViewable: boolean): void;
}
