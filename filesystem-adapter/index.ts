//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type { FileSystemAdapter } from './types'

import { createFileHandler } from './handlers/file'
import { createDirectoryHandler } from './handlers/directory'

// ---

export const createFileSystemHandler = (adapter: FileSystemAdapter) =>
{
  return {
    file: (filePath: string) => createFileHandler(adapter, filePath),
    directory: (folderPath: string) => createDirectoryHandler(adapter, folderPath)
  }
}