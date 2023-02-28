import { MraidState } from "./state";
import { isFunction, SafeString } from "./utils";
import { LogLevel } from "./mraidbridge/loglevel";
import { SdkInteractor } from "./mraidbridge/sdkinteractor";

export enum MraidEvent {
  Ready = "ready",
  Error = "error",
  StateChange = "stateChange",
  ViewableChange = "viewableChange",
}

export type EventListener<T1, T2> = (t1: T1, t2: T2) => void;
export type ErrorEventListener = EventListener<string, SafeString>;
export type StateChangeEventListener = EventListener<MraidState, void>;
export type ViewableChangeEventListener = EventListener<boolean, void>;
export type ReadyEventListener = EventListener<void, void>;

// Describes functions with possible parameters defined by MRAID spec
export type MraidEventListener =
  | ErrorEventListener
  | StateChangeEventListener
  | ViewableChangeEventListener
  | ReadyEventListener;

export class EventsCoordinator {
  // TODO: Object.values is ES2017. Check if it will work for Android and iOS
  private eventListeners: Map<string, Set<MraidEventListener>> = new Map(
    Object.values(MraidEvent).map((e) => [e, new Set()])
  );

  private sdkInteractor: SdkInteractor;

  constructor(sdkInteractor: SdkInteractor) {
    this.sdkInteractor = sdkInteractor;
  }

  addEventListener(event: MraidEvent, listener: MraidEventListener) {
    // By MRAID spec listener can be any function
    if (!this.isCorrectEvent(event) || !isFunction(listener)) {
      this.sdkInteractor.log(
        LogLevel.Error,
        `Incorrect parameter type when addEventListener. event = ${event}, listenerType = ${typeof listener}`
      );
      return;
    }

    if (listener) {
      this.eventListeners.get(event)?.add(listener);
    }
  }

  removeEventListener(
    event: MraidEvent,
    listener: MraidEventListener | null | undefined
  ) {
    if (!this.isCorrectEvent(event) || (listener && !isFunction(listener))) {
      this.sdkInteractor.log(
        LogLevel.Error,
        `Incorrect parameter type when removeEventListener. event = ${event}, listenerType = ${typeof listener}`
      );
      return;
    }

    const listeners = this.eventListeners.get(event);
    if (listener) {
      listeners?.delete(listener);
    } else {
      listeners?.clear();
    }
  }

  fireReadyEvent() {
    this.eventListeners.get(MraidEvent.Ready)?.forEach((value) => {
      (value as ReadyEventListener)?.();
    });
  }

  fireErrorEvent(message: string, action: SafeString) {
    this.eventListeners.get(MraidEvent.Error)?.forEach((value) => {
      (value as ErrorEventListener)?.(message, action);
    });
  }

  fireStateChangeEvent(newState: MraidState) {
    this.eventListeners.get(MraidEvent.StateChange)?.forEach((value) => {
      (value as StateChangeEventListener)?.(newState);
    });
  }

  fireViewableChangeEvent(isViewable: boolean) {
    this.eventListeners.get(MraidEvent.ViewableChange)?.forEach((value) => {
      (value as ViewableChangeEventListener)?.(isViewable);
    });
  }

  private isCorrectEvent(event: MraidEvent): boolean {
    return event && this.eventListeners.has(event);
  }
}
