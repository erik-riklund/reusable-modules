//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { FileSystemHandler } from 'types'

import { it, expect, beforeEach } from 'bun:test'
import { createFileSystemHandler } from 'index'
import { createMockFileSystemAdapter } from 'adapters/mock'

// ---

let fileSystemHandler: FileSystemHandler;

beforeEach(() =>
  fileSystemHandler = createFileSystemHandler(
    createMockFileSystemAdapter(
      {
        '/': { 'package.json': '{}' },
        '/src': {
          'index.ts': 'export * from "./lib/index";',
          'config.json': '{ "foo": "bar" }'
        },
        '/src/lib': { 'index.ts': 'export * from "./utils/foo";' },
        '/src/lib/utils': { 'foo.ts': 'export * from "./foo";' }
      }
    )
  )
);

// ---

it('should create a file handler object for the given file path',

  async () =>
  {
    const file = fileSystemHandler.file('src/index.ts');

    expect(file.path).toBe('src/index.ts');
  }
);

// ---

it('should determine if a file exists',

  async () =>
  {
    expect(await fileSystemHandler.file('src/index.ts').exists).toBe(true);
    expect(await fileSystemHandler.file('src/foo.ts').exists).toBe(false);
  }
);

// ---

it('should create a new file with no content',

  async () =>
  {
    const file = fileSystemHandler.file('src/empty.txt');

    expect(await file.exists).toBe(false);

    await file.write('');

    expect(await file.exists).toBe(true);
    expect(await file.size).toBe(0);
  }
);

// ---

it('should create a new file with the specified content',

  async () =>
  {
    const file = fileSystemHandler.file('src/not-empty.txt');

    expect(await file.exists).toBe(false);

    await file.write('Hello world');

    expect(await file.exists).toBe(true);
    expect(await file.size).toBe(11);
  }
);

// ---

it('should replace the content of an existing file',

  async () =>
  {
    const file = fileSystemHandler.file('src/index.ts');

    expect(await file.exists).toBe(true);
    expect(await file.size).toBe(28);

    await file.write('export * from "./lib/utils/foo";');

    expect(await file.size).toBe(32);
  }
);

// ---

it('should delete the file',

  async () =>
  {
    const file = fileSystemHandler.file('src/index.ts');

    expect(await file.exists).toBe(true);

    await file.delete();

    expect(await file.exists).toBe(false);
  }
);

// ---

it('should return the content of the file',

  async () =>
  {
    const file = fileSystemHandler.file('src/index.ts');

    expect(await file.read()).toBe('export * from "./lib/index";');
  }
);

// ---

it('should throw an error when reading a file that does not exist',

  async () =>
  {
    const file = fileSystemHandler.file('src/foo.ts');

    expect(file.read()).rejects.toThrow('File not found: "src/foo.ts"');
  }
);

// ---

it('should return `null` when determining the size of a file that does not exist',

  async () =>
  {
    const file = fileSystemHandler.file('src/foo.ts');

    expect(await file.size).toBe(null);
  }
);