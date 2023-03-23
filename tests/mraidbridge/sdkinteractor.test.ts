import { instance, mock, verify } from "ts-mockito";
import { SdkInteractor } from "../../src/mraidbridge/sdkinteractor";
import { MraidBridge } from "../../src/mraidbridge/mraidbridge";
import { LogLevel } from "../../src/log/loglevel";

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
