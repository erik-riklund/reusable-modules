//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { createRenderer } from '../renderer'
import { it, expect, beforeEach } from 'bun:test'

// ---

let renderer: ReturnType<typeof createRenderer>;
beforeEach(() => renderer = createRenderer());

// ---

it('should throw an error when encountering nested media queries',

  async () =>
  {
    const tree = [{
      selectors: ['div'],
      children: [
        {
          selectors: ['@media screen and(min-width:576px)'],
          children: [{ selectors: ['@media screen and(max-width:959px)'] }]
        }
      ]
    }];

    // @ts-expect-error: No metadata provided during testing.
    expect(() => renderer.render(tree)).toThrowError('Nested media queries are not supported');
  }
);

// ---

it('should throw an error when encountering a media query nested inside a color scheme at-rule',

  async () =>
  {
    const tree = [{
      selectors: ['div'],
      children: [
        {
          selectors: ['@media(prefers-color-scheme:dark)'],
          children: [{ selectors: ['@media screen and(max-width:959px)'] }]
        }
      ]
    }];

    // @ts-expect-error: No metadata provided during testing.
    expect(() => renderer.render(tree)).toThrowError(
      'Responsive media queries cannot be nested inside color scheme at-rules'
    );
  }
);

// ---

it('should throw an error when encountering nested color scheme at-rules',

  async () =>
  {
    const tree = [{
      selectors: ['div'],
      children: [
        {
          selectors: ['@media(prefers-color-scheme:dark)'],
          children: [{ selectors: ['@media(prefers-color-scheme:light)'] }]
        }
      ]
    }];

    // @ts-expect-error: No metadata provided during testing.
    expect(() => renderer.render(tree)).toThrowError('Nested color scheme at-rules are not supported');
  }
);

// ---

it('should throw an error when encountering nested at-rules',

  async () =>
  {
    const tree = [{
      selectors: ['div'],
      children: [
        {
          selectors: ['@media screen and(min-width:576px)'],
          children: [{ selectors: ['@scope (.test)'] }]
        }
      ]
    }];

    // @ts-expect-error: No metadata provided during testing.
    expect(() => renderer.render(tree)).toThrowError('Nested at-rules are not allowed');
  }
);

// ---

it('should return an empty string when the tree is empty',

  async () => expect(renderer.render([])).toEqual('')
);

// ---

it('should render a block with a single selector',

  async () =>
  {
    const tree = [{
      selectors: ['div'],
      properties: [{ key: 'color', value: 'red' }]
    }];

    // @ts-expect-error: No metadata provided during testing.
    expect(renderer.render(tree)).toEqual('div{color:red}');
  }
);

// ---

it('should render a block with multiple properties',

  async () =>
  {
    const tree = [
      {
        selectors: ['div'],
        properties: [
          { key: 'color', value: 'red' },
          { key: 'background-color', value: 'blue' }
        ]
      }
    ];

    // @ts-expect-error: No metadata provided during testing.
    expect(renderer.render(tree)).toEqual('div{color:red;background-color:blue}');
  }
);

// ---

it('should render a block with a multiple selectors',

  async () =>
  {
    const tree = [{
      selectors: ['div', 'span', 'h1'],
      properties: [{ key: 'color', value: 'red' }]
    }];

    // @ts-expect-error: No metadata provided during testing.
    expect(renderer.render(tree)).toEqual('div,span,h1{color:red}');
  }
);

// ---

it('should render a block with children',

  async () =>
  {
    const tree = [
      {
        selectors: ['section'],
        children: [
          {
            selectors: ['& h1', '& h2'],
            children: [
              {
                selectors: ['& span'],
                properties: [{ key: 'color', value: 'red' }]
              }
            ]
          }
        ]
      }
    ];

    // @ts-expect-error: No metadata provided during testing.
    expect(renderer.render(tree)).toEqual('section h1 span,section h2 span{color:red}');
  }
);