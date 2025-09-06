//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect, beforeEach } from 'bun:test'
import { createFileSystemHandler } from 'filesystem-adapter/index'
import { createMockFileSystemAdapter } from 'filesystem-adapter/adapters/mock'

import type { FileSystemHandler } from 'filesystem-adapter/types'

// ---

let fileSystemHandler: FileSystemHandler;

beforeEach(() =>
  fileSystemHandler = createFileSystemHandler(
    createMockFileSystemAdapter(
      {
        '/': {
          'package.json': { content: '{}', modified: Date.now() }
        },
        '/src': {
          'index.ts': { content: 'export * from "./lib/index";', modified: Date.now() - 1 },
          'config.json': { content: '{ "foo": "bar" }', modified: Date.now() - 3 }
        },
        '/src/lib': {
          'index.ts': { content: 'export * from "./utils/foo";', modified: Date.now() - 2 }
        },
        '/src/lib/utils': {
          'foo.ts': { content: 'export * from "./foo";', modified: Date.now() - 4 }
        }
      }
    )
  )
);

// ---

it('should create a directory handler object for the given path',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');

    expect(directory).toHaveProperty('file');
    expect(directory.path).toBe('src');
  }
);

// ---

it('should determine if a directory exists',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');

    expect(await directory.exists()).toBe(true);
  }
);

// ---

it('should create a new directory',

  async () =>
  {
    const directory = fileSystemHandler.directory('dist');

    expect(await directory.exists()).toBe(false);

    await directory.create();

    expect(await directory.exists()).toBe(true);
  }
);

// ---

it('should delete a directory',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');

    expect(await directory.exists()).toBe(true);

    await directory.delete();

    expect(await directory.exists()).toBe(false);
  }
);

// ---

it('should return a flat list of the contents of the directory',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const list = await directory.list();

    expect(list).toContainEqual({ type: 'directory', path: 'src/lib' });
    expect(list).toContainEqual({ type: 'file', path: 'src/index.ts' });
    expect(list).toContainEqual({ type: 'file', path: 'src/config.json' });
  }
);

// ---

it('should return a recursive list of the contents of the directory',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const list = await directory.list({ deep: true });

    expect(list).toContainEqual({ type: 'file', path: 'src/index.ts' });
    expect(list).toContainEqual({ type: 'file', path: 'src/config.json' });
    expect(list).toContainEqual({ type: 'directory', path: 'src/lib' });
    expect(list).toContainEqual({ type: 'file', path: 'src/lib/index.ts' });
    expect(list).toContainEqual({ type: 'directory', path: 'src/lib/utils' });
    expect(list).toContainEqual({ type: 'file', path: 'src/lib/utils/foo.ts' });
  }
);

// ---

it('should return a flat list of files based on a pattern',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const list = await directory.find('*.ts');

    expect(list).toBeArrayOfSize(1);
    expect(list).toContainEqual('src/index.ts');
  }
);

// ---

it('should return a recursive list of files based on a pattern',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const list = await directory.find('**/index.ts');

    expect(list).toBeArrayOfSize(2);
    expect(list).toContainEqual('src/index.ts');
    expect(list).toContainEqual('src/lib/index.ts');
  }
);