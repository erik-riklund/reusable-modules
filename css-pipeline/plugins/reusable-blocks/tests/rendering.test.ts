//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect, beforeEach } from 'bun:test'
import { createCssPipeline } from 'css-pipeline'
import { reusableBlocks } from '..'

// ---

let engine: (input: string) => string;

beforeEach(
  () => engine = createCssPipeline([...reusableBlocks()])
);

// ---

it('should not render reusable block declarations',
  () =>
  {
    const input = 'reusable test { color: red; }';

    expect(engine(input)).toBe('');
  }
);

it('should render the properties from the specified reusable block',
  () =>
  {
    const input = 'reusable test { color: red; } span { !include: test; }';

    expect(engine(input)).toBe('span{color:red}');
  }
);

it('should render the properties from the specified reusable blocks',
  () =>
  {
    const input = 'reusable `test` { color: red; }' +
      'reusable test2 { background-color: pink; } span { !include: test, test2; }';

    expect(engine(input)).toBe('span{color:red;background-color:pink}');
  }
);

it('should render a reusable block with spaces in its name',
  () =>
  {
    const input = 'reusable `test with spaces` { color: red; } span { !include: `test with spaces`; }';

    expect(engine(input)).toBe('span{color:red}');
  }
);