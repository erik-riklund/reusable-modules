//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { createParser } from '../parser'
import { createTransformer } from '../transformer'
import { it, expect, beforeEach } from 'bun:test'

import type { MutableBlock } from '..'

// ---

let parser: ReturnType<typeof createParser>;
beforeEach(() => parser = createParser());

// ---

it('should add a new property to the block',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');

    const plugin = async (block: MutableBlock) =>
    {
      block.setProperty('background-color', 'blue');
    }

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].properties).toContainEqual({ key: 'background-color', value: 'blue' });
  }
);

// ---

it('should change the value of an existing property',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');

    const plugin = async (block: MutableBlock) =>
    {
      block.setProperty('color', 'blue');
    }

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].properties).toContainEqual({ key: 'color', value: 'blue' });
  }
);

// ---

it('should remove a specific property from the block',

  async () =>
  {
    const tree = parser.parse('h1{color:red;background-color:blue;}');

    const plugin = async (block: MutableBlock) =>
    {
      block.removeProperty('background-color');
    }

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].properties).toContainEqual({ key: 'color', value: 'red' });
    expect(tree[0].properties).not.toContainEqual({ key: 'background-color', value: 'blue' });
  }
);

// ---

it('should determine whether a block has a specific property',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');

    const plugin = async (block: MutableBlock) =>
    {
      expect(block.hasProperty('color')).toBe(true);
      expect(block.hasProperty('background-color')).toBe(false);
    }

    await createTransformer().transform(tree, [plugin]);
  }
);

// ---

it('should add a new selector to the block',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');
    const plugin = async (block: MutableBlock) => block.addSelector('h2');

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].selectors).toContainEqual('h2');
  }
);

// ---

it('should remove a specific selector from the block',

  async () =>
  {
    const tree = parser.parse('h1,h2{color:red;}');
    const plugin = async (block: MutableBlock) => block.removeSelector('h2');

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].selectors).not.toContainEqual('h2');
  }
);

// ---

it('should change the value of an existing selector',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');
    const plugin = async (block: MutableBlock) => block.replaceSelector('h1', 'h2');

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].selectors).toContainEqual('h2');
  }
);

// ---

it('should replace all the selectors in the block',

  async () =>
  {
    const tree = parser.parse('h1,h2{color:red;}');
    const plugin = async (block: MutableBlock) => block.setSelectors(['h3', 'h4']);

    await createTransformer().transform(tree, [plugin]);

    expect(tree[0].selectors).toEqual(['h3', 'h4']);
  }
);

// ---

it('should determine whether a block has a specific selector',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');

    const plugin = async (block: MutableBlock) =>
    {
      expect(block.hasSelector('h1')).toBe(true);
      expect(block.hasSelector('h2')).toBe(false);
    }

    await createTransformer().transform(tree, [plugin]);
  }
);

// ---

it('should return a list of all selectors in the block',

  async () =>
  {
    const tree = parser.parse('h1,h2{color:red;}');

    const plugin = async (block: MutableBlock) =>
    {
      expect(block.getSelectors()).toEqual(['h1', 'h2']);
    }

    await createTransformer().transform(tree, [plugin]);
  }
);

// ---

it('should add a new selector to the block if it does not already exist',

  async () =>
  {
    const tree = parser.parse('h1{color:red;}');
    
    const plugin = async (block: MutableBlock) =>
    {
      block.addSelector('h2');
      expect(block.getSelectors()).toEqual(['h1', 'h2']);

      block.addSelector('h1');
      expect(block.getSelectors()).toEqual(['h1', 'h2']);
    }

    await createTransformer().transform(tree, [plugin]);
  }
);

// ---

it('should remove an existing selector from the block',

  async () =>
  {
    const tree = parser.parse('h1,h2{color:red;}');
    
    const plugin = async (block: MutableBlock) =>
    {
      block.removeSelector('h1');

      expect(block.getSelectors()).toEqual(['h2']);
    }

    await createTransformer().transform(tree, [plugin]);
  }
);

// ---

it('should replace an existing selector in the block',

  async () =>
  {
    const tree = parser.parse('h1,h2{color:red;}');
    
    const plugin = async (block: MutableBlock) =>
    {
      block.replaceSelector('h1', 'h3');

      expect(block.getSelectors()).toEqual(['h3', 'h2']);
    }

    await createTransformer().transform(tree, [plugin]);
  }
);