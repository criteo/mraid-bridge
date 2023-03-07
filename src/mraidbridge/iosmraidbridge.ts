import { MraidBridge } from "./mraidbridge";
import { LogLevel } from "./loglevel";

// #region MessageHandler

declare global {
  interface Window {
    webkit: Webkit;
  }
}

export declare interface Webkit {
  messageHandlers: MessageHandlers;
}

export declare interface MessageHandlers {
  criteoMraidBridge: CriteoMessageHandler;
}

export declare interface CriteoMessageHandler {
  postMessage(params: IosMessage): void;
}

// #endregion

// #region Messages

export declare interface IosMessage {
  action: string;
}

export declare interface LogIosMessage extends IosMessage {
  logLevel: LogLevel;
  message: string;
  logId: string | null;
}

export declare interface OpenIosMessage extends IosMessage {
  url: string;
}

// #endregion

export class IosMraidBridge implements MraidBridge {
  log(logLevel: LogLevel, message: string, logId: string | null): void {
    const logMessage: LogIosMessage = {
      action: "log",
      logLevel,
      message,
      logId,
    };
    this.postMessage(logMessage);
  }

  open(url: string): void {
    const openMessage: OpenIosMessage = {
      action: "open",
      url,
    };
    this.postMessage(openMessage);
  }

  private postMessage(message: IosMessage) {
    window?.webkit?.messageHandlers?.criteoMraidBridge?.postMessage(message);
  }
}
