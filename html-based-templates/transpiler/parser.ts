//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

type TextCallback = (text: string) => void;

type OpeningTagCallback = (name: string, attributes: Record<string, string>) => void;
type ClosingTagCallback = (name: string) => void;

// ---

export function createTemplateParser ()
{
  const ignoreContentInsideElements = ['code', 'pre', 'script', 'style'];

  const self =
  {
    state:
    {
      buffer: '',

      currentPosition: 0,
      currentLine: 1,
      currentColumn: 1,

      isElement: false,
      currentElementName: '',
      isClosingElement: false,
      isIgnoringContent: false,
      ignoredElementName: '',

      isAttribute: false,
      isAttributeValue: false,
      currentAttributeName: '',
      currentElementAttributes: {} as Record<string, string>
    },

    callbacks:
    {
      text: [] as Array<TextCallback>,

      openingTag: [] as Array<OpeningTagCallback>,
      closingTag: [] as Array<ClosingTagCallback>
    },

    // --
    onOpeningTag (callback: OpeningTagCallback)
    {
      self.callbacks.openingTag.push(callback);
    },

    // --
    onClosingTag (callback: ClosingTagCallback)
    {
      self.callbacks.closingTag.push(callback);
    },

    // --
    onText (callback: TextCallback)
    {
      self.callbacks.text.push(callback);
    },

    // --
    parse (template: string): void
    {
      const { callbacks, state } = self;

      while (state.currentPosition < template.length)
      {
        let
          invokeTextCallback = false,
          invokeOpeningTagCallback = false,
          invokeClosingTagCallback = false;

        const character = template[state.currentPosition];

        if (state.isIgnoringContent)
        {
          const { ignoredElementName } = state;
          const futureCharacters = template.slice(
            // add 1 to exclude the current character, and 4 to exclude the prefix and suffix of the closing element.
            state.currentPosition + 1, state.currentPosition + 4 + ignoredElementName.length
          );

          if (futureCharacters === `</${ignoredElementName}>`)
          {
            state.isIgnoringContent = false;
            state.ignoredElementName = '';

            invokeTextCallback = true;
          }

          state.buffer += character;
        }
        else
        {
          switch (character)
          {
            case '<':
              if (state.currentElementName && !state.isAttributeValue)
              {
                // throw error -> unexpected opening bracket.
              }

              state.isElement = true;
              invokeTextCallback = state.buffer.length > 0;
              break;

            case '>':
              if (!state.isElement)
              {
                // throw error -> unexpected closing bracket.
              }

              if (!state.isAttributeValue)
              {
                if (!state.currentElementName)
                {
                  state.currentElementName = state.buffer;
                }

                if (state.isAttribute && !state.currentAttributeName)
                {
                  // handle attribute with an implicit value.
                  state.currentElementAttributes[state.buffer] = '';
                }

                invokeOpeningTagCallback = !state.isClosingElement;
                invokeClosingTagCallback = state.isClosingElement;

                if (!state.isClosingElement)
                {
                  state.ignoredElementName = state.currentElementName;
                  state.isIgnoringContent = ignoreContentInsideElements.includes(state.currentElementName);
                }

                break; // move on to the next character.
              }

              state.buffer += character; // keep the closing bracket in attribute values.
              break;

            case '/':
              if (state.isElement && !state.isAttributeValue)
              {
                if (state.currentElementName)
                {
                  // throw error -> unexpected forward slash.
                }

                state.isClosingElement = true;
                break; // move on to the next character.
              }

              state.buffer += character; // keep the forward slash.
              break;

            case ' ':
              if (!state.isElement)
              {
                state.buffer += character; // keep the space.
                break; // move on to the next character.
              }

              if (state.isClosingElement)
              {
                // throw error -> unexpected space.
              }

              if (!state.currentElementName)
              {
                state.currentElementName = state.buffer;
                state.buffer = ''; // reset the buffer.
              }

              state.isAttribute = true;
              break;

            case '=':
              if (!state.isElement || state.isAttributeValue)
              {
                state.buffer += character; // keep the equal sign.
                break; // move on to the next character.
              }

              if (!state.currentElementName || state.isClosingElement || !state.buffer || !state.isAttribute)
              {
                // throw error -> unexpected equals sign.
              }

              state.currentAttributeName = state.buffer;
              break;

            case '"':
              if (!state.isElement)
              {
                state.buffer += character; // keep the double quote.
                break; // move on to the next character.
              }

              if (!state.isAttributeValue)
              {
                state.isAttributeValue = true;
                state.currentAttributeName = state.buffer;

                state.buffer = ''; // reset the buffer.
                break; // move on to the next character.
              }

              state.isAttributeValue = false;
              state.currentElementAttributes[state.currentAttributeName] = state.buffer;
              state.buffer = ''; // reset the buffer.
              break;

            default: state.buffer += character;
          }
        }

        // ---

        state.currentPosition++;

        state.currentLine += (character === '\n') ? 1 : 0;
        state.currentColumn = (character === '\n') ? 1 : state.currentColumn + 1;

        // ---

        if (state.currentPosition === template.length && state.buffer)
        {
          // only invoke the text callback if the template ends with a text chunk.

          invokeTextCallback = state.buffer && !invokeOpeningTagCallback && !invokeClosingTagCallback;
        }

        // ---

        if (invokeOpeningTagCallback)
        {
          callbacks.openingTag.forEach(callback =>
            callback(state.currentElementName, state.currentElementAttributes)
          );

          state.isElement = false;
          state.isClosingElement = false;
          state.isAttribute = false;

          state.currentAttributeName = '';
          state.currentElementAttributes = {};
          state.currentElementName = '';

          state.buffer = '';
        }

        // ---

        if (invokeClosingTagCallback)
        {
          callbacks.closingTag.forEach(callback => callback(state.currentElementName));

          state.isElement = false;
          state.isClosingElement = false;
          state.isIgnoringContent = false;

          state.currentElementName = '';
          state.currentElementAttributes = {};
          state.buffer = '';
        }

        // ---

        if (invokeTextCallback)
        {
          callbacks.text.forEach(callback => callback(state.buffer));

          state.buffer = '';
        }
      }
    }
  }

  return self;
}

// ---

export class ParsingError extends Error
{
  constructor (message: string, state: ReturnType<typeof createTemplateParser>['state'])
  {
    super(`Parsing error: ${message} @ line ${state.currentLine} (column ${state.currentColumn}).`);

    this.name = 'ParsingError';
  }
}