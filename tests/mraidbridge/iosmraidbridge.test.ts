import { capture, instance, mock, strictEqual, verify, when } from "ts-mockito";
import { LogLevel } from "../../src/mraidbridge/loglevel";
import {
  IosMraidBridge,
  CriteoMessageHandler,
  LogIosMessage,
  Webkit,
  MessageHandlers,
  OpenIosMessage,
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
