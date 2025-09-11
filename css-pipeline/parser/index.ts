//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { delimiters as d } from './delimiters'
import { makeParserState } from './state'

import type { ParserState } from 'css-pipeline/types'

/**
 * Parses a CSS string and converts it into an abstract syntax tree.
 */
export const createTreeFromString = (input: string) =>
{
  const state = makeParserState();

  while (state.currentPosition < input.length)
  {
    const currentCharacter = input[state.currentPosition];

    switch (currentCharacter)
    {
      case '{': d.handleOpeningBrace(state); break;
      case '}': d.handleClosingBrace(state); break;
      case '(': d.handleOpeningParenthesis(state); break;
      case ')': d.handleClosingParenthesis(state); break;
      
      case ';': d.handleSemicolon(state); break;
      case ',': d.handleComma(state); break;
      case ':': d.handleColon(state); break;
      case '&': d.handleAmpersand(state); break;
      case '@': d.handleAtSign(state); break;
      case '"': d.handleDoubleQuote(state); break;

      default: state.buffer += currentCharacter;
    }

    state.currentLine += (currentCharacter === '\n') ? 1 : 0;
    state.currentColumn = (currentCharacter === '\n') ? 1 : state.currentColumn + 1;

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

/**
 * Represents an error that occurs during the parsing of a CSS string.
 */
export class ParsingError extends Error
{
  constructor(message: string, state: ParserState)
  {
    super(`Parsing error: ${message} @ line ${state.currentLine} (column ${state.currentColumn}).`);

    this.name = 'ParsingError';
  }
}