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
    get exists ()
    {
      return adapter.file.exists(normalizedPath);
    },

    get modified ()
    {
      return adapter.file.modified(normalizedPath);
    },
    
    get path ()
    {
      return normalizedPath;
    },

    get size ()
    {
      return adapter.file.size(normalizedPath);
    },

    // ---
    
    delete: () =>
    {
      return adapter.file.delete(normalizedPath);
    },

    read: async () =>
    {
      const content = await adapter.file.read(normalizedPath);

      if (content === null)
      {
        throw new Error(`File not found: "${normalizedPath}"`);
      }

      return content.toString();
    },

    write: (content: Buffer | string) =>
    {
      return adapter.file.write(normalizedPath, content);
    },
  }
}