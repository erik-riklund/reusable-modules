//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileHandler } from './file'
import { createPathFilter } from 'path-filter'

import type { DirectoryList, FileSystemAdapter } from '../types'

// ---

export const createDirectoryHandler = (
  adapter: FileSystemAdapter, path: string) =>
{
  const normalizedPath = path.replace(/\\/g, '/');

  return {
    //
    // This property returns the normalized path of the directory.
    // 
    // The path is adjusted during initialization to ensure it uses forward slashes (/),
    // which provides consistency across different operating systems, like Windows,
    // which may use backslashes (\).
    //
    get path ()
    {
      return normalizedPath;
    },

    //
    // Asynchronously creates the directory specified by the handler's path.
    // 
    // It delegates the actual creation logic to the provided file system adapter,
    // which handles the low-level file system interactions.
    //
    create: () =>
    {
      return adapter.directory.create(normalizedPath);
    },

    //
    // Asynchronously deletes the directory and its contents.
    // 
    // It uses the file system adapter to perform the deletion,
    // ensuring all nested files and directories are removed. 
    //
    delete: () =>
    {
      return adapter.directory.delete(normalizedPath);
    },

    //
    // Creates and returns a new directory handler for a subdirectory located
    // within the current directory. It effectively "navigates" down the directory tree,
    // allowing operations on a child directory without having to manually construct its full path.
    //
    directory: (childPath: string) => 
    {
      return createDirectoryHandler(adapter, `${normalizedPath}/${childPath}`);
    },

    //
    // Checks if the directory at the handler's path currently exists.
    // 
    // It uses the adapter's `exists` method to perform the check and returns a promise
    // that resolves to `true` if the directory exists, and `false` otherwise.
    //
    exists: () =>
    {
      return adapter.directory.exists(normalizedPath);
    },

    //
    // Creates and returns a new file handler for a file located within the current directory.
    // This allows for managing files within the directory using a consistent, fluent API.
    //
    file: (filePath: string) => 
    {
      return createFileHandler(adapter, `${normalizedPath}/${filePath}`);
    },

    //
    // Searches for files within the directory that match a given glob pattern (e.g., `*.js`, `**/*.ts`).
    // 
    // It first lists all files and directories, then uses a path filter to return an array of paths
    // for all matching files. If the pattern includes **, the search will be performed recursively in subdirectories.
    //
    find: async function (pattern: string)
    {
      const deep = pattern.includes('**');
      const pathFilter = createPathFilter(`${normalizedPath}/${pattern}`);

      const list = await this.list({ deep });

      const filteredList = list.filter(
        entry => entry.type === 'file' && pathFilter(entry.path)
      );

      return filteredList.map(entry => entry.path);
    },

    //
    // Returns a list of files and directories directly contained within the current directory.
    // 
    // If the `deep` option is set to `true`, it recursively lists all contents,
    // including those in subdirectories. The method returns a promise that resolves
    // to a `DirectoryList`, which contains objects detailing each entry's type and path.
    //
    list: async function (options?: { deep: boolean }): Promise<DirectoryList>
    {
      options = { deep: false, ...options };

      const list: DirectoryList = [];
      const content = await adapter.directory.list(normalizedPath);

      for (const entry of content)
      {
        const entryPath = `${normalizedPath}/${entry.path}`;

        if (entry.type === 'directory')
        {
          list.push({ type: 'directory', path: entryPath });

          if (options.deep === true)
          {
            const handler = this.directory(entry.path);

            list.push(...(await handler.list(options)));
          }
        }
        else
        {
          list.push({ type: 'file', path: entryPath });
        }
      }

      return list;
    }
  }
}