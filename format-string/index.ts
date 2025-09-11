//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 1.1.0
//

export const formatString = (input: string, values: unknown[]) =>
{
  return input.replace
    (
      /%(\{\d+\}|\d+)/g,

      (_, index: string) => 
      {
        index = index.replace(/[{}]/g, '');

        return String(values[Number(index) - 1]) ?? 'undefined';
      }
    );
}