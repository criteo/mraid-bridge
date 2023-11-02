import { MraidBridge } from "./mraidbridge";
import { LogLevel } from "../log/loglevel";
import { ClosePosition } from "../resize";
import { Orientation } from "../orientationproperties";

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

export declare interface ExpandIosMessage extends IosMessage {
  width: number;
  height: number;
}

export type CloseIosMessage = IosMessage;

export declare interface PlayVideoIosMessage extends IosMessage {
  url: string;
}

export declare interface ResizeIosMessage extends IosMessage {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  customClosePosition: string;
  allowOffscreen: boolean;
}

export declare interface SetOrientationPropertiesMessage extends IosMessage {
  allowOrientationChange: boolean;
  forceOrientation: string;
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

  expand(width: number, height: number): void {
    const expandMessage: ExpandIosMessage = {
      action: "expand",
      width,
      height,
    };
    this.postMessage(expandMessage);
  }

  close(): void {
    const closeMessage: CloseIosMessage = {
      action: "close",
    };
    this.postMessage(closeMessage);
  }

  playVideo(url: string): void {
    const playVideoMessage: PlayVideoIosMessage = {
      action: "play_video",
      url,
    };
    this.postMessage(playVideoMessage);
  }

  resize(
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
    customClosePosition: ClosePosition,
    allowOffscreen: boolean
  ): void {
    const resizeMessage: ResizeIosMessage = {
      action: "resize",
      width,
      height,
      offsetX,
      offsetY,
      customClosePosition,
      allowOffscreen,
    };
    this.postMessage(resizeMessage);
  }

  setOrientationProperties(
    allowOrientationChange: boolean,
    forceOrientation: Orientation
  ): void {
    const orientationPropertiesMessage: SetOrientationPropertiesMessage = {
      action: "set_orientation_properties",
      allowOrientationChange,
      forceOrientation,
    };
    this.postMessage(orientationPropertiesMessage);
  }

  private postMessage(message: IosMessage) {
    window?.webkit?.messageHandlers?.criteoMraidBridge?.postMessage(message);
  }
}
