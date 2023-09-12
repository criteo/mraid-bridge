import {
  ClosePosition,
  ResizeProperties,
  ResizePropertiesValidator,
} from "../src/resize";
import { Size } from "../src/size";
import { Position } from "../src/position";

let resizePropertiesValidator: ResizePropertiesValidator;

beforeEach(() => {
  resizePropertiesValidator = new ResizePropertiesValidator();
});

describe("when create resize properties", () => {
  test("given passed all values should have them as properties", () => {
    const resizeProperties = new ResizeProperties(
      100,
      100,
      0,
      0,
      ClosePosition.Center,
      false
    );

    expect(resizeProperties.width).toBe(100);
    expect(resizeProperties.height).toBe(100);
    expect(resizeProperties.offsetX).toBe(0);
    expect(resizeProperties.offsetY).toBe(0);
    expect(resizeProperties.customClosePosition).toBe(ClosePosition.Center);
    expect(resizeProperties.allowOffscreen).toBe(false);
  });

  test("given closePosition and allowOffscreen not passed should have default values", () => {
    const resizeProperties = new ResizeProperties(100, 100, 0, 0);

    expect(resizeProperties.customClosePosition).toBe(ClosePosition.TopRight);
    expect(resizeProperties.allowOffscreen).toBe(true);
  });
});

test("when copy resize properties should have the same values", () => {
  const resizeProperties = new ResizeProperties(
    100,
    100,
    0,
    0,
    ClosePosition.Center,
    false
  );

  const copiedResizedProperties = resizeProperties.copy();

  expect(resizeProperties).toEqual(copiedResizedProperties);
});

