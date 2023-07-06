import { MRAIDApi } from "./mraidapi";
import { EventsCoordinator, MraidEvent, MraidEventListener } from "./events";
import { SDKApi } from "./sdkapi";
import { MraidState } from "./state";
import { Anything, isNumber, SafeString, Url } from "./utils";
import { MraidPlacementType } from "./placement";
import { LogLevel } from "./log/loglevel";
import { SdkInteractor } from "./mraidbridge/sdkinteractor";
import {
  defaultPropertiesValue,
  ExpandProperties,
  isValidExpandPropertiesObject,
} from "./expand";
import { Size } from "./size";
import { Logger } from "./log/logger";

export class MRAIDImplementation implements MRAIDApi, SDKApi {
  private eventsCoordinator: EventsCoordinator;

  private sdkInteractor: SdkInteractor;

  private logger: Logger;

  private currentState = MraidState.Loading;

  private placementType = MraidPlacementType.Unknown;

  private isCurrentlyViewable = false;

  private currentExpandProperties = new ExpandProperties(
    defaultPropertiesValue,
    defaultPropertiesValue
  );

  private currentMaxSize = new Size(0, 0);

  private pixelMultiplier = 1;

  constructor(
    eventsCoordinator: EventsCoordinator,
    sdkInteractor: SdkInteractor,
    logger: Logger
  ) {
    this.eventsCoordinator = eventsCoordinator;
    this.sdkInteractor = sdkInteractor;
    this.logger = logger;
  }

  // #region MRAID Api

  getVersion(): string {
    return "2.0";
  }

  addEventListener(event: MraidEvent, listener: MraidEventListener) {
    try {
      this.eventsCoordinator.addEventListener(event, listener, this.logger.log);
    } catch (e) {
      this.logger.log(
        LogLevel.Error,
        "addEventListener",
        `error when addEventListener, event = ${event}, listenerType = ${typeof listener}`
      );
    }
  }

