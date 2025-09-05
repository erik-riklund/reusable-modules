//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

export {};

declare global
{
  type JsonArray = Array<JsonValue>;
  type JsonObject = { [key: string]: JsonValue; };
  type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

  type MaybePromise<T> = T | Promise<T>;
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
}