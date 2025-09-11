//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import type { AbstractTree, Block } from 'css-pipeline/types'

/**
 * Initializes and returns a new parser state object.
 */
export const makeParserState = () =>
{
  return {
    /**
     * The buffer holds the characters that are currently being parsed.
     */
    buffer: '',

    /**
     * Holds the root of the abstract tree, which is an array of blocks.
     * Each block contains selectors, properties, and potentially nested blocks.
     */
    tree: [] as AbstractTree,

    /**
     * Holds the stack of blocks that are currently being parsed.
     * The stack maintains the hierarchy of nested blocks.
     */
    stack: [] as Block[],

    /**
     * Tracks the current position in the input string.
     */
    currentPosition: 0,

    /**
     * Tracks the current line in the input string.
     */
    currentLine: 1,

    /**
     * Tracks the current column in the input string.
     */
    currentColumn: 1,

    /**
     * Tracks the name of the property that is currently being parsed.
     */
    currentPropertyName: '',

    /**
     * Tracks the current parenthesis level. Used when parsing selectors.
     */
    currentParenthesisLevel: 0,

    /**
     * Holds the selectors for the block that is currently being parsed.
     */
    selectorStack: [] as string[],

    /**
     * Indicates whether an at-rule is currently being parsed.
     */
    isAtRule: false,

    /**
     * Indicates whether a custom property is currently being parsed.
     */
    isCustomProperty: false,

    /**
     * Indicates whether a nested selector is currently being parsed.
     */
    isNestedSelector: false,

    /**
     * Indicates whether a string literal is currently being parsed.
     */
    isStringLiteral: false
  }
}