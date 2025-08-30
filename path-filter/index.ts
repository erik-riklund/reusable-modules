//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

//
// Creates a function that filters an array of file paths based on
// the provided pattern, returning only the entries that match.
//
export const createPathFilter = (pattern: string) =>
{
  const compiledPattern = compilePattern(pattern);

  return (filePaths: string[]) => filePaths.filter((path) => compiledPattern.test(path));
};

//
// Compiles the given glob pattern into a regular expression
// that can be used to match file paths against the pattern.
//
const compilePattern = (pattern: string) =>
{
  const compiledPattern =
    pattern.replace(/[./]/g, '\\$&')
      .replace(/\*{2}\\\//, '([^/]+\/)*')
      .replace(/(?<![)])\*/, '[^/]+')
      .replace(/\{([^}]+)}/g, (_, group) =>
        `(${group.split(',').map((item: string) => item.trim()).join('|')})`
      );

  return new RegExp(`^${compiledPattern}$`);
};