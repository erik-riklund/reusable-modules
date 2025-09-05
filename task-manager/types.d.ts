//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

export interface Store
{
  getValue: <T> (name: string) => T;
  setValue: (name: string, value: unknown) => void;
}