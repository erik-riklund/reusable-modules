//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 0.1.0
//

import { createFileHandler } from './handlers/file'
import { createDirectoryHandler } from './handlers/directory'
import type { FileSystemAdapter } from 'fs-adapter/types'

// ---

export const createFileSystemManager = (adapter: FileSystemAdapter) =>
{
  return {
    file: (filePath: string) => createFileHandler(adapter, filePath),
    folder: (folderPath: string) => createDirectoryHandler(adapter, folderPath)
  }
}