//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { DirectoryEntry, FileSystemAdapter } from 'filesystem-adapter/types'

type MockDirectory = { [directory: string]: Record<string, string> };

// ---

const getMockDirectoryPath = (path: string) => 
{
  //
  // Replace leading `./` with `/`, OR replace the path `.` with `/`, OR add `/` at the beginning.
  //
  return path.startsWith('./') ? path.slice(1) : (path === '.' ? '/' : `/${path}`);
}

const getMockFilePaths = (path: string) => 
{
  const mockPath = getMockDirectoryPath(path);
  const parentPath = mockPath.slice(0, mockPath.lastIndexOf('/'));
  const fileName = mockPath.slice(parentPath.length + 1);

  return { parentPath, fileName };
}

// ---

export const createMockFileSystemAdapter = (content: MockDirectory): FileSystemAdapter =>
{
  return {
    file:
    {
      delete: async (path) =>
      {
        const { parentPath, fileName } = getMockFilePaths(path);

        delete content[parentPath]?.[fileName];
      },

      exists: async (path) =>
      {
        const { parentPath, fileName } = getMockFilePaths(path);

        return (parentPath in content) && (fileName in content[parentPath]);
      },

      modified: async (path) =>
      {
        const { parentPath, fileName } = getMockFilePaths(path);
        const fileExists = (parentPath in content) && (fileName in content[parentPath]);

        return fileExists ? Date.now() : null;
      },

      read: async (path) =>
      {
        const { parentPath, fileName } = getMockFilePaths(path);
        const fileExists = (parentPath in content) && (fileName in content[parentPath]);

        return fileExists ? Buffer.from(content[parentPath][fileName]) : null;
      },

      size: async (path) =>
      {
        const { parentPath, fileName } = getMockFilePaths(path);

        return content[parentPath]?.[fileName]?.length ?? null;
      },

      write: async (path, data) =>
      {
        const { parentPath, fileName } = getMockFilePaths(path);

        content[parentPath] = { ...content[parentPath], [fileName]: data as string };
      }
    },

    directory:
    {
      create: async (path) =>
      {
        const mockPath = getMockDirectoryPath(path);

        if (!(mockPath in content))
        {
          content[mockPath] = {};
        }
      },

      delete: async (path) =>
      {
        const mockPath = getMockDirectoryPath(path);

        if (mockPath in content)
        {
          delete content[mockPath];
        }
      },

      exists: async (path) =>
      {
        return getMockDirectoryPath(path) in content;
      },

      list: async (path) =>
      {
        const mockPath = getMockDirectoryPath(path);

        return [
          ...Object.keys(content)
            .filter(key => new RegExp(`^${mockPath}\\/[^/]+$`).test(key))
            .map(key => ({ type: 'directory', path: key.slice(mockPath.length + 1) })),

          ...Object.keys(content[mockPath]).map(key => ({ type: 'file', path: key }))

        ] as DirectoryEntry[];
      }
    }
  }
}