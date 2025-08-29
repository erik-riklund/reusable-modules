//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { replaceVariables } from 'template-compiler/handlers/variables'

// ---

it('should test if a line contains a variable',

  () =>
  {
    expect(replaceVariables.test('{$userId}')).toBe(true);
    expect(replaceVariables.test('Hello world')).toBe(false);
  }
);

// ---

it('should transform a line containing variables',

  async () =>
  {
    const line = 'Hello {$name}';
    const [, result] = await replaceVariables.transform([0, line]);

    expect(result).toBe(
      "Hello ${sanitize(typeof name !== 'undefined' ? name : context.name ?? 'undefined')}"
    );
  }
);