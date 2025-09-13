//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { reusableBlocks } from '..'
import { createBuildEngine } from 'css-build-engine'
import { it, expect, beforeEach } from 'bun:test'

// ---

let transform: (input: string) => Promise<string>;
beforeEach(() => transform = createBuildEngine([...reusableBlocks()]));

// ---

it('should throw an error when encountering a reusable block with more than one selector',

  async () =>
  {
    const input = 'reusable block: test, div {}';

    expect(() => transform(input)).toThrowError('A reusable block cannot have more than one selector');
  }
);

// ---

it('should throw an error when encountering a reusable block with children',

  async () =>
  {
    const input = 'reusable block: test {span {}}';

    expect(() => transform(input)).toThrowError('A reusable block cannot have children');
  }
);

// ---

it('should throw when a reusable block name is not unique',

  async () =>
  {
    const input = 'reusable block: test {} reusable block: test {}';

    expect(() => transform(input)).toThrowError('Non-unique reusable block name (test)');
  }
);

// ---

it('should throw an error when encountering an unknown reusable block name',

  async () =>
  {
    const input = 'div {!include: test;}';

    expect(() => transform(input)).toThrowError('Unknown reusable block (test)');
  }
);

// ---

it('should not render reusable block declarations',

  async () =>
  {
    const input = 'reusable block: test { color: red; }';

    expect(await transform(input)).toBe('');
  }
);

// ---

it('should render the properties from the specified reusable block',

  async () =>
  {
    const input = 'reusable block: test { color: red; } span { !include: test; }';

    expect(await transform(input)).toBe('span{color:red}');
  }
);

// ---

it('should render the properties from the specified reusable blocks',

  async () =>
  {
    const input = 'reusable block: test { color: red; }reusable block: test2 { background-color: pink; } span { !include: test, test2; }';

    expect(await transform(input)).toBe('span{color:red;background-color:pink}');
  }
);

// ---

it('should render a reusable block with spaces in its name',

  async () =>
  {
    const input = 'reusable block: test with spaces { color: red; } span { !include: test with spaces; }';

    expect(await transform(input)).toBe('span{color:red}');
  }
);