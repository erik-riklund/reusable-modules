//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { parse } from '../stages/parse'

// ---

it('should parse a template into chunks',

  async () =>
  {
    const template = 'Hello world';
    const chunks = await parse(template);

    expect(chunks).toEqual([
      { type: 'text', content: 'Hello world' }
    ]);
  }
);

// ---

it('should parse a template with variables into chunks',

  async () =>
  {
    const template = 'Hello {$name}, nice to see you again!';
    const chunks = await parse(template);

    expect(chunks).toEqual([
      { type: 'text', content: 'Hello ' },
      { type: 'variable', content: '{$name}' },
      { type: 'text', content: ', nice to see you again!' }
    ]);
  }
);

// ---

it('should parse a template with multiple variables into chunks',

  async () =>
  {
    const template = 'Hello {$firstName}! Do you still live in {$city}?';
    const chunks = await parse(template);

    expect(chunks).toEqual([
      { type: 'text', content: 'Hello ' },
      { type: 'variable', content: '{$firstName}' },
      { type: 'text', content: '! Do you still live in ' },
      { type: 'variable', content: '{$city}' },
      { type: 'text', content: '?' }
    ]);
  }
);

// ---

it('should parse a template with directives into chunks',

  async () =>
  {
    const template = '@directive\nHello world\n===';
    const chunks = await parse(template);

    expect(chunks).toEqual([
      { type: 'directive', content: '@directive' },
      { type: 'text', content: 'Hello world' },
      { type: 'directive', content: '===' }
    ]);
  }
);

// ---

it('should parse a template with directives and variables into chunks',

  async () =>
  {
    const template = '@directive\nHello {$name}, nice to see you again!\n===';
    const chunks = await parse(template);

    expect(chunks).toEqual([
      { type: 'directive', content: '@directive' },
      { type: 'text', content: 'Hello ' },
      { type: 'variable', content: '{$name}' },
      { type: 'text', content: ', nice to see you again!' },
      { type: 'directive', content: '===' }
    ]);
  }
);