import { Anything } from "./utils";

export enum SdkFeature {
  Sms = "sms",
  Tel = "tel",
  Calendar = "calendar",
  StorePicture = "storePicture",
  InlineVideo = "inlineVideo",
}

export class SupportedSdkFeatures {
  sms: boolean;

  tel: boolean;

  inlineVideo: boolean;

  readonly calendar = false;

  readonly storePicture = false;

  constructor(sms: boolean, tel: boolean, inlineVideo: boolean) {
    this.sms = sms;
    this.tel = tel;
    this.inlineVideo = inlineVideo;
  }
}

export function isSdkFeature(value: Anything) {
  return value && Object.values(SdkFeature).includes(value);
}

export function joinedSdkFeatures(): string {
  return `[${Object.values(SdkFeature).join(", ")}]`;
}

export const defaultSupportedSdkFeatures = new SupportedSdkFeatures(
  false,
  false,
  false
);
