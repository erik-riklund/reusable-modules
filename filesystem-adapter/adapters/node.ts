//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { DirectoryEntry, FileSystemAdapter } from 'types'

import { dirname } from 'node:path'
import { exists, mkdir, readdir, readFile, rm, rmdir, stat, writeFile } from 'node:fs/promises'

// ---

export const nodeFileSystemAdapter: FileSystemAdapter =
{
  file:
  {
    delete: async (path) =>
    {
      try
      {
        await rm(path);
      }

      catch { /* idempotent operation */ }
    },

    exists: (path) =>
    {
      return exists(path);
    },

    read: async (path) =>
    {
      try
      {
        const buffer = await readFile(path);

        return buffer;
      }

      catch { return null; }
    },

    size: async (path) =>
    {
      try
      {
        const stats = await stat(path);

        return stats.size;
      }

      catch { return null; }
    },

    write: async (path, data) =>
    {
      const parentPath = dirname(path);

      await mkdir(parentPath, { recursive: true });
      await writeFile(path, data);
    }
  },

  directory:
  {
    create: async (path) =>
    {
      const recursive = path.includes('/') || path.includes('\\');

      await mkdir(path, { recursive });
    },

    delete: (path) =>
    {
      return rmdir(path, { recursive: true });
    },

    exists: (path) =>
    {
      return exists(path);
    },

    list: async (path) =>
    {
      const entries: Array<DirectoryEntry> = [];
      const content = await readdir(path, { withFileTypes: true });

      content.forEach(
        entry =>
        {
          if (entry.isDirectory())
          {
            entries.push({ type: 'directory', path: entry.name });
          }

          else if (entry.isFile())
          {
            entries.push({ type: 'file', path: entry.name });
          }
        }
      );

      return entries;
    }
  }
}