//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { formatString } from 'format-string'

// ---

it('should replace placeholders with correct values',

  () =>
  {
    const input = 'Hello, %1! Today is %2.';
    const values = ['World', 'a great day'];

    expect(formatString(input, values)).toBe('Hello, World! Today is a great day.');
  }
);

// ---

it('should handle multiple occurrences of the same placeholder',

  () =>
  {
    const input = 'The value is %1, and it is also %1.';
    const values = ['42'];

    expect(formatString(input, values)).toBe('The value is 42, and it is also 42.');
  }
);

// ---

it('should replace with "undefined" for missing values',

  () =>
  {
    const input = 'User %1 logged in from %2.';
    const values = ['Alice'];

    expect(formatString(input, values)).toBe('User Alice logged in from undefined.');
  }
);

// ---

it('should return the original string if no placeholders are present',

  () =>
  {
    const input = 'This is a test string.';
    const values = ['A', 'B', 'C'];

    expect(formatString(input, values)).toBe('This is a test string.');
  }
);

// ---

it('should handle placeholders in a non-sequential order',

  () =>
  {
    const input = 'The second value is %2 and the first is %1.';
    const values = ['second', 'first'];

    expect(formatString(input, values)).toBe('The second value is first and the first is second.');
  }
);

// ---

it('should return an empty string for empty input',

  () =>
  {
    const input = '';
    const values = ['Hello', 'World'];

    expect(formatString(input, values)).toBe('');
  }
);

// ---

it('should replace all placeholders with "undefined" when values array is empty',

  () =>
  {
    const input = 'Value one: %1. Value two: %2.';

    expect(formatString(input, [])).toBe('Value one: undefined. Value two: undefined.');
  }
);


// ---

it('should replace placeholders which use curly braces',

  async () =>
  {
    const input = 'Hello %{1}! Today is %{2}.';
    const values = ['world', 'a great day'];

    expect(formatString(input, values)).toBe('Hello world! Today is a great day.');
  }
);