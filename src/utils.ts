export type SafeString = string | null | undefined;

export function isFunction(any: any): boolean {
  return typeof any === "function";
}

/**
 * Used in public methods to enable type checks and testing since mraid
 * will be used form javascript
 */
export declare type Anything = null | undefined | any;
