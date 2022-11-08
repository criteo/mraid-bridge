const mraid: MRAID = {
  getVersion(): string {
    return "1.0";
  },

  addEventListener(event: string, listener: Function) {
    console.log(
      `addEventListener(), event -> ${event}, listener -> ${listener}`
    );
  },

  removeEventListener(event: string, listener: Function) {
    console.log(
      `removeEventListener(), event -> ${event}, listener -> ${listener}`
    );
  },

  getState(): string {
    return "loading";
  },

  getPlacementType(): string {
    return "inline";
  },

  isViewable(): boolean {
    return true;
  },

  expand(url?: URL) {
    console.log(`expand(), url -> ${url}`);
  },

  getExpandProperties(): ExpandProperties {
    // TODO: verify proper return type
    return new ExpandProperties(1, 1, false, false);
  },

  setExpandProperties(properties: ExpandProperties) {
    // TODO: verify proper set type
    console.log(`setExpandProperties(), properties -> ${properties}`);
  },

  close() {
    console.log("close()");
  },

  useCustomClose(useCustomClose: boolean) {
    console.log(`useCustomClose(), useCustomClose -> ${useCustomClose}`);
  },

  open(url: URL) {
    console.log(`open(), url -> ${url}`);
  },
};

export default mraid;
