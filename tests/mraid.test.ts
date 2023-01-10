import { mock, instance, verify } from "ts-mockito";
import { MRAIDImplementation } from "../src/mraid";
import { EventsCoordinator, MraidEvent } from "../src/events";
import { MraidState } from "../src/state";

let mraid: MRAIDImplementation;
let eventsCoordinator: EventsCoordinator;

beforeEach(() => {
  eventsCoordinator = mock(EventsCoordinator);
  mraid = new MRAIDImplementation(instance(eventsCoordinator));
});

test("when create mraid object given no interactions should have loading state", () => {
  expect(mraid.getState()).toBe(MraidState.Loading);
});

test("when getVersion should return 1.0", () => {
  expect(mraid.getVersion()).toBe("1.0");
});

test("when addEventListener should delegate to EventsCoordinator", () => {
  const event = MraidEvent.Ready;
  const listener = () => {};
  mraid.addEventListener(event, listener);

  verify(eventsCoordinator.addEventListener(event, listener)).once();
});

test("when removeEventListener should delegate to EventsCoordinator", () => {
  const event = MraidEvent.Ready;
  const listener = () => {};
  mraid.removeEventListener(event, listener);

  verify(eventsCoordinator.removeEventListener(event, listener)).once();
});

describe("when notifyReady", () => {
  beforeEach(() => {
    mraid.notifyReady();
  });

  test("should fireReadyEvent on EventsCoordinator", () => {
    verify(eventsCoordinator.fireReadyEvent()).once();
  });

  test("should change state to default", () => {
    expect(mraid.getState()).toBe(MraidState.Default);
  });

  test("should fireStateChangeEvent on EventsCoordinator", () => {
    verify(eventsCoordinator.fireStateChangeEvent(MraidState.Default)).once();
  });

  test("2 times should only update state and listeners once", () => {
    mraid.notifyReady();
    verify(eventsCoordinator.fireStateChangeEvent(MraidState.Default)).once();
  });
});

test("when notifyError should delegate to EventsCoordinator", () => {
  const message = "message";
  const action = "action";

  mraid.notifyError(message, action);

  verify(eventsCoordinator.fireErrorEvent(message, action)).once();
});
