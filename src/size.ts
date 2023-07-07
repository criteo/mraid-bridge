export class Size {
  /**
   * Width is density-independent pixels
   */
  width: number;

  /**
   * Height in density-independent pixels
   */
  height: number;

  clone(): Size {
    return new Size(this.width, this.height);
  }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
