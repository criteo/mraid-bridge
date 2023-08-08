export class Position {
  /**
   * X position in density-independent pixels
   */
  x: number;

  /**
   * Y position in density-independent pixels
   */
  y: number;

  /**
   * Width is density-independent pixels
   */
  width: number;

  /**
   * Height in density-independent pixels
   */
  height: number;

  clone(): Position {
    return new Position(this.x, this.y, this.width, this.height);
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export const initialPosition = new Position(0, 0, 0, 0);
