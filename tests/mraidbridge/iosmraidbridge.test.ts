import { capture, instance, mock, when } from "ts-mockito";
import { LogLevel } from "../../src/log/loglevel";
import {
  IosMraidBridge,
  CriteoMessageHandler,
  LogIosMessage,
  Webkit,
  MessageHandlers,
  OpenIosMessage,
  ExpandIosMessage,
  CloseIosMessage,
  PlayVideoIosMessage,
} from "../../src/mraidbridge/iosmraidbridge";

let iosMraidBridge: IosMraidBridge;
let iosMessageHandler: CriteoMessageHandler;

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

  iosMraidBridge.log(logLevel, message, logId);

  const expectedMessage: LogIosMessage = {
    action: "log",
    logLevel,
    message,
    logId,
  };

  const capturedMessage = capture(iosMessageHandler.postMessage).last()[0];
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call open should delegate to criteoMraidBridge on window", () => {
  const url = "https://www.criteo.com/";

  iosMraidBridge.open(url);

  const expectedMessage: OpenIosMessage = {
    action: "open",
    url,
  };

  const capturedMessage = capture(iosMessageHandler.postMessage).last()[0];
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call expand should delegate to criteoMraidBridge on window", () => {
  const width = 123;
  const height = 222;
  iosMraidBridge.expand(width, height);

  const expectedMessage: ExpandIosMessage = {
    action: "expand",
    width,
    height,
  };

  const capturedMessage = capture(iosMessageHandler.postMessage).last()[0];
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call close should delegate to criteoMraidBridge on window", () => {
  iosMraidBridge.close();

  const expectedMessage: CloseIosMessage = {
    action: "close",
  };

  const capturedMessage = capture(iosMessageHandler.postMessage).last()[0];
  expect(capturedMessage).toStrictEqual(expectedMessage);
});

test("when call playVideo should delegate to criteoMraidBridge on window", () => {
  const url = "https://criteo.com/funny_cat_video.mp4";
  iosMraidBridge.playVideo(url);

  const expectedMessage: PlayVideoIosMessage = {
    action: "play_video",
    url,
  };

  const capturedMessage = capture(iosMessageHandler.postMessage).last()[0];
  expect(capturedMessage).toStrictEqual(expectedMessage);
});
