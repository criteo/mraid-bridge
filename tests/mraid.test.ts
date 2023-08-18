import {
  anyFunction,
  anyString,
  anything,
  instance,
  mock,
  verify,
} from "ts-mockito";
import { MRAIDImplementation } from "../src/mraid";
import { EventsCoordinator, MraidEvent } from "../src/events";
import { MraidState } from "../src/state";
import { MraidPlacementType } from "../src/placement";
import { SdkInteractor } from "../src/mraidbridge/sdkinteractor";
import { LogLevel } from "../src/log/loglevel";
import { defaultPropertiesValue, ExpandProperties } from "../src/expand";
import { Logger } from "../src/log/logger";
import {} from "../src/mraidwindow";
import { SdkFeature } from "../src/sdkfeature";
import { initialPosition, Position } from "../src/position";

let mraid: MRAIDImplementation;
let eventsCoordinator: EventsCoordinator;
let sdkInteractor: SdkInteractor;
let logger: Logger;
let contentWindow: Window;

beforeEach(() => {
  eventsCoordinator = mock(EventsCoordinator);
  sdkInteractor = mock(SdkInteractor);
  logger = mock(Logger);

  const frame = document.createElement("iframe");
  document.body.appendChild(frame);
  contentWindow = frame.contentWindow as Window;

  mraid = new MRAIDImplementation(
    instance(eventsCoordinator),
    instance(sdkInteractor),
    instance(logger)
  );
});

test("when create mraid object given no interactions should have loading state", () => {
  expect(mraid.getState()).toBe(MraidState.Loading);
});

test("when create mraid object sub content window should share the same instance of mraid object", () => {
  expect(mraid).toBe(contentWindow.mraid);
});

test("when create mraid object in sub window main window should have the same instance of mraid object", () => {
  window.mraid = undefined;
  contentWindow.mraid = new MRAIDImplementation(
    instance(eventsCoordinator),
    instance(sdkInteractor),
    instance(logger)
  );
  expect(window.mraid).toBe(contentWindow.mraid);
});

test("when getVersion should return 2.0", () => {
  expect(mraid.getVersion()).toBe("2.0");
});

test("when addEventListener should delegate to EventsCoordinator", () => {
  const event = MraidEvent.Ready;
  const listener = () => {};
  mraid.addEventListener(event, listener);

  verify(
    eventsCoordinator.addEventListener(event, listener, anyFunction())
  ).once();
});

