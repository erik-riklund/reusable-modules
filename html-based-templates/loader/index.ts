//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

export interface Loader
{
  // ...
}

// ---

import type { DirectoryHandler } from 'filesystem-adapter/types'

export function createFilesystemLoader (directory: DirectoryHandler): Loader
{
  const self =
  {
    // ...
  }

  return self;
}