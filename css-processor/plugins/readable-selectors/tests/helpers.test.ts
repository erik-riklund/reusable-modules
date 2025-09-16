//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { parseSelector } from '../helpers'

// ---

it('should parse a selector with a single label',

  async () =>
  {
    const result = parseSelector('group *', ['name'], 'group "foo"');

    expect(result).toEqual({ name: 'foo' });
  }
);

// ---

it('should parse a selector with a single string value',

  async () =>
  {
    const result = parseSelector('group **', ['name'], 'group "foo"');

    expect(result).toEqual({ name: 'foo' });
  }
);

// ---

it('should parse a selector with a keyword and a single label',

  async () =>
  {
    const result = parseSelector('group {is,is not} *', ['keyword', 'name'], 'group is "foo"');

    expect(result).toEqual({ keyword: 'is', name: 'foo' });
  }
);

// ---

it('should parse a selector with a label and an optional keyword',

  async () =>
  {
    const result = parseSelector('attribute * [is missing]', ['name', 'keyword'], 'attribute "foo" is missing');

    expect(result).toEqual({ name: 'foo', keyword: 'is missing' });
  }
);

// ---

it('should parse a selector with a label and an optional keyword (absence)',

  async () =>
  {
    const result = parseSelector('attribute * [is missing]', ['name', 'keyword'], 'attribute "foo"');

    expect(result).toEqual({ name: 'foo', keyword: undefined });
  }
);

// ---

it('should parse a selector with an optional label',

  async () =>
  {
    const result = parseSelector('selector *? .. *', ['modifier', 'name'], 'selector "foo" .. "bar"');

    expect(result).toEqual({ modifier: 'foo', name: 'bar' });
  }
);

// ---

it('should parse a selector with an optional label (absence)',

  async () =>
  {
    const result = parseSelector('selector *? .. *', ['modifier', 'name'], 'selector .. "bar"');

    expect(result).toEqual({ modifier: undefined, name: 'bar' });
  }
);