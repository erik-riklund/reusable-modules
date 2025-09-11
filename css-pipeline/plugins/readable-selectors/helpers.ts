//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

/**
 * Stores compiled regular expressions to avoid recompilation.
 */
const compiledPatterns: Record<string, RegExp> = {};

/**
 * Parses a CSS selector string based on the given pattern to extract labeled values.
 */
export const parseSelector = (
  pattern: string, labels: string[], selector: string): null | Record<string, string> =>
{
  const expression = compileSelectorPattern(pattern);
  const matches = expression.exec(selector);

  console.log({ expression, matches });

  return !matches ? null : Object.fromEntries(
    labels.map((label, index) => [label, matches[index + 1]])
  );
}

/**
 * Compiles a pattern string into a regular expression.
 * 
 * - `*` is replaced with a regular expression that matches a single word.
 * - `**` is replaced with a regular expression that matches a string wrapped in quotes.
 */
const compileSelectorPattern = (pattern: string): RegExp =>
{
  if (pattern in compiledPatterns)
  {
    return compiledPatterns[pattern];
  }

  /**
   * Replaces `{groups}` with a regular expression
   * that matches any of the specified groups.
   */
  const handleGroup = (_input: string, groups: string) => 
  {
    return `(${groups.replace(/,/g, '|')})`;
  }

  /**
   * Replaces `[groups]` with a regular expression that matches
   * any of the specified groups, or nothing.
   */
  const handleOptionalGroup = (_input: string, groups: string) =>
  {
    return `(?:\\s(${groups.replace(/,/g, '|')}))?`;
  }

  const compiledPattern = pattern
    .replace(/\{([^}]+)}/g, handleGroup)
    .replace(/\s\[([^\]]+)]/g, handleOptionalGroup)
    .replace(/\*\*/g, '"([\\w\\s-]+)"')
    .replace(/\s\*\?/g, '(?:\\s`([\\w\\s-]+)`)?')
    .replace(/\*/g, '`([\\w\\s-]+)`');

  compiledPatterns[pattern] = new RegExp(`^${compiledPattern}$`);

  return compiledPatterns[pattern];
};

/**
 * Returns the lower and upper breakpoints for the given device.
 */
export const getDeviceSize = (device: string) =>
{
  const breakpoints = {
    mobile: { lower: null, upper: '575px' },
    tablet: { lower: '576px', upper: '959px' },
    laptop: { lower: '960px', upper: '1439px' },
    desktop: { lower: '1440px', upper: null }
  };

  return breakpoints[device as keyof typeof breakpoints];
}