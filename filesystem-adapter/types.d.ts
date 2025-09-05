//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileSystemHandler } from '.'
import { createFileHandler } from './handlers/file'
import { createDirectoryHandler } from './handlers/directory'

// ---

//
// ?
//
export type DirectoryEntry = {
  type: 'file' | 'directory', path: string
};

//
// ?
//
export type DirectoryHandler = ReturnType<typeof createDirectoryHandler>;

//
// ?
//
export type DirectoryList = Array<DirectoryListEntry>;

//
// ?
//
export type DirectoryListEntry = { type: 'file' | 'directory', path: string };

//
// ?
//
export type FileHandler = ReturnType<typeof createFileHandler>;

//
// ?
//
export interface FileSystemAdapter
{
  file:
  {
    delete: (path: string) => Promise<void>,
    exists: (path: string) => Promise<boolean>,
    read: (path: string) => Promise<Buffer | null>,
    size: (path: string) => Promise<number | null>,
    write: (path: string, data: Buffer | string) => Promise<void>
  },

  directory:
  {
    create: (path: string) => Promise<void>,
    delete: (path: string) => Promise<void>,
    exists: (path: string) => Promise<boolean>,
    list: (path: string) => Promise<DirectoryEntry[]>
  }
}

//
// ?
//
export type FileSystemHandler = ReturnType<typeof createFileSystemHandler>;