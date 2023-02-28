import { instance, mock, verify } from "ts-mockito";
import { SdkInteractor } from "../../src/mraidbridge/sdkinteractor";
import { MraidBridge } from "../../src/mraidbridge/mraidbridge";
import { LogLevel } from "../../src/mraidbridge/loglevel";

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
