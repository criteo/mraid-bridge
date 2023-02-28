import { instance, mock, verify } from "ts-mockito";
import {
  CriteoInterface,
  AndroidMraidBridge,
} from "../../src/mraidbridge/androidmraidbridge";
import { LogLevel } from "../../src/mraidbridge/loglevel";

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
