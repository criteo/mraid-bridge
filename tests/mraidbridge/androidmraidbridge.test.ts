import { instance, mock, verify } from "ts-mockito";
import {
  CriteoInterface,
  AndroidMraidBridge,
} from "../../src/mraidbridge/androidmraidbridge";
import { LogLevel } from "../../src/log/loglevel";
import { ClosePosition } from "../../src/resize";

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

test("when call playVideo should delegate to criteoMraidBridge on window", () => {
  const url = "https://criteo.com/funny_cat_video.mp4";
  androidMraidBridge.playVideo(url);

  verify(androidBridge.playVideo(url)).once();
});

test("when call resize should delegate to criteoMraidBridge on window", () => {
  const width = 133;
  const height = 444;
  const offsetX = 13;
  const offsetY = 0;
  const customClosePosition = ClosePosition.Center;
  const allowOffscreen = true;

  androidMraidBridge.resize(
    width,
    height,
    offsetX,
    offsetY,
    customClosePosition,
    allowOffscreen
  );

  verify(
    androidBridge.resize(
      width,
      height,
      offsetX,
      offsetY,
      customClosePosition,
      allowOffscreen
    )
  ).once();
});
