import { instance, mock, verify } from "ts-mockito";
import {
  CriteoInterface,
  AndroidMraidBridge,
} from "../../src/mraidbridge/androidmraidbridge";
import { LogLevel } from "../../src/log/loglevel";

let androidMraidBridge: AndroidMraidBridge;
let androidBridge: CriteoInterface;

beforeEach(() => {
  androidMraidBridge = new AndroidMraidBridge();
  androidBridge = mock<CriteoInterface>();
  window.criteoMraidBridge = instance(androidBridge);
});

test("when call log should delegate to criteoMraidBridge on window", () => {
  const logLevel = LogLevel.Info;
  const message = "Some fancy text";
  const logId = "id";

  androidMraidBridge.log(logLevel, message, logId);

  verify(androidBridge.log(logLevel, message, logId)).once();
});

test("when call open should delegate to criteoMraidBridge on window", () => {
  const url = "https://www.criteo.com/";

  androidMraidBridge.open(url);

  verify(androidBridge.open(url)).once();
});

test("when call expand should delegate to criteoMraidBridge on window", () => {
  const width = 123;
  const height = 222;
  androidMraidBridge.expand(width, height);

  verify(androidBridge.expand(width, height)).once();
});

test("when call close should delegate to criteoMraidBridge on window", () => {
  androidMraidBridge.close();

  verify(androidBridge.close()).once();
});
