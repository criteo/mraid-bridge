import { MraidBridge } from "./mraidbridge";
import { LogLevel } from "../log/loglevel";

/**
 * Interaction object is defined in global scope (window) so we are using
 * name with criteo prefix
 */
declare global {
  interface Window {
    criteoMraidBridge?: CriteoInterface | null;
  }
}

/**
 * On Android method with same signature will be called when it is registered
 * on WebView
 * Supported Android types:
 * - String
 * - int
 * - float
 * - String[]
 * - int[]
 * - float[]
 */
export declare interface CriteoInterface {
  log(logLevel: LogLevel, message: string, logId: string | null): void;
  open(url: string): void;
  expand(width: number, height: number): void;
  close(): void;
}

export class AndroidMraidBridge implements MraidBridge {
  log(logLevel: LogLevel, message: string, logId: string | null): void {
    this.getMraidBridge()?.log(logLevel, message, logId);
  }

  open(url: string): void {
    this.getMraidBridge()?.open(url);
  }

  expand(width: number, height: number): void {
    this.getMraidBridge()?.expand(width, height);
  }

  close(): void {
    this.getMraidBridge()?.close();
  }

  private getMraidBridge(): CriteoInterface | undefined | null {
    // criteoMraidBridge object is not injected into iframe on Android
    // but doc says it should be. It is always available on topmost window
    return window?.criteoMraidBridge ?? window?.top?.criteoMraidBridge;
  }
}
