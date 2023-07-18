import { EventsCoordinator } from "./events";
import { MRAIDImplementation } from "./mraid";
import { IosMraidBridge } from "./mraidbridge/iosmraidbridge";
import { AndroidMraidBridge } from "./mraidbridge/androidmraidbridge";
import { SdkInteractor } from "./mraidbridge/sdkinteractor";
import { Logger } from "./log/logger";
import {} from "./mraidwindow";

export {};

const sdkInteractor = new SdkInteractor([
  new IosMraidBridge(),
  new AndroidMraidBridge(),
]);
const eventsCoordinator = new EventsCoordinator();
const logger = new Logger(eventsCoordinator, sdkInteractor);

window.mraid =
  window.mraid ??
  new MRAIDImplementation(eventsCoordinator, sdkInteractor, logger);
