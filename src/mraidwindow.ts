import { MRAIDApi } from "./mraidapi";
import { SDKApi } from "./sdkapi";

declare global {
  interface Window {
    mraid?: MRAIDApi & SDKApi;
  }
}
