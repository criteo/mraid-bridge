import { EventsCoordinator } from "./events";
import { MRAIDImplementation } from "./mraid";
import { MRAIDApi } from "./mraidapi";
import { SDKApi } from "./sdkapi";
import { IosMraidBridge } from "./mraidbridge/iosmraidbridge";
import { AndroidMraidBridge } from "./mraidbridge/androidmraidbridge";
import { SdkInteractor } from "./mraidbridge/sdkinteractor";
import { Logger } from "./log/logger";

export {};

declare global {
  interface Window {
    mraid: MRAIDApi & SDKApi;
  }
}

const sdkInteractor = new SdkInteractor([
  new IosMraidBridge(),
  new AndroidMraidBridge(),
]);
const eventsCoordinator = new EventsCoordinator();
const logger = new Logger(eventsCoordinator, sdkInteractor);

window.mraid =
  window.mraid ??
  new MRAIDImplementation(eventsCoordinator, sdkInteractor, logger);
