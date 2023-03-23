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
    window?.criteoMraidBridge?.log(logLevel, message, logId);
  }

  open(url: string): void {
    window?.criteoMraidBridge?.open(url);
  }

  expand(width: number, height: number): void {
    window?.criteoMraidBridge?.expand(width, height);
  }

  close(): void {
    window?.criteoMraidBridge?.close();
  }
}
