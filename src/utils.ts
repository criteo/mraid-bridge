export type SafeString = string | null | undefined;

export function isFunction(any: any): boolean {
  return typeof any === "function";
}

export function isNumber(any: any): boolean {
  return typeof any === "number";
}

/**
 * Used in public methods to enable type checks and testing since mraid
 * will be used from javascript
 */
export declare type Anything = null | undefined | any;

/**
 * Used to accept both string and URL in public methods
 */
export declare type Url = string | URL;
