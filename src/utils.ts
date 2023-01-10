export type SafeString = string | null | undefined;

export function isFunction(any: any): boolean {
  return typeof any === "function";
}
