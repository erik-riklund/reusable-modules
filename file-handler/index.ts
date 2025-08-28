//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import { makeFileObject } from './file'
import { makeFolderObject } from './folder'

type FileSystem = FileHandler.FileSystem;

/**
 * Creates a file system handler object that uses the provided
 * file system object to interact with files and folders.
 */
export const makeFileSystemHandler = (fileSystem: FileSystem) =>
{
  return {
    /**
     * Creates a new file object for the specified path.
     */
    file: (path: string) => makeFileObject(path, fileSystem),

    /**
     * Creates a new folder object for the specified path.
     */
    folder: (path: string) => makeFolderObject(path, fileSystem)
  }
}