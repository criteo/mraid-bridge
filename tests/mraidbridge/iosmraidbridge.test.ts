import { capture, instance, mock, when } from "ts-mockito";
import { LogLevel } from "../../src/log/loglevel";
import {
  CloseIosMessage,
  CriteoMessageHandler,
  ExpandIosMessage,
  IosMessage,
  IosMraidBridge,
  LogIosMessage,
  MessageHandlers,
  OpenIosMessage,
  PlayVideoIosMessage,
  ResizeIosMessage,
  SetOrientationPropertiesMessage,
  Webkit,
} from "../../src/mraidbridge/iosmraidbridge";
import { ClosePosition } from "../../src/resize";
import { Orientation } from "../../src/orientationproperties";

let iosMraidBridge: IosMraidBridge;
let iosMessageHandler: CriteoMessageHandler;

function captureLastMessage(): IosMessage {
  return capture(iosMessageHandler.postMessage).last()[0];
}

beforeEach(() => {
  iosMraidBridge = new IosMraidBridge();
  iosMessageHandler = mock<CriteoMessageHandler>();

  const mockedWebKit = mock<Webkit>();
  const mockedMessageHandlers = mock<MessageHandlers>();

  when(mockedMessageHandlers.criteoMraidBridge).thenReturn(
    instance(iosMessageHandler)
  );
  when(mockedWebKit.messageHandlers).thenReturn(
    instance(mockedMessageHandlers)
  );

  window.webkit = instance(mockedWebKit);
});

test("when call log should delegate to criteoMraidBridge on window", () => {
  const logLevel = LogLevel.Info;
  const message = "Some fancy text";
  const logId = "id";

  const expectedMessage: LogIosMessage = {
    action: "log",
    logLevel,
    message,
    logId,
  };

  iosMraidBridge.log(logLevel, message, logId);

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call open should delegate to criteoMraidBridge on window", () => {
  const url = "https://www.criteo.com/";

  const expectedMessage: OpenIosMessage = {
    action: "open",
    url,
  };

  iosMraidBridge.open(url);

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call expand should delegate to criteoMraidBridge on window", () => {
  const width = 123;
  const height = 222;
  const expectedMessage: ExpandIosMessage = {
    action: "expand",
    width,
    height,
  };

  iosMraidBridge.expand(width, height);

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call close should delegate to criteoMraidBridge on window", () => {
  const expectedMessage: CloseIosMessage = {
    action: "close",
  };

  iosMraidBridge.close();

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call playVideo should delegate to criteoMraidBridge on window", () => {
  const url = "https://criteo.com/funny_cat_video.mp4";
  const expectedMessage: PlayVideoIosMessage = {
    action: "play_video",
    url,
  };

  iosMraidBridge.playVideo(url);

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call resize should delegate to criteoMraidBridge on window", () => {
  const width = 133;
  const height = 444;
  const offsetX = 13;
  const offsetY = 0;
  const customClosePosition = "center";
  const allowOffscreen = true;
  const expectedMessage: ResizeIosMessage = {
    action: "resize",
    width,
    height,
    offsetX,
    offsetY,
    customClosePosition,
    allowOffscreen,
  };

  iosMraidBridge.resize(
    width,
    height,
    offsetX,
    offsetY,
    ClosePosition.Center,
    allowOffscreen
  );

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call setOrientationProperties should delegate to criteoMraidBridge on window", () => {
  const allowOrientationChange = false;
  const forceOrientation = Orientation.None;

  const expectedMessage: SetOrientationPropertiesMessage = {
    action: "set_orientation_properties",
    allowOrientationChange,
    forceOrientation,
  };

  iosMraidBridge.setOrientationProperties(
    allowOrientationChange,
    forceOrientation
  );

  const capturedMessage = captureLastMessage();
  expect(capturedMessage).toStrictEqual(expectedMessage);
});
