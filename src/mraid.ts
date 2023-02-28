import { ExpandProperties, MRAIDApi } from "./mraidapi";
import { EventsCoordinator, MraidEvent, MraidEventListener } from "./events";
import { SDKApi } from "./sdkapi";
import { MraidState } from "./state";
import { SafeString } from "./utils";
import { MraidPlacementType } from "./placement";
import { LogLevel } from "./mraidbridge/loglevel";
import { SdkInteractor } from "./mraidbridge/sdkinteractor";

export class MRAIDImplementation implements MRAIDApi, SDKApi {
  private eventsCoordinator: EventsCoordinator;

  private sdkInteractor: SdkInteractor;

  private currentState = MraidState.Loading;

  private placementType = MraidPlacementType.Unknown;

  private isCurrentlyViewable = false;

  constructor(
    eventsCoordinator: EventsCoordinator,
    sdkInteractor: SdkInteractor
  ) {
    this.eventsCoordinator = eventsCoordinator;
    this.sdkInteractor = sdkInteractor;
  }

  // #region MRAID Api

  getVersion(): string {
    return "1.0";
  }

  addEventListener(event: MraidEvent, listener: MraidEventListener) {
    try {
      this.eventsCoordinator.addEventListener(event, listener);
    } catch (e) {
      this.sdkInteractor.log(
        LogLevel.Error,
        `Error when addEventListener, event = ${event}, listenerType = ${typeof listener}`
      );
    }
  }

  removeEventListener(
    event: MraidEvent,
    listener: MraidEventListener | null | undefined
  ) {
    try {
      this.eventsCoordinator.removeEventListener(event, listener);
    } catch (e) {
      this.sdkInteractor.log(
        LogLevel.Error,
        `Error when removeEventListener, event = ${event}, listenerType = ${typeof listener}`
      );
    }
  }

  getState(): MraidState {
    return this.currentState;
  }

  getPlacementType(): MraidPlacementType {
    return this.placementType;
  }

  isViewable(): boolean {
    return this.isCurrentlyViewable;
  }

  expand(url?: URL) {
    console.log(`expand(), url -> ${url}`);
  }

  getExpandProperties(): ExpandProperties {
    // TODO: verify proper return type
    return new ExpandProperties(1, 1, false, false);
  }

  setExpandProperties(properties: ExpandProperties) {
    // TODO: verify proper set type
    console.log(`setExpandProperties(), properties -> ${properties}`);
  }

  close() {
    console.log("close()");
  }

  useCustomClose(useCustomClose: boolean) {
    console.log(`useCustomClose(), useCustomClose -> ${useCustomClose}`);
  }

  open(url: URL) {
    console.log(`open(), url -> ${url}`);
  }

  // #endregion

  // #region SDKApi

  notifyReady(placementType: MraidPlacementType) {
    this.sdkInteractor.log(
      LogLevel.Debug,
      `notifyReady(), placementType=${placementType}`,
      null
    );
    this.placementType = placementType;
    this.setReady();
  }

  notifyError(message: string, action: SafeString) {
    this.eventsCoordinator.fireErrorEvent(message, action);
  }

  setIsViewable(isViewable: boolean) {
    this.sdkInteractor.log(
      LogLevel.Debug,
      `setIsViewable(), isViewable=${isViewable}`,
      null
    );
    if (this.isCurrentlyViewable !== isViewable) {
      this.isCurrentlyViewable = isViewable;
      this.eventsCoordinator.fireViewableChangeEvent(isViewable);
    }
  }

  // #endregion

  private updateState(newState: MraidState) {
    this.currentState = newState;
    this.eventsCoordinator.fireStateChangeEvent(newState);
  }

  private setReady() {
    if (this.currentState === MraidState.Loading) {
      this.updateState(MraidState.Default);
      this.eventsCoordinator.fireReadyEvent();
    }
  }
}
