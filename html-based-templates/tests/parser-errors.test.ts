//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect, beforeEach } from 'bun:test'
import { createTemplateParser } from '../transpiler/parser'

// ---

let parser: ReturnType<typeof createTemplateParser>;
beforeEach(() => parser = createTemplateParser());

// ---

it('should throw an error when encountering an unexpected opening bracket',

  async () =>
  {
    expect(() => parser.parse('<div<>One Two</div>')).toThrowError('unexpected opening bracket');
    expect(() => parser.parse('<div>One < Two</div>')).toThrowError('unexpected opening bracket');
  }
)

// ---

it('should not throw an error when encountering an opening bracket inside an attribute value',

  async () =>
  {
    expect(() => parser.parse('<div foo="one < two">Hello world</div>')).not.toThrowError('unexpected opening bracket');
  }
)

// ---

it('should throw an error when encountering a closing bracket without an opening bracket',

  async () =>
  {
    expect(() => parser.parse('div>One</div>')).toThrowError('unexpected closing bracket');
  }
)

// ---

it('should not throw an error when encountering a closing bracket inside an attribute value',

  async () =>
  {
    expect(() => parser.parse('<div foo="two > one">Hello world</div>')).not.toThrowError('unexpected closing bracket');
  }
)

// ---

it('should throw an error when encountering an unexpected forward slash',

  async () =>
  {
    expect(() => parser.parse('<div>One<br />Two</div>')).toThrowError('unexpected forward slash');
    expect(() => parser.parse('<div>One / Two</div>')).not.toThrowError('unexpected forward slash');
  }
)

// ---

it('should throw an error when encountering an unexpected space',

  async () =>
  {
    expect(() => parser.parse('<div>One Two</div >')).toThrowError('unexpected space');
    expect(() => parser.parse('<div>One Two</div>')).not.toThrowError('unexpected space');
  }
)

// ---

it('should throw an error when encountering an unexpected equals sign',

  async () =>
  {
    expect(() => parser.parse('<div ="bar">One</div>')).toThrowError('unexpected equals sign');
    expect(() => parser.parse('<div>One = Two</div>')).not.toThrowError('unexpected equals sign');
  }
)

// ---

it('should not throw an error when encountering an equals sign inside an attribute value',

  async () =>
  {
    expect(() => parser.parse('<div foo="one = two">Hello world</div>')).not.toThrowError('unexpected equals sign');
  }
)