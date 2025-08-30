//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 2.0.0
//

export const createPathFilter = (pattern: string) =>
{
  const expression = new RegExp(translatePattern(pattern));

  return (path: string) => expression.test(path);
}

// ---

export const translatePattern = (pattern: string) =>
{
  const result: Array<string> = [''];

  for (let i = 0, depth = 0; i < pattern.length; i++)
  {
    const current = pattern[i];

    switch (current)
    {
      case '*':
        const next = i + 1 < pattern.length ? pattern[i + 1] : null;

        if (next === '*')
        {
          i += 2;

          result.push('([^/]+/)*');
          break;
        }

        result.push('[^/]+');
        break;

      case '{':
        depth++;

        result.push('(');
        break;

      case ',':
        result.push(depth > 0 ? '|' : ',');
        break;

      case '}':
        depth--;

        result.push(')');
        break;

      default:
        const specials = ['+', '.'];

        result.push(specials.includes(current) ? `\\${current}` : current);
    }
  }

  return `^${result.join('')}$`;
}