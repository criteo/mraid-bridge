import { MRAIDImplementation } from "../src/mraid";

let mraid: MRAIDImplementation;

beforeEach(() => {
  mraid = MRAIDImplementation.create();
});

test("getVersion should return 1.0", () => {
  expect(mraid.getVersion()).toBe("1.0");
});
