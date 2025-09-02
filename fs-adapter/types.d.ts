//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileHandler } from './handlers/file'
import { createDirectoryHandler } from './handlers/directory'

// ---

//
// ?
//
export type FileHandler = ReturnType<typeof createFileHandler>;

//
// ?
//
export interface FileSystemAdapter
{
  readFolder: (folderPath: string) => Promise<[]>
}

//
// ?
//
export type DirectoryEntry
  = { type: 'file', file: FileHandler }
  | { type: 'folder', folder: DirectoryHandler };

//
// ?
//
export type DirectoryHandler = ReturnType<typeof createDirectoryHandler>;