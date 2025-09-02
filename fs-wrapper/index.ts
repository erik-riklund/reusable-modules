//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 0.1.0
//

import { createFileHandler } from './handlers/file'
import { createFolderHandler } from './handlers/folder'
import type { FileSystemAdapter } from 'fs-wrapper/types'

// ---

export const createFileSystemManager = (adapter: FileSystemAdapter) =>
{
  return {
    file: (filePath: string) => createFileHandler(adapter, filePath),
    folder: (folderPath: string) => createFolderHandler(adapter, folderPath)
  }
}