test("when removeEventListener should delegate to EventsCoordinator", () => {
  const event = MraidEvent.Ready;
  const listener = () => {};
  mraid.removeEventListener(event, listener);

  verify(
    eventsCoordinator.removeEventListener(event, listener, anyFunction())
  ).once();
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
    expect(contentWindow.mraid?.getState()).toBe(MraidState.Default);
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

describe("when open", () => {
  test("with valid string then should delegate to SdkInteractor.open", () => {
    const url = "https://criteo.com/";

    mraid.open(url);

    verify(sdkInteractor.open(url)).once();
  });

  test("with valid URL then should delegate to SdkInteractor.open", () => {
    const urlString = "https://criteo.com/";
    const url = new URL(urlString);

    mraid.open(url);

    verify(sdkInteractor.open(urlString)).once();
  });

  test("with empty string then should log error", () => {
    mraid.open("");
    verify(logger.log(LogLevel.Error, "open", anyString())).once();
  });

  it.each([null, undefined, 1, true, () => {}, new Set()])(
    "with %p then should log error",
    (invalidString) => {
      mraid.open(invalidString);
      verify(logger.log(LogLevel.Error, "open", anyString())).once();
    }
  );
});

describe("when setExpandProperties", () => {
  beforeEach(() => {
    mraid.setMaxSize(1080, 720, 2);
  });

  it.each([
    [{}, new ExpandProperties(2160, 1440)],
    [{ width: 25 }, new ExpandProperties(25, 1440)],
    [{ height: 25 }, new ExpandProperties(2160, 25)],
    [{ height: 255, width: 256 }, new ExpandProperties(256, 255)],
    [{ width: 123, height: 456 }, new ExpandProperties(123, 456)],
    [{ width: 123, height: 456 }, new ExpandProperties(123, 456)],
    [
      { width: 111, height: 222, isModal: false },
      new ExpandProperties(111, 222),
    ],
    [
      { width: 111, height: 222, useCustomClose: true },
      new ExpandProperties(111, 222),
    ],
    [
      { width: 111, height: 222, useCustomClose: true, isModal: false },
      new ExpandProperties(111, 222),
    ],
  ])(
    "with %j should return same expand properties when getExpandProperties",
    (inputProperties, expectedProperties) => {
      mraid.setExpandProperties(inputProperties);

      expect(mraid.getExpandProperties()).toEqual(expectedProperties);
    }
  );

  it.each([null, undefined, false, 12, true])(
    "with %p then should log error",
    (inputProperties) => {
      mraid.setExpandProperties(inputProperties);

      verify(
        logger.log(LogLevel.Error, "setExpandProperties", anyString())
      ).once();
    }
  );

  it.each([
    { useCustomClose: true },
    { isModal: false },
    { width: 42, height: 42, useCustomClose: true, isModal: true },
  ])("with %j then should log warning", (inputProperties) => {
    mraid.setExpandProperties(inputProperties);

    verify(
      logger.log(LogLevel.Warning, "setExpandProperties", anyString())
    ).once();
  });

  test("with { width: 42, height: 42, useCustomClose: true, isModal: false } then should log warning twice", () => {
    mraid.setExpandProperties({
      width: 42,
      height: 42,
      useCustomClose: true,
      isModal: false,
    });

    verify(
      logger.log(LogLevel.Warning, "setExpandProperties", anyString())
    ).twice();
  });
});

describe("when expand ", () => {
  test("without url and with default expandParams should delegate to SdkInteractor.expand", () => {
    mraid.notifyReady(MraidPlacementType.Inline);

    mraid.expand();
    verify(
      sdkInteractor.expand(defaultPropertiesValue, defaultPropertiesValue)
    ).once();
  });

  test("without url and with custom expand properties should delegate to SdkInteractor.expand", () => {
    mraid.notifyReady(MraidPlacementType.Inline);
    mraid.setExpandProperties(new ExpandProperties(100, 100));

    mraid.expand();
    verify(sdkInteractor.expand(100, 100)).once();
  });

  test("with url then should log error", () => {
    mraid.notifyReady(MraidPlacementType.Inline);

    mraid.expand("https://criteo.com");

    verify(logger.log(LogLevel.Error, "expand", anyString())).once();
    verify(sdkInteractor.expand(anything(), anything())).never();
  });

  test("interstitial ad then should log error", () => {
    mraid.notifyReady(MraidPlacementType.Interstitial);

    mraid.expand();

    verify(logger.log(LogLevel.Error, "expand", anyString())).once();
  });

  test("hidden ad then should log error", () => {
    mraid.notifyReady(MraidPlacementType.Inline);
    mraid.notifyClosed();

    mraid.expand();

    verify(logger.log(LogLevel.Error, "expand", anyString())).once();
  });
});

test("when close should delegate to SdkInteractor.close", () => {
  mraid.close();
  verify(sdkInteractor.close()).once();
});

test("when useCustomClose then should log error", () => {
  mraid.useCustomClose(true);

  verify(logger.log(LogLevel.Error, "useCustomClose", anyString())).once();
});

describe("when notifyExpanded", () => {
  test("current state is default then should change state to expanded", () => {
    mraid.notifyReady(MraidPlacementType.Inline);

    mraid.notifyExpanded();

    expect(mraid.getState()).toBe(MraidState.Expanded);
  });

  test("current state is expanded then should log warning", () => {
    mraid.notifyReady(MraidPlacementType.Inline);
    mraid.notifyExpanded();

    mraid.notifyExpanded();

    verify(logger.log(LogLevel.Warning, "notifyExpanded", anyString())).once();
  });

  test("current state is loading then should log warning", () => {
    mraid.notifyExpanded();

    verify(logger.log(LogLevel.Warning, "notifyExpanded", anyString())).once();
  });

  test("current state is hidden then should log warning", () => {
    mraid.notifyReady(MraidPlacementType.Interstitial);
    mraid.notifyClosed();

    mraid.notifyExpanded();

    verify(logger.log(LogLevel.Warning, "notifyExpanded", anyString())).once();
  });
});

describe("when notifyClosed()", () => {
  test("current state is loading then should log warning", () => {
    mraid.notifyClosed();

    verify(logger.log(LogLevel.Warning, "notifyClosed", anyString())).once();
  });

  test("current state is hidden then should log warning", () => {
    mraid.notifyClosed();
    mraid.notifyReady(MraidPlacementType.Inline);

    mraid.notifyClosed();

    verify(logger.log(LogLevel.Warning, "notifyClosed", anyString())).once();
  });

  test("current state is expanded then should change state to default", () => {
    mraid.notifyReady(MraidPlacementType.Inline);
    mraid.notifyExpanded();

    mraid.notifyClosed();

    expect(mraid.getState()).toBe(MraidState.Default);
  });

  test("current state is default then should change state to hidden", () => {
    mraid.notifyReady(MraidPlacementType.Interstitial);

    mraid.notifyClosed();

    expect(mraid.getState()).toBe(MraidState.Hidden);
  });
});

test("when createCalendarEvent then should log error", () => {
  mraid.createCalendarEvent({});

  verify(logger.log(LogLevel.Error, "createCalendarEvent", anyString())).once();
});

test("when storePicture then should log error", () => {
  mraid.storePicture("https:www.somedomain.com/promotion.png");

  verify(logger.log(LogLevel.Error, "storePicture", anyString())).once();
});

describe("when setMaxSize", () => {
  test("and then getMaxSize should return same values", () => {
    const width = 222;
    const height = 322;

    mraid.setMaxSize(width, height, 1);

    const maxSize = mraid.getMaxSize();

    expect(maxSize.width).toBe(width);
    expect(maxSize.height).toBe(height);
  });

  test("and then getMaxSize, modify return object and getMaxSize should not modify returned object", () => {
    const width = 222;
    const height = 322;

    mraid.setMaxSize(width, height, 1);

    let maxSize = mraid.getMaxSize();
    maxSize.width = 111;
    maxSize = mraid.getMaxSize();

    expect(maxSize.width).toBe(width);
    expect(maxSize.height).toBe(height);
  });
});

describe("when setScreenSize", () => {
  test("and then getScreenSize should return same values", () => {
    const width = 222;
    const height = 322;

    mraid.setScreenSize(width, height);

    const screenSize = mraid.getScreenSize();

    expect(screenSize.width).toBe(width);
    expect(screenSize.height).toBe(height);
  });

  test("and then getScreenSize, modify return object and getScreenSize should not modify returned object", () => {
    const width = 222;
    const height = 322;

    mraid.setScreenSize(width, height);

    let maxSize = mraid.getScreenSize();
    maxSize.width = 111;
    maxSize = mraid.getScreenSize();

    expect(maxSize.width).toBe(width);
    expect(maxSize.height).toBe(height);
  });
});

describe("when supports", () => {
  it.each(Object.values(SdkFeature))(
    "%p and setSupports never called should return false",
    (feature) => {
      expect(mraid.supports(feature)).toBe(false);
    }
  );

  test("and supported properties are set to true then should return true for supported properties", () => {
    mraid.setSupports({
      sms: true,
      tel: true,
    });

    expect(mraid.supports("sms")).toBe(true);
    expect(mraid.supports("tel")).toBe(true);
    expect(mraid.supports("inlineVideo")).toBe(true);
  });

  test("and set unsupported properties should return false", () => {
    mraid.setSupports({
      calendar: true,
      storePicture: true,
    });

    expect(mraid.supports("calendar")).toBe(false);
    expect(mraid.supports("storePicture")).toBe(false);
  });

  test("for random non mraid feature should return false and log error", () => {
    expect(mraid.supports("fancyfeature")).toBe(false);
    verify(logger.log(LogLevel.Error, "supports", anyString())).once();
  });
});

describe("when getCurrentPosition", () => {
  test("should return initial position", () => {
    expect(mraid.getCurrentPosition()).toEqual(initialPosition);
  });

  test("and setCurrentPosition should return set position", () => {
    mraid.setCurrentPosition(1, 1, 1, 1);

    const expectedPosition = new Position(1, 1, 1, 1);

    expect(mraid.getCurrentPosition()).toEqual(expectedPosition);
  });

  test("and setCurrentPostion 2 times should return most recent value", () => {
    mraid.setCurrentPosition(1, 1, 1, 1);
    mraid.setCurrentPosition(2, 2, 2, 2);

    const expectedPosition = new Position(2, 2, 2, 2);

    expect(mraid.getCurrentPosition()).toEqual(expectedPosition);
  });

  test("modify value and getCurrentPosition again should not modify returned object", () => {
    const currentPosition = mraid.getCurrentPosition();
    currentPosition.width = 123;

    expect(mraid.getCurrentPosition()).toEqual(initialPosition);
  });
});

describe("when getDefaultPosition", () => {
  test("should return initial position", () => {
    expect(mraid.getDefaultPosition()).toEqual(initialPosition);
  });

  test("and setCurrentPosition should return set position", () => {
    mraid.setCurrentPosition(1, 1, 1, 1);

    const expectedPosition = new Position(1, 1, 1, 1);

    expect(mraid.getDefaultPosition()).toEqual(expectedPosition);
  });

  test("and setCurrentPostion 2 times should return first set value", () => {
    mraid.setCurrentPosition(1, 1, 1, 1);
    mraid.setCurrentPosition(2, 2, 2, 2);

    const expectedPosition = new Position(1, 1, 1, 1);

    expect(mraid.getDefaultPosition()).toEqual(expectedPosition);
  });

  test("modify value and getDefaultPosition again should not modify returned object", () => {
    const defaultPosition = mraid.getDefaultPosition();
    defaultPosition.width = 123;

    expect(mraid.getDefaultPosition()).toEqual(initialPosition);
  });
});

describe("when playVideo", () => {
  test("with valid string then should delegate to SdkInteractor.playVideo", () => {
    const url = "https://criteo.com/funny_cat_video.mp4";

    mraid.playVideo(url);

    verify(sdkInteractor.playVideo(url)).once();
  });

  test("with valid URL then should delegate to SdkInteractor.playVideo", () => {
    const urlString = "https://criteo.com/funny_cat_video.mp4";
    const url = new URL(urlString);

    mraid.playVideo(url);

    verify(sdkInteractor.playVideo(urlString)).once();
  });

  test("with empty string then should log error", () => {
    mraid.playVideo("");
    verify(logger.log(LogLevel.Error, "playVideo", anyString())).once();
  });

  it.each([null, undefined, 1, true, () => {}, new Set()])(
    "with %p then should log error",
    (notAString) => {
      mraid.playVideo(notAString);
      verify(logger.log(LogLevel.Error, "playVideo", anyString())).once();
    }
  );
});
