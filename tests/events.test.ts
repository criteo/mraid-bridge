import { anyString, instance, mock, spy, verify } from "ts-mockito";
import {
  EventsCoordinator,
  MraidEvent,
  MraidEventListener,
} from "../src/events";
import { MraidState } from "../src/state";
import { SafeString } from "../src/utils";
import { LogLevel } from "../src/log/loglevel";

let eventsCoordinator: EventsCoordinator;

class Logger {
  log(logLevel: LogLevel, method: string, message: string) {}
}

let logger: Logger;
let mockedLogger: Logger;

function hasAnyListeners(): boolean {
  const map: Map<MraidEvent, Set<MraidEventListener>> = (
    eventsCoordinator as any
  ).eventListeners;

  let hasAnyElement = false;
  map.forEach((value, key) => {
    if (value.size > 0) {
      hasAnyElement = true;
    }
  });
  return hasAnyElement;
}

beforeEach(() => {
  mockedLogger = mock(Logger);
  logger = instance(mockedLogger);
  eventsCoordinator = new EventsCoordinator();
});

describe("when addEventListener", () => {
  test("for ready event and fireReadyEvent should trigger listener", () => {
    let triggerCount = 0;
    const listener = () => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(MraidEvent.Ready, listener, logger.log);
    eventsCoordinator.fireReadyEvent();

    expect(triggerCount).toBe(1);
  });

  test("for error event and fireErrorEvent should trigger listener", () => {
    let triggerCount = 0;
    const inputMessage = "error message";
    const inputAction = "error action";

    let capturedMessage = "";
    let capturedAction: SafeString = "";
    const listener = (message: string, action: SafeString) => {
      triggerCount += 1;
      capturedMessage = message;
      capturedAction = action;
    };

    eventsCoordinator.addEventListener(MraidEvent.Error, listener, logger.log);
    eventsCoordinator.fireErrorEvent(inputMessage, inputAction);

    expect(triggerCount).toBe(1);
    expect(capturedMessage).toBe(inputMessage);
    expect(capturedAction).toBe(inputAction);
  });

  test("for stateChange event and fireStateChangeEvent should trigger listener", () => {
    let triggerCount = 0;
    const inputState = MraidState.Loading;

    let capturedState: MraidState = MraidState.Loading;
    const listener = (state: MraidState) => {
      triggerCount += 1;
      capturedState = state;
    };

    eventsCoordinator.addEventListener(
      MraidEvent.StateChange,
      listener,
      logger.log
    );
    eventsCoordinator.fireStateChangeEvent(inputState);

    expect(triggerCount).toBe(1);
    expect(capturedState).toBe(inputState);
  });

  test("for viewableChange event and fireViewableChangeEvent should trigger listener", () => {
    let triggerCount = 0;
    const isViewable = true;

    let capturedIsViewable = false;
    const listener = (state: boolean) => {
      triggerCount += 1;
      capturedIsViewable = state;
    };

    eventsCoordinator.addEventListener(
      MraidEvent.ViewableChange,
      listener,
      logger.log
    );
    eventsCoordinator.fireViewableChangeEvent(isViewable);

    expect(triggerCount).toBe(1);
    expect(capturedIsViewable).toBe(isViewable);
  });

  test("for ready event with multiple listeners should trigger multiple listeners", () => {
    let triggerCount1 = 0;
    let triggerCount2 = 0;

    const listener1 = () => {
      triggerCount1 += 1;
    };
    const listener2 = () => {
      triggerCount2 += 1;
    };

    eventsCoordinator.addEventListener(MraidEvent.Ready, listener1, logger.log);
    eventsCoordinator.addEventListener(MraidEvent.Ready, listener2, logger.log);
    eventsCoordinator.fireReadyEvent();

    expect(triggerCount1).toBe(1);
    expect(triggerCount2).toBe(1);
  });

  test("with same function for different events should trigger same function multiple times", () => {
    let triggerCount = 0;

    const listener = () => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(MraidEvent.Ready, listener, logger.log);
    eventsCoordinator.addEventListener(
      MraidEvent.ViewableChange,
      listener,
      logger.log
    );
    eventsCoordinator.fireReadyEvent();
    eventsCoordinator.fireViewableChangeEvent(true);

    expect(triggerCount).toBe(2);
  });

  it.each(["MyEventName", null, undefined, true, new Set(), 123, () => {}])(
    "with %p event name then should delegate error to SdkInteractor.log",
    (eventName) => {
      eventsCoordinator.addEventListener(eventName, () => {}, logger.log);

      verify(mockedLogger.log(LogLevel.Error, anyString(), anyString())).once();
      expect(hasAnyListeners()).toBe(false);
    }
  );

  it.each(["MyListener", null, undefined, true, new Set(), 123])(
    "with %p listener then should delegate error to SdkInteractor.log",
    (listener) => {
      eventsCoordinator.addEventListener(
        MraidEvent.Ready,
        listener,
        logger.log
      );

      verify(mockedLogger.log(LogLevel.Error, anyString(), anyString())).once();
      expect(hasAnyListeners()).toBe(false);
    }
  );
});

