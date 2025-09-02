//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileHandler } from './handlers/file'
import { createFolderHandler } from './handlers/folder'

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

}

//
// ?
//
export type FolderHandler = ReturnType<typeof createFolderHandler>;