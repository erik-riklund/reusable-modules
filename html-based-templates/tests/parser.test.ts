//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect, beforeEach, mock } from 'bun:test'
import { createTemplateParser } from '../transpiler/parser'

// ---

let parser: ReturnType<typeof createTemplateParser>;
beforeEach(() => parser = createTemplateParser());

// ---

it('should do nothing when the template is empty',

  async () =>
  {
    expect(() => parser.parse('')).not.toThrowError();
  }
)

// ---

it('should invoke the text callback when encountering a text chunk',

  async () =>
  {
    const callback = mock((text) => {});

    parser.onText(callback);
    parser.parse('Hello world');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('Hello world');
  }
)

// ---

it('should invoke the opening tag callback when encountering an opening tag without attributes',

  async () =>
  {
    const callback = mock((name, attributes) => {});

    parser.onOpeningTag(callback);
    parser.parse('<div>Hello world</div>');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('div', {});
  }
)

// ---

it('should invoke the closing tag callback when encountering a closing tag',

  async () =>
  {
    const callback = mock((name) => {});

    parser.onClosingTag(callback);
    parser.parse('<div>Hello world</div>');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('div');
  }
)

// ---

it('should invoke the opening tag callback multiple times when encountering multiple opening tags',

  async () =>
  {
    const callback = mock((name, attributes) => {});

    parser.onOpeningTag(callback);
    parser.parse('<div>Hello world</div><p>Hello world</p>');

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('div', {});
    expect(callback).toHaveBeenCalledWith('p', {});
  }
)

// ---

it('should invoke the closing tag callback multiple times when encountering multiple closing tags',

  async () =>
  {
    const callback = mock((name) => {});

    parser.onClosingTag(callback);
    parser.parse('<div>Hello world</div><p>Hello world</p>');

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('div');
    expect(callback).toHaveBeenCalledWith('p');
  }
)

// ---

it('should invoke the text callback multiple times when encountering multiple text chunks',

  async () =>
  {
    const callback = mock((text) => { /*console.log({ text })*/ });

    parser.onText(callback);
    parser.parse('<div>Hello world inside section</div>Hello outside<p>Hello world inside paragraph</p>');

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('Hello world inside section');
    expect(callback).toHaveBeenCalledWith('Hello outside');
    expect(callback).toHaveBeenCalledWith('Hello world inside paragraph');
  }
)

// ---

it('should invoke the opening tag callback when encountering an opening tag containing an attribute',

  async () =>
  {
    const callback = mock((name, attributes) => {});

    parser.onOpeningTag(callback);
    parser.parse('<div class="foo">Hello world</div>');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('div', { class: 'foo' });
  }
)

// ---

it('should invoke the opening tag callback when encountering an opening tag containing an attribute with an implicit value',

  async () =>
  {
    const callback = mock((name, attributes) => {});
    const textCallback = mock((text) => {});

    parser.onOpeningTag(callback);
    parser.onText(textCallback);

    parser.parse('<script defer>console.log("Hello world");</script>');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('script', { defer: '' });

    expect(textCallback).toHaveBeenCalledTimes(1);
    expect(textCallback).toHaveBeenCalledWith('console.log("Hello world");');
  }
)