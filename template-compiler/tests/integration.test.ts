//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { describe, it, expect } from 'bun:test'
import { compileTemplate } from 'template-compiler'

// ---

describe('toString',
  () =>
  {
    it('should return a stringifed render function',

      async () =>
      {
        const input = 'Hello world\nI\'m a template!';
        const result = await compileTemplate.toString(input);

        expect(result).toContain(input);
      }
    );

    // ---
  }
);

// ---

describe('toFunction',
  () =>
  {
    it('should return a function that renders the template',

      async () =>
      {
        const input = 'Hello world\nI\'m a template!';
        const render = await compileTemplate.toFunction(input);

        expect(typeof render).toBe('function');
        expect(render({})).toBe(input);
      }
    );

    // ---

    // ...
  }
);