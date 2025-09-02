//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileHandler } from './file'
import { createPathFilter } from 'path-filter'

import type { FileSystemAdapter } from 'fs-wrapper/types'

// ---

export const createFolderHandler = (adapter: FileSystemAdapter, folderPath: string) =>
{
  return {
    //
    // Creates a new file handler object for the given file path.
    //
    file: (filePath: string) => 
    {
      return createFileHandler(adapter, `${folderPath}/${filePath}`);
    },

    //
    // Creates a new folder handler object for the given subfolder path.
    //
    folder: (subfolderPath: string) => 
    {
      return createFolderHandler(adapter, `${folderPath}/${subfolderPath}`);
    },

    //
    // Returns an array of file handler objects for the files in the folder.
    //
    listFiles: async (options?: { recursive: boolean }) =>
    {
      const recursive = options?.recursive ?? false;
      // const result = await fs.readdir(folderPath, { recursive, withFileTypes: true });

      // ...
    },

    //
    // Searches the folder for files that match the given pattern.
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