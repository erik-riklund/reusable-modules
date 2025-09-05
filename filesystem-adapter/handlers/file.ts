//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { FileSystemAdapter } from '../types'

// ---

export const createFileHandler = (
  adapter: FileSystemAdapter, path: string) =>
{
  const normalizedPath = path.replace(/\\/g, '/');

  return {
    //
    // Returns the normalized path of the file.
    // 
    // The path is adjusted during initialization to use forward slashes (/),
    // ensuring consistent behavior across different operating systems.
    //
    get path ()
    {
      return normalizedPath;
    },

    //
    // Asynchronously checks if the file at the handler's path currently exists.
    // 
    // It uses the adapter's `exists` method and returns a promise
    // that resolves to `true` if the file exists, or `false` otherwise.
    //
    get exists ()
    {
      return adapter.file.exists(normalizedPath);
    },

    //
    // Asynchronously retrieves the size of the file in bytes.
    // 
    // It uses the file system adapter's `size` method to get the file's size and
    // returns a promise that resolves to a number, or `null` if the file does not exist.
    //
    get size ()
    {
      return adapter.file.size(normalizedPath);
    },

    //
    // Asynchronously deletes the file.
    // 
    // It uses the adapter to perform the deletion and returns a promise.
    //
    delete: () =>
    {
      return adapter.file.delete(normalizedPath);
    },

    //
    // Asynchronously reads the content of the file and returns it as a string.
    // 
    // If the file does not exist, this method throws an error.
    // It returns a promise that resolves to the file's content.
    //
    read: async () =>
    {
      const content = await adapter.file.read(normalizedPath);

      if (content === null)
      {
        throw new Error(`File not found: "${normalizedPath}"`);
      }

      return content.toString();
    },

    //
    // Asynchronously writes the given content to the file.
    // 
    // If the file does not exist, it will be created. The content can be a Buffer or a string.
    // It returns a promise that completes when the write operation is finished.
    //
    write: (content: Buffer | string) =>
    {
      return adapter.file.write(normalizedPath, content);
    },
  }
}