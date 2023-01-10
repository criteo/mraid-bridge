import { SafeString } from "./utils";

/**
 * API for SDK to communicate with mraid object
 */
export interface SDKApi {
  /**
   * Notify mraid object that script has been loaded into container
   */
  notifyReady(): void;

  /**
   * Notify mraid object about SDK error
   */
  notifyError(message: string, action: SafeString): void;
}
