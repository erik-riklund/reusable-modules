//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.1.0
//

export const formatString = (input: string, values: Array<string>) =>
{
  return input.replace
    (
      /%(\{\d+\}|\d+)/g,

      (_, index: string) => 
      {
        index = index.replace(/[{}]/g, '');

        return values[Number(index) - 1] ?? 'undefined';
      }
    );
}