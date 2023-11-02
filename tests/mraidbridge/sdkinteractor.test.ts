import { instance, mock, verify } from "ts-mockito";
import { SdkInteractor } from "../../src/mraidbridge/sdkinteractor";
import { MraidBridge } from "../../src/mraidbridge/mraidbridge";
import { LogLevel } from "../../src/log/loglevel";
import { ClosePosition } from "../../src/resize";
import { Orientation } from "../../src/orientationproperties";

let sdkInteractor: SdkInteractor;
let mraidBridges: MraidBridge[];

beforeEach(() => {
  mraidBridges = [mock<MraidBridge>(), mock<MraidBridge>()];
  sdkInteractor = new SdkInteractor(
    mraidBridges.map((bridge) => instance(bridge))
  );
});

test("when call log should delegate to every MraidBridge object", () => {
  const logLevel = LogLevel.Info;
  const message = "Some fancy text";
  const logId = "id";

  sdkInteractor.log(logLevel, message, logId);

  mraidBridges.forEach((bridge) =>
    verify(bridge.log(logLevel, message, logId)).once()
  );
});

test("when call open should delegate to every MraidBridge object", () => {
  const url = "https://www.criteo.com/";

  sdkInteractor.open(url);

  mraidBridges.forEach((bridge) => verify(bridge.open(url)).once());
});

test("when call expand should delegate to every MraidBridge object", () => {
  const width = 123;
  const height = 222;
  sdkInteractor.expand(width, height);

  mraidBridges.forEach((bridge) => verify(bridge.expand(width, height)).once());
});

test("when call close should delegate to every MraidBridge object", () => {
  sdkInteractor.close();

  mraidBridges.forEach((bridge) => verify(bridge.close()).once());
});

test("when call playVideo should delegate to every MraidBridge object", () => {
  const url = "https://criteo.com/funny_cat_video.mp4";
  sdkInteractor.playVideo(url);

  mraidBridges.forEach((bridge) => verify(bridge.playVideo(url)).once());
});

test("when call resize should delegate to every MraidBridge object", () => {
  const width = 133;
  const height = 444;
  const offsetX = 13;
  const offsetY = 0;
  const customClosePosition = ClosePosition.BottomCenter;
  const allowOffscreen = true;

  sdkInteractor.resize(
    width,
    height,
    offsetX,
    offsetY,
    customClosePosition,
    allowOffscreen
  );

  mraidBridges.forEach((bridge) =>
    verify(
      bridge.resize(
        width,
        height,
        offsetX,
        offsetY,
        customClosePosition,
        allowOffscreen
      )
    ).once()
  );
});

test("when call setOrientationProperties should delegate to every MraidBridge object", () => {
  sdkInteractor.setOrientationProperties(false, Orientation.Portrait);

  mraidBridges.forEach((bridge) =>
    verify(bridge.setOrientationProperties(false, Orientation.Portrait)).once()
  );
});
