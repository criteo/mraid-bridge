import { MRAIDImplementation } from "./mraid";
import { MRAID } from "./mraidapi";

export {};

declare global {
  interface Window {
    mraid: MRAID;
  }
}

window.mraid = MRAIDImplementation.create();
