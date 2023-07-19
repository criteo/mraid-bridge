import { verify } from "ts-mockito";
import { isSdkFeature, joinedSdkFeatures, SdkFeature } from "../src/sdkfeature";

describe("when isSdkFeature", () => {
  it.each([{}, true, false, "fancy feature", 123])(
    "with %p then should return false",
    (param) => {
      expect(isSdkFeature(param)).toBe(false);
    }
  );

  it.each(["sms", "tel", "calendar", "inlineVideo", "storePicture"])(
    "with %p then should return true",
    (param) => {
      expect(isSdkFeature(param)).toBe(true);
    }
  );
});

test("when joinedSdkFeatures then should return correct joined string", () => {
  const featuresString = joinedSdkFeatures();
  expect(featuresString).toBe(
    "[sms, tel, calendar, storePicture, inlineVideo]"
  );
});
