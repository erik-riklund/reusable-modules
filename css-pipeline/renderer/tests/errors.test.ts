//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { renderTreeToString } from '..'

// ---

it('should throw an error when encountering nested media queries',
  () =>
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

    expect(() => renderTreeToString(tree))
      .toThrowError('Nested media queries are not supported');
  }
);

it('should throw an error when encountering a media query nested inside a color scheme at-rule',
  () =>
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

    expect(() => renderTreeToString(tree)).toThrowError(
      'Responsive media queries cannot be nested inside color scheme at-rules'
    );
  }
);

it('should throw an error when encountering nested color scheme at-rules',
  () =>
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

    expect(() => renderTreeToString(tree))
      .toThrowError('Nested color scheme at-rules are not supported');
  }
);

it('should throw an error when encountering nested at-rules',
  () =>
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

    expect(() => renderTreeToString(tree))
      .toThrowError('Nested at-rules are not supported');
  }
);