import { anything, instance, mock, verify } from "ts-mockito";
import { EventsCoordinator } from "../../src/events";
import { SdkInteractor } from "../../src/mraidbridge/sdkinteractor";
import { Logger } from "../../src/log/logger";
import { LogLevel } from "../../src/log/loglevel";

let eventsCoordinator: EventsCoordinator;
let sdkInteractor: SdkInteractor;

let logger: Logger;

beforeEach(() => {
  sdkInteractor = mock(SdkInteractor);
  eventsCoordinator = mock(EventsCoordinator);
  logger = new Logger(instance(eventsCoordinator), instance(sdkInteractor));
});

it.each([LogLevel.Warning, LogLevel.Info, LogLevel.Debug])(
  "when log should log only to sdkInteractor",
  (logLevel: LogLevel) => {
    const method = "method()";
    const message = "message";

    logger.log(logLevel, method, message);

    verify(sdkInteractor.log(logLevel, "method(), message")).once();
    verify(eventsCoordinator.fireErrorEvent(anything(), anything())).never();
  }
);

test("when log error should log to sdkInteractor and fire error event", () => {
  const method = "method()";
  const message = "message";

  logger.log(LogLevel.Error, method, message);

  verify(sdkInteractor.log(LogLevel.Error, "method(), message")).once();
  verify(eventsCoordinator.fireErrorEvent(message, method)).once();
});
