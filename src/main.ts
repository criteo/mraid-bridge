import { EventsCoordinator } from "./events";
import { MRAIDImplementation } from "./mraid";
import { MRAIDApi } from "./mraidapi";
import { SDKApi } from "./sdkapi";

export {};

declare global {
  interface Window {
    mraid: MRAIDApi & SDKApi;
  }
}

window.mraid = window.mraid ?? new MRAIDImplementation(new EventsCoordinator());
