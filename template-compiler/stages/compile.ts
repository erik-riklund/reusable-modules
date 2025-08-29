//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'

//
// ?
//
export const compile: Stage<Array<string>, string> = async (input) =>
{
  const body = input.join('\n');

  return `
    const output = [];

    const append = (content) => output.push(content);
    const sanitize = (input) => input.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    ${body}

    return output.join('');
  `;
}