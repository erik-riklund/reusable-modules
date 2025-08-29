//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { compileTemplate } from 'template-compiler'

// ---

it('should return a stringifed render function',

  async () =>
  {
    const input = 'Hello world\nI\'m a template!';
    const result = await compileTemplate.toString(input);

    expect(result.trim()).toStartWith('(context) =>');
    expect(result).toContain(input);
  }
);

// ---

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

it('should replace and sanitize variables',

  async () =>
  {
    const input = 'Hello {$name}';
    const render = await compileTemplate.toFunction(input);

    expect(render({ name: '<Erik>' })).toBe('Hello &lt;Erik&gt;');
  }
);

// ---

it('should replace variables without sanitizing them',

  async () =>
  {
    const input = 'Hello {$name!}';
    const render = await compileTemplate.toFunction(input);

    expect(render({ name: '<Erik>' })).toBe('Hello <Erik>');
  }
);