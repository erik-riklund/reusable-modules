//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import { formatString } from 'format-string'

// ---

const replaceColorTags = (text: string) =>
{
  const colorCodes =
  {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  }

  return text.replace(
    /<(\w+):"([^"]*)">/g,

    (_, color: keyof typeof colorCodes, value: string) =>
      color in colorCodes ? (colorCodes[color] + value + '\x1b[0m') : value
  );
}

// ---

export const print = (message: string, ...args: Array<string | number>) =>
{
  const values = args.map(value => String(value));

  console.log(replaceColorTags(formatString(message, values)));
}

// ---

export const warning = (message: string, ...args: Array<string | number>) =>
{
  message = `⚠️ ${message}`;
  const values = args.map(value => String(value));

  console.warn(replaceColorTags(formatString(message, values)));
}

// ---

export const error = (message: string, ...args: Array<string | number>) =>
{
  message = `❌ ${message}`;
  const values = args.map(value => String(value));

  console.error(replaceColorTags(formatString(message, values)));
}