describe("when ResizePropertiesInteractor.validate", () => {
  test("given undefined resize properties should return proper error message", () => {
    const result = resizePropertiesValidator.validate(
      undefined,
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe("Resize properties object is not passed");
  });

  test("given null resize properties should return proper error message", () => {
    const result = resizePropertiesValidator.validate(
      null,
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe("Resize properties object is not passed");
  });

  test("given empty object should return proper error message", () => {
    const result = resizePropertiesValidator.validate(
      {},
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe("Resize properties object is empty");
  });

  it.each([null, undefined, NaN])(
    "given %p width should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        { width: param, height: 100, offsetX: 0, offsetY: 0 },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("width property is required");
    }
  );

  it.each([Infinity, -Infinity, "123", new Set(), true])(
    "given %p width should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        { width: param, height: 100, offsetX: 0, offsetY: 0 },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("width should be valid integer");
    }
  );

  it.each([-123, 0, 42])(
    "given %p width should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: param,
          height: 100,
          offsetX: 0,
          offsetY: 0,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("width should be at least 50");
    }
  );

  test("given width is bigger that max width should return proper error message", () => {
    const result = resizePropertiesValidator.validate(
      {
        width: 666,
        height: 100,
        offsetX: 0,
        offsetY: 0,
      },
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe("width is bigger than getMaxSize().width");
  });

  it.each([null, undefined, NaN])(
    "given %p height should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: param,
          offsetX: 0,
          offsetY: 0,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("height property is required");
    }
  );

  it.each([Infinity, -Infinity, "123", new Set(), true])(
    "given %p height should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        { width: 100, height: param, offsetX: 0, offsetY: 0 },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("height should be valid integer");
    }
  );

  it.each([-123, 0, 42])(
    "given %p height should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: param,
          offsetX: 0,
          offsetY: 0,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("height should be at least 50");
    }
  );

  test("given height is bigger that max width should return proper error message", () => {
    const result = resizePropertiesValidator.validate(
      {
        width: 200,
        height: 777,
        offsetX: 0,
        offsetY: 0,
      },
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe("height is bigger than getMaxSize().height");
  });

  it.each([null, undefined, NaN])(
    "given %p offsetX should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: 100,
          offsetX: param,
          offsetY: 0,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("offsetX property is required");
    }
  );

  it.each([Infinity, -Infinity, "123", new Set(), true])(
    "given %p offsetX should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        { width: 100, height: 100, offsetX: param, offsetY: 0 },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("offsetX should be valid integer");
    }
  );

  test("given zero offsetX should return null", () => {
    const result = resizePropertiesValidator.validate(
      { width: 100, height: 100, offsetX: 0, offsetY: 0 },
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe(null);
  });

  it.each([null, undefined, NaN])(
    "given %p offsetY should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: 100,
          offsetX: 0,
          offsetY: param,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("offsetY property is required");
    }
  );

  it.each([Infinity, -Infinity, "123", new Set(), true])(
    "given %p offsetY should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        { width: 100, height: 100, offsetX: 0, offsetY: param },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("offsetY should be valid integer");
    }
  );

  test("given zero offsetY should return null", () => {
    const result = resizePropertiesValidator.validate(
      { width: 100, height: 100, offsetX: 0, offsetY: 0 },
      new Size(300, 500),
      new Position(0, 0, 100, 100)
    );
    expect(result).toBe(null);
  });

  it.each([Infinity, -Infinity, new Set(), 123])(
    "given %p customClosePosition should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: 100,
          offsetX: 0,
          offsetY: 0,
          customClosePosition: param,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("customClosePosition should be a string");
    }
  );

  it.each([
    "centerOrNot",
    "bottomcenter",
    "bottom center",
    "bottom_center",
    "Bottom-center",
  ])(
    "given %p customClosePosition should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: 100,
          offsetX: 0,
          offsetY: 0,
          customClosePosition: param,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe(
        "customClosePosition should be one of [top-left, top-right, center, bottom-left, bottom-right, top-center, bottom-center]"
      );
    }
  );

  it.each([Infinity, -Infinity, new Set(), 123, "string"])(
    "given %p allowOffscreen should return proper error message",
    (param) => {
      const result = resizePropertiesValidator.validate(
        {
          width: 100,
          height: 100,
          offsetX: 0,
          offsetY: 0,
          allowOffscreen: param,
        },
        new Size(300, 500),
        new Position(0, 0, 100, 100)
      );
      expect(result).toBe("allowOffscreen should be boolean");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, -20),
    new ResizeProperties(300, 300, 0, 488),
    new ResizeProperties(300, 300, 201, 0),
    new ResizeProperties(300, 300, -251, 0),
    new ResizeProperties(300, 300, -251, 499, undefined, undefined),
  ])(
    // undefined means top-right by default
    "given close position is undefined and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, -20, ClosePosition.TopRight),
    new ResizeProperties(300, 300, 0, 488, ClosePosition.TopRight),
    new ResizeProperties(300, 300, 201, 0, ClosePosition.TopRight),
    new ResizeProperties(300, 300, -251, 0, ClosePosition.TopRight),
    new ResizeProperties(
      300,
      300,
      -251,
      499,
      ClosePosition.TopRight,
      undefined
    ),
  ])(
    "given close position is top-right and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, -20, ClosePosition.TopLeft),
    new ResizeProperties(300, 300, 0, 488, ClosePosition.TopLeft),
    new ResizeProperties(300, 300, 467, 0, ClosePosition.TopLeft),
    new ResizeProperties(300, 300, -23, 0, ClosePosition.TopLeft),
    new ResizeProperties(300, 300, -42, 499, ClosePosition.TopLeft),
  ])(
    "given close position is top-left and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, -20, ClosePosition.TopCenter),
    new ResizeProperties(300, 300, 0, 488, ClosePosition.TopCenter),
    new ResizeProperties(300, 300, 353, 0, ClosePosition.TopCenter),
    new ResizeProperties(300, 300, -352, 0, ClosePosition.TopCenter),
    new ResizeProperties(300, 300, -351, 499, ClosePosition.TopCenter),
  ])(
    "given close position is top-center and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, 203, ClosePosition.BottomRight),
    new ResizeProperties(300, 300, 0, -488, ClosePosition.BottomRight),
    new ResizeProperties(300, 300, 204, 0, ClosePosition.BottomRight),
    new ResizeProperties(300, 300, -289, 0, ClosePosition.BottomRight),
    new ResizeProperties(300, 300, -288, 499, ClosePosition.BottomRight),
  ])(
    "given close position is bottom-right and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, 203, ClosePosition.BottomLeft),
    new ResizeProperties(300, 300, 0, -487, ClosePosition.BottomLeft),
    new ResizeProperties(300, 300, 467, 0, ClosePosition.BottomLeft),
    new ResizeProperties(300, 300, -23, 0, ClosePosition.BottomLeft),
    new ResizeProperties(300, 300, -42, 204, ClosePosition.BottomLeft),
  ])(
    "given close position is bottom-left and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, 203, ClosePosition.BottomCenter),
    new ResizeProperties(300, 300, 0, -488, ClosePosition.BottomCenter),
    new ResizeProperties(300, 300, 354, 0, ClosePosition.BottomCenter),
    new ResizeProperties(300, 300, -354, 0, ClosePosition.BottomCenter),
    new ResizeProperties(300, 300, -354, 499, ClosePosition.BottomCenter),
  ])(
    "given close position is bottom-center and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, -154, ClosePosition.Center),
    new ResizeProperties(300, 300, 0, 351, ClosePosition.Center),
    new ResizeProperties(300, 300, -156, 0, ClosePosition.Center),
    new ResizeProperties(300, 300, 352, 0, ClosePosition.Center),
    new ResizeProperties(300, 300, -158, 499, ClosePosition.Center),
  ])(
    "given close position is center and close button is offscreen should return proper error message",
    (resizeProperties) => {
      const result = resizePropertiesValidator.validate(
        resizeProperties,
        new Size(500, 500),
        new Position(0, 0, 200, 200)
      );
      expect(result).toBe("Close button will be offscreen");
    }
  );

  it.each([
    new ResizeProperties(300, 300, 0, 20, ClosePosition.Center, true),
    new ResizeProperties(300, 300, 0, 351, ClosePosition.TopRight, false),
    new ResizeProperties(300, 300, -50, 0),
    new ResizeProperties(300, 300, 100, 100, ClosePosition.Center),
    new ResizeProperties(300, 300, 150, 50),
  ])("given valid resize properties should return null", (resizeProperties) => {
    const result = resizePropertiesValidator.validate(
      resizeProperties,
      new Size(500, 500),
      new Position(0, 0, 200, 200)
    );
    expect(result).toBe(null);
  });
});