  removeEventListener(
    event: MraidEvent,
    listener: MraidEventListener | null | undefined
  ) {
    try {
      this.eventsCoordinator.removeEventListener(
        event,
        listener,
        this.logger.log
      );
    } catch (e) {
      this.logger.log(
        LogLevel.Error,
        "removeEventListener",
        `error when removeEventListener, event = ${event}, listenerType = ${typeof listener}`
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

  expand(url?: Url | Anything) {
    if (!this.canPerformActions()) {
      this.logger.log(
        LogLevel.Error,
        "expand",
        `can't expand in ${this.currentState} state`
      );
      return;
    }

    if (this.placementType === MraidPlacementType.Interstitial) {
      this.logger.log(LogLevel.Error, "expand", "can't expand interstitial ad");
      return;
    }

    if (url != null) {
      this.logger.log(
        LogLevel.Error,
        "expand",
        "two-part expandable ads are not supported"
      );
    } else {
      this.sdkInteractor.expand(
        this.currentExpandProperties.width,
        this.currentExpandProperties.height
      );
    }
  }

  getExpandProperties(): ExpandProperties {
    let width;
    if (this.currentExpandProperties.width === defaultPropertiesValue) {
      width = this.currentMaxSize.width * this.pixelMultiplier;
    } else {
      width = this.currentExpandProperties.width;
    }

    let height;
    if (this.currentExpandProperties.height === defaultPropertiesValue) {
      height = this.currentMaxSize.height * this.pixelMultiplier;
    } else {
      height = this.currentExpandProperties.height;
    }

    return new ExpandProperties(width, height);
  }

  setExpandProperties(properties?: ExpandProperties | Anything) {
    if (this.isCorrectProperties(properties)) {
      this.currentExpandProperties.width =
        properties.width ?? defaultPropertiesValue;
      this.currentExpandProperties.height =
        properties.height ?? defaultPropertiesValue;
    }
  }

  close() {
    this.sdkInteractor.close();
  }

  useCustomClose(useCustomClose: boolean) {
    this.logger.log(
      LogLevel.Error,
      "useCustomClose",
      "useCustomClose() is not supported"
    );
  }

  open(url: Url | Anything) {
    if (url) {
      if (typeof url === "string") {
        this.sdkInteractor.open(url);
      } else if (url instanceof URL) {
        this.sdkInteractor.open(url.toString());
      } else {
        this.logger.log(
          LogLevel.Error,
          "open",
          "Error when open(), url is not a string"
        );
      }
    } else {
      this.logger.log(
        LogLevel.Error,
        "open",
        "Error when open(), url is null, empty or undefined"
      );
    }
  }

  createCalendarEvent(parameters: Anything): void {
    this.logger.log(
      LogLevel.Error,
      "createCalendarEvent",
      "createCalendarEvent() is not supported"
    );
  }

  storePicture(uri: Anything): void {
    this.logger.log(
      LogLevel.Error,
      "storePicture",
      "storePicture() is not supported"
    );
  }

  // #endregion

  // #region SDKApi

  notifyReady(placementType: MraidPlacementType) {
    this.logger.log(
      LogLevel.Debug,
      "notifyReady",
      `placementType=${placementType}`
    );
    this.placementType = placementType;
    this.setReady();
  }

  notifyError(message: string, action: SafeString) {
    this.eventsCoordinator.fireErrorEvent(message, action);
  }

  setIsViewable(isViewable: boolean) {
    this.logger.log(
      LogLevel.Debug,
      "setIsViewable",
      `isViewable=${isViewable}`
    );
    if (this.isCurrentlyViewable !== isViewable) {
      this.isCurrentlyViewable = isViewable;
      this.eventsCoordinator.fireViewableChangeEvent(isViewable);
    }
  }

  setMaxSize(width: number, height: number, pixelMultiplier: number): void {
    this.currentMaxSize.width = width;
    this.currentMaxSize.height = height;
    this.pixelMultiplier = pixelMultiplier;
  }

  notifyClosed(): void {
    if (!this.canPerformActions()) {
      this.logger.log(
        LogLevel.Warning,
        "notifyClosed",
        `can't close in ${this.currentState} state`
      );
      return;
    }
    if (this.currentState === MraidState.Expanded) {
      this.updateState(MraidState.Default);
    } else if (this.currentState === MraidState.Default) {
      this.updateState(MraidState.Hidden);
    }
  }

  notifyExpanded(): void {
    switch (this.currentState) {
      case MraidState.Default:
        this.updateState(MraidState.Expanded);
        break;
      case MraidState.Expanded:
        this.logger.log(
          LogLevel.Warning,
          "notifyExpanded",
          "ad is already expanded"
        );
        break;
      case MraidState.Loading:
      case MraidState.Hidden:
        this.logger.log(
          LogLevel.Warning,
          "notifyExpanded",
          `can't expand from ${this.currentState}`
        );
        break;
      default:
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

  private canPerformActions(): boolean {
    return (
      this.currentState !== MraidState.Loading &&
      this.currentState !== MraidState.Hidden
    );
  }

  private isCorrectProperties(
    properties?: ExpandProperties | Anything
  ): boolean {
    if (isValidExpandPropertiesObject(properties)) {
      const { width, height, useCustomClose, isModal } = properties;

      const isCorrectWidth = this.isCorrectDimension(width);
      if (!isCorrectWidth) return false;

      const isCorrectHeight = this.isCorrectDimension(height);
      if (!isCorrectHeight) return false;

      if (useCustomClose) {
        this.logger.log(
          LogLevel.Warning,
          "setExpandProperties",
          "useCustomClose is not supported"
        );
      }

      if (isModal != null && !isModal) {
        this.logger.log(
          LogLevel.Warning,
          "setExpandProperties",
          "isModal property is readonly and always equals to true"
        );
      }
      return true;
    }
    this.logger.log(
      LogLevel.Error,
      "setExpandProperties",
      `properties is ${properties}`
    );
    return false;
  }

  private isCorrectDimension(dimension: number | Anything): boolean {
    if (dimension) {
      if (!isNumber(dimension)) {
        this.logger.log(
          LogLevel.Error,
          "setExpandProperties",
          `width is not a number, width is ${typeof dimension}`
        );
        return false;
      }
      if (!this.isInAcceptedBounds(dimension)) {
        this.logger.log(
          LogLevel.Error,
          "setExpandProperties",
          `width is ${dimension}`
        );
        return false;
      }
    } else {
      return true;
    }
    return true;
  }

  private isInAcceptedBounds(number: number): boolean {
    return Number.isFinite(number) && number >= 0;
  }
}
