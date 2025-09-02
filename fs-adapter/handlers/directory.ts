//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileHandler } from './file'
import { createPathFilter } from 'path-filter'

import type { FileSystemAdapter } from 'fs-adapter/types'

// ---

export const createDirectoryHandler = (
  adapter: FileSystemAdapter, path: string) =>
{
  return {
    //
    // Creates a new file handler object for the given file path.
    //
    file: (filePath: string) => 
    {
      return createFileHandler(adapter, `${path}/${filePath}`);
    },

    //
    // Creates a new directory handler object for the given path.
    //
    folder: (subpath: string) => 
    {
      return createDirectoryHandler(adapter, `${path}/${subpath}`);
    },

    //
    // Returns an array of file handler objects for the files in the directory.
    //
    listFiles: async (options?: { recursive: boolean }) =>
    {
      const recursive = options?.recursive ?? false;
      // const result = await fs.readdir(folderPath, { recursive, withFileTypes: true });

      // ...
    },

    //
    // Searches the directory for files that match the given pattern.
    // The results are returned as an array of file handler objects.
    //
    searchFiles: async function (pattern: string)
    {
      const recursive = pattern.includes('**');
      const pathFilter = createPathFilter(pattern);

      // ...
    }
  }
}