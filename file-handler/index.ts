import { makeFileObject } from './file'
import { makeFolderObject } from './folder'

/**
 * Creates a file system handler object that uses the provided
 * file system object to interact with files and folders.
 */
export const makeFileSystemHandler = (fileSystem: FileHandler.FileSystem) =>
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