export {};

declare global
{
  /**
   * Represents a JSON value.
   */
  type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonArray;

  /**
   * Represents an array of JSON values.
   */
  type JsonArray = Array<JsonValue>;

  /**
   * Represents an object with string keys and JSON values.
   */
  type JsonObject = { [key: string]: JsonValue; };

  /**
   * Represents a value that could be `undefined`.
   */
  type Optional<T> = T | undefined;

  /**
   * Represents a value that could be `null`.
   */
  type MaybeNull<T> = T | null;

  /**
   * Represents a value that could be a `Promise`.
   */
  type MaybePromise<T> = T | Promise<T>;

  /**
   * Represents a value that could be `void`.
   */
  type MaybeVoid<T> = T | void;
}