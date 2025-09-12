//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { handle } from './delimiters'

// ---

export type Block =
  {
    selectors: string[],
    properties?: { key: string, value: string }[],
    children?: Block[],
    metadata: {
      start: { line: number; column: number };
      end?: { line: number; column: number }
    }
  }

type Parser = ReturnType<typeof createParser>;

// ---

export function createParser ()
{
  const instance =
  {
    state:
    {
      buffer: '',
      tree: [] as Block[],
      stack: [] as Block[],
      selectorStack: [] as string[],

      currentPosition: 0,
      currentLine: 1,
      currentColumn: 1,
      currentPropertyName: '',
      currentParenthesisLevel: 0,

      isAtRule: false,
      isCustomProperty: false,
      isNestedSelector: false,
      isStringLiteral: false
    },

    // ...

    parse (input: string)
    {
      const state = this.state as Parser['state'];

      while (this.state.currentPosition < input.length)
      {
        const character = input[state.currentPosition];

        switch (character)
        {
          case '{': handle.openingBrace(state); break;
          case '}': handle.closingBrace(state); break;
          case '(': handle.openingParenthesis(state); break;
          case ')': handle.closingParenthesis(state); break;

          case ';': handle.semicolon(state); break;
          case ',': handle.comma(state); break;
          case ':': handle.colon(state); break;
          case '&': handle.ampersand(state); break;
          case '@': handle.atSign(state); break;
          case '"': handle.doubleQuote(state); break;

          default: state.buffer += character;
        }

        state.currentLine += (character === '\n') ? 1 : 0;
        state.currentColumn = (character === '\n') ? 1 : state.currentColumn + 1;

        state.currentPosition++;
      }

      if (state.stack.length > 0)
      {
        throw new ParsingError(
          'Unexpected end of string (missing closing brace)', state
        );
      }

      return state.tree;
    }
  }

  return instance;
}

// ---

export class ParsingError extends Error
{
  constructor (message: string, state: Parser['state'])
  {
    super(`Parsing error: ${message} @ line ${state.currentLine} (column ${state.currentColumn}).`);

    this.name = 'ParsingError';
  }
}