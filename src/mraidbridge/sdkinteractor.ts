import { MraidBridge } from "./mraidbridge";
import { LogLevel } from "./loglevel";

/**
 * Composite which delegates calls to native platforms handlers
 */
export class SdkInteractor {
  private bridges: Array<MraidBridge>;

  constructor(bridges: Array<MraidBridge>) {
    this.bridges = bridges;
  }

  log(logLevel: LogLevel, message: string, logId: string | null = null) {
    this.callForAll((bridge) => {
      bridge.log(logLevel, message, logId);
    });
  }

  open(url: string) {
    this.callForAll((bridge) => {
      bridge.open(url);
    });
  }

  private callForAll(lambda: (mraidBridge: MraidBridge) => void) {
    this.bridges.forEach((bridge) => {
      lambda(bridge);
    });
  }
}