describe("when removeEventListener", () => {
  test("for ready event and fireReadyEvent should not trigger a listener", () => {
    let triggerCount = 0;
    const listener = () => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(MraidEvent.Ready, listener, logger.log);
    eventsCoordinator.removeEventListener(
      MraidEvent.Ready,
      listener,
      logger.log
    );
    eventsCoordinator.fireReadyEvent();

    expect(triggerCount).toBe(0);
  });

  test("for error event and fireErrorEvent should not trigger a listener", () => {
    let triggerCount = 0;
    const inputMessage = "error message";
    const inputAction = "error action";

    const listener = (message: string, action: SafeString) => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(MraidEvent.Error, listener, logger.log);
    eventsCoordinator.removeEventListener(
      MraidEvent.Error,
      listener,
      logger.log
    );
    eventsCoordinator.fireErrorEvent(inputMessage, inputAction);

    expect(triggerCount).toBe(0);
  });

  test("for stateChange event and fireStateChangeEvent should not trigger a listener", () => {
    let triggerCount = 0;
    const inputState = MraidState.Loading;

    const listener = (state: MraidState) => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(
      MraidEvent.StateChange,
      listener,
      logger.log
    );

    eventsCoordinator.removeEventListener(
      MraidEvent.StateChange,
      listener,
      logger.log
    );
    eventsCoordinator.fireStateChangeEvent(inputState);

    expect(triggerCount).toBe(0);
  });

  test("for viewableChange event and fireViewableChangeEvent should not trigger a listener", () => {
    let triggerCount = 0;
    const isViewable = true;

    const listener = (state: boolean) => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(
      MraidEvent.ViewableChange,
      listener,
      logger.log
    );
    eventsCoordinator.removeEventListener(
      MraidEvent.ViewableChange,
      listener,
      logger.log
    );
    eventsCoordinator.fireViewableChangeEvent(isViewable);

    expect(triggerCount).toBe(0);
  });

  it.each([null, undefined])(
    "with null listener should remove all listeners and not trigger a listener",
    (listener) => {
      let triggerCount1 = 0;
      let triggerCount2 = 0;

      const listener1 = () => {
        triggerCount1 += 1;
      };
      const listener2 = () => {
        triggerCount2 += 1;
      };

      eventsCoordinator.addEventListener(
        MraidEvent.Ready,
        listener1,
        logger.log
      );
      eventsCoordinator.addEventListener(
        MraidEvent.Ready,
        listener2,
        logger.log
      );
      eventsCoordinator.removeEventListener(
        MraidEvent.Ready,
        listener,
        logger.log
      );
      eventsCoordinator.fireReadyEvent();

      expect(triggerCount1).toBe(0);
      expect(triggerCount2).toBe(0);
    }
  );

  test("given same listener for 2 different events and listener is removed for one event should trigger listener only once", () => {
    let triggerCount = 0;

    const listener = () => {
      triggerCount += 1;
    };

    eventsCoordinator.addEventListener(MraidEvent.Ready, listener, logger.log);
    eventsCoordinator.addEventListener(
      MraidEvent.ViewableChange,
      listener,
      logger.log
    );
    eventsCoordinator.removeEventListener(
      MraidEvent.Ready,
      listener,
      logger.log
    );
    eventsCoordinator.fireReadyEvent();
    eventsCoordinator.fireViewableChangeEvent(true);

    expect(triggerCount).toBe(1);
  });

  it.each(["MyEventName", null, undefined, true, new Set(), 123, () => {}])(
    "with %p event name then should delegate error to SdkInteractor.log",
    (eventName) => {
      eventsCoordinator.removeEventListener(eventName, () => {}, logger.log);

      verify(mockedLogger.log(LogLevel.Error, anyString(), anyString())).once();
    }
  );

  it.each(["MyListener", true, new Set(), 123])(
    "with %p listener then should delegate error to SdkInteractor.log",
    (listener) => {
      eventsCoordinator.removeEventListener(
        MraidEvent.Ready,
        listener,
        logger.log
      );

      verify(mockedLogger.log(LogLevel.Error, anyString(), anyString())).once();
    }
  );
});
