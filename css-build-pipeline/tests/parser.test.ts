//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { createParser } from '../parser'
import { it, expect, beforeEach } from 'bun:test'

// ---

let parser: ReturnType<typeof createParser>;
beforeEach(() => parser = createParser());

// ---

it('should parse an empty block',
  () =>
  {
    const tree = parser.parse('div{}');

    expect(tree[0].selectors).toContainEqual('div');
  }
);

it('should parse a block with properties',
  () =>
  {
    const tree = parser.parse('div{color:red;}');

    expect(tree[0].selectors).toEqual(['div']);
    expect(tree[0].properties).toEqual([{ key: 'color', value: 'red' }]);
  }
);

it('should parse nested blocks',
  () =>
  {
    const tree = parser.parse('div{& span{}}');

    expect(tree[0].selectors).toEqual(['div']);
    expect(tree[0].children![0].selectors).toEqual(['& span']);
  }
);

it('should parse nested blocks with properties',
  () =>
  {
    const tree = parser.parse('div{color:red;& span{color:blue;}}');

    expect(tree[0].selectors).toEqual(['div']);
    expect(tree[0].properties).toEqual([{ key: 'color', value: 'red' }]);

    expect(tree[0].children![0].selectors).toEqual(['& span']);
    expect(tree[0].children![0].properties).toEqual([{ key: 'color', value: 'blue' }]);
  }
);

// ---

it('should parse a pseudo-class selector',
  () =>
  {
    const tree = parser.parse('button:hover{}');

    expect(tree[0].selectors).toEqual(['button:hover']);
  }
);

it('should parse a nested pseudo-class selector',
  () =>
  {
    const tree = parser.parse('button{&:hover{}}');

    expect(tree[0].children![0].selectors).toEqual(['&:hover']);
  }
);

it('should parse a pseudo-element selector',
  () =>
  {
    const tree = parser.parse('button::before{}');

    expect(tree[0].selectors).toEqual(['button::before']);
  }
);

it('should parse an attribute selector',
  () =>
  {
    const tree = parser.parse('button[type="submit"]{}');

    expect(tree[0].selectors).toEqual(['button[type="submit"]']);
  }
);

it('should parse multiple selectors for a single block',
  () =>
  {
    const tree = parser.parse('h1,h2{}');

    expect(tree[0].selectors).toEqual(['h1', 'h2']);
  }
);

it('should parse multiple selectors for a nested block',
  () =>
  {
    const tree = parser.parse('div{& h1, & h2{}}');

    expect(tree[0].children![0].selectors).toEqual(['& h1', '& h2']);
  }
);

it('should parse a `@keyframes` selector',
  () =>
  {
    const tree = parser.parse('@keyframes test{}');

    expect(tree[0].selectors).toEqual(['@keyframes test']);
  }
);

it('should parse a `@media` selector',
  () =>
  {
    const tree = parser.parse('@media screen and (min-width: 576px){}');

    expect(tree[0].selectors).toEqual(['@media screen and (min-width: 576px)']);
  }
);

it('should parse a nested `@media` selector',
  () =>
  {
    const tree = parser.parse('div{color:red;@media screen and (min-width: 576px){color:blue}}');

    expect(tree[0].children![0].selectors).toEqual(['@media screen and (min-width: 576px)']);
  }
);

it('should parse a selector with commas inside parentheses',
  () =>
  {
    const tree = parser.parse('div{&:in(a, b){}}');

    expect(tree[0].children![0].selectors).toEqual(['&:in(a, b)']);
  }
);

it('should parse a selector with commas inside parentheses mixed with other selectors',
  () =>
  {
    const tree = parser.parse('div{& span, &:is(a, b), & h1{}}');

    expect(tree[0].children![0].selectors).toEqual(['& span', '&:is(a, b)', '& h1']);
  }
);

// ---

it('should throw an error when reaching the end of the string with unclosed blocks',
  () => expect(() => parser.parse('div{}span{')).toThrowError('Unexpected end of string')
);

it('should throw an error when encountering an unexpected closing brace',
  () => expect(() => parser.parse('div{}span}')).toThrowError('Unexpected closing brace')
);

it('should throw an error when encountering an unexpected colon',
  () => expect(() => parser.parse('div{color::red;}')).toThrowError('Unexpected colon')
);

it('should throw an error when encountering an unexpected semicolon',
  () => expect(() => parser.parse('div{color;}')).toThrowError('Unexpected semicolon')
);

it('should throw an error when encountering an unexpected semicolon (missing property value)',
  () => expect(() => parser.parse('div{color:;}')).toThrowError('Unexpected semicolon')
);

it('should throw an error when encountering an unexpected comma (missing selector)',
  () => expect(() => parser.parse(',div,span{}')).toThrowError('Unexpected comma (expected selector)')
);