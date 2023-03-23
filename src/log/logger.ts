import { EventsCoordinator } from "../events";
import { SdkInteractor } from "../mraidbridge/sdkinteractor";
import { LogLevel } from "./loglevel";

export class Logger {
  private eventsCoordinator: EventsCoordinator;

  private sdkInteractor: SdkInteractor;

  constructor(
    eventsCoordinator: EventsCoordinator,
    sdkInteractor: SdkInteractor
  ) {
    this.eventsCoordinator = eventsCoordinator;
    this.sdkInteractor = sdkInteractor;
  }

  log(logLevel: LogLevel, method: string, message: string) {
    this.sdkInteractor.log(logLevel, `${method}, ${message}`);
    if (logLevel === LogLevel.Error) {
      this.eventsCoordinator.fireErrorEvent(message, method);
    }
  }
}
