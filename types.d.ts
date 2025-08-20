export {};

declare global
{
  /**
   * Represents a value that could be a `Promise`.
   */
  type Awaitable<T> = T | Promise<T>;

  /**
   * Represents an array of JSON values.
   */
  type JsonArray = Array<JsonValue>;

  /**
   * Represents an object with string keys and JSON values.
   */
  type JsonObject = { [key: string]: JsonValue; };

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
   * Represents a value that could be `null`.
   */
  type Nullable<T> = T | null;

  /**
   * Represents a value that could be `undefined`.
   */
  type Optional<T> = T | undefined;
}