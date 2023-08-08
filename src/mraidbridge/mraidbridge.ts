import { LogLevel } from "../log/loglevel";

/**
 * Defines API for interaction with native platforms (iOS and Android)
 * It is needed since interaction way and message format is different
 */
export interface MraidBridge {
  log(logLevel: LogLevel, message: string, logId: string | null): void;
  open(url: string): void;
  expand(width: number, height: number): void;
  close(): void;
  playVideo(url: string): void;
}
