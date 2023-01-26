import { mock, instance, verify, anything } from "ts-mockito";
import { MRAIDImplementation } from "../src/mraid";
import { EventsCoordinator, MraidEvent } from "../src/events";
import { MraidState } from "../src/state";
import { MraidPlacementType } from "../src/placement";

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
    mraid.notifyReady(MraidPlacementType.Inline);
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
    mraid.notifyReady(MraidPlacementType.Inline);
    verify(eventsCoordinator.fireStateChangeEvent(MraidState.Default)).once();
  });
});

test("when notifyError should delegate to EventsCoordinator", () => {
  const message = "message";
  const action = "action";

  mraid.notifyError(message, action);

  verify(eventsCoordinator.fireErrorEvent(message, action)).once();
});

it.each([
  [MraidPlacementType.Inline, MraidPlacementType.Inline],
  [MraidPlacementType.Interstitial, MraidPlacementType.Interstitial],
])(
  "when notifyReady with %p placement type and getPlacementType should return %p",
  (param: MraidPlacementType, expected: MraidPlacementType) => {
    mraid.notifyReady(param);
    expect(mraid.getPlacementType()).toBe(expected);
  }
);

test("when get isViewable should have false as a default value", () => {
  expect(mraid.isViewable()).toBe(false);
});

it.each([
  [true, true],
  [false, false],
])(
  "when setIsViewable to %p get isViewable should return %p",
  (set: boolean, expected: boolean) => {
    mraid.setIsViewable(set);
    expect(mraid.isViewable()).toBe(expected);
  }
);

test("given isViewable = false when setIsViewable to true should fireViewableChangeEvent on EventsCoordinator", () => {
  mraid.setIsViewable(true);
  verify(eventsCoordinator.fireViewableChangeEvent(true)).once();
});

test("given isViewable = false when setIsViewable to false should not fireViewableChangeEvent on EventsCoordinator", () => {
  mraid.setIsViewable(false);
  verify(eventsCoordinator.fireViewableChangeEvent(anything())).never();
});
