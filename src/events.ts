import { MraidState } from "./state";
import { Anything, isFunction, SafeString } from "./utils";
import { LogLevel } from "./log/loglevel";

export enum MraidEvent {
  Ready = "ready",
  Error = "error",
  StateChange = "stateChange",
  ViewableChange = "viewableChange",
  SizeChange = "sizeChange",
}

export type EventListener<T1, T2> = (t1: T1, t2: T2) => void;
export type ErrorEventListener = EventListener<string, SafeString>;
export type StateChangeEventListener = EventListener<MraidState, void>;
export type ViewableChangeEventListener = EventListener<boolean, void>;
export type ReadyEventListener = EventListener<void, void>;
export type SizeChangeEventListener = EventListener<number, number>;

// Describes functions with possible parameters defined by MRAID spec
export type MraidEventListener =
  | ErrorEventListener
  | StateChangeEventListener
  | ViewableChangeEventListener
  | ReadyEventListener
  | SizeChangeEventListener;

export class EventsCoordinator {
  private eventListeners: Map<string, Set<MraidEventListener>> = new Map(
    Object.values(MraidEvent).map((e) => [e, new Set()])
  );

  addEventListener(
    event: MraidEvent | Anything,
    listener: MraidEventListener | Anything,
    logger: (logLevel: LogLevel, method: string, message: string) => void
  ) {
    if (!event || !this.isCorrectEvent(event)) {
      logger(
        LogLevel.Error,
        "addEventListener",
        `Incorrect event when addEventListener.Type = ${typeof event}, value = ${event}`
      );
      return;
    }

    if (!listener) {
      logger(
        LogLevel.Error,
        "addEventListener",
        `Incorrect listener when addEventListener. It is null or undefined`
      );
      return;
    }
    // By MRAID spec listener can be any function
    if (!isFunction(listener)) {
      logger(
        LogLevel.Error,
        "addEventListener",
        `Incorrect listener when addEventListener. 
        Listener is not a function. Actual type = ${typeof listener}`
      );
      return;
    }

    this.eventListeners.get(event)?.add(listener);
  }

  removeEventListener(
    event: MraidEvent | Anything,
    listener: MraidEventListener | Anything,
    logger: (logLevel: LogLevel, method: string, message: string) => void
  ) {
    if (!event || !this.isCorrectEvent(event)) {
      logger(
        LogLevel.Error,
        "removeEventListener",
        `Incorrect event when removeEventListener.Type = ${typeof event}, value = ${event}`
      );
      return;
    }

    if (listener && !isFunction(listener)) {
      logger(
        LogLevel.Error,
        "removeEventListener",
        `Incorrect listener when removeEventListener. 
        Listener is not a function. Actual type = ${typeof listener}`
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

  fireSizeChangeEvent(width: number, height: number) {
    this.eventListeners.get(MraidEvent.SizeChange)?.forEach((value) => {
      (value as SizeChangeEventListener)?.(width, height);
    });
  }

  private isCorrectEvent(event: MraidEvent): boolean {
    return event && this.eventListeners.has(event);
  }
}
