//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtemp, rmdir } from 'node:fs/promises'

import { it, expect, beforeEach, afterEach } from 'bun:test'
import { nodeFileSystemAdapter } from 'adapters/node'

const { file, directory } = nodeFileSystemAdapter;

// ---

let targetDirectory: string;

beforeEach(
  async () =>
  {
    targetDirectory = await mkdtemp(
      join(tmpdir(), 'node-adapter-')
    );
  }
);

afterEach(() => rmdir(targetDirectory, { recursive: true }));

// ---

const createMockContents = async (path: string) =>
{
  const operations = [
    file.write(`${path}/src/index.ts`, 'export * from "./lib/index";'),
    file.write(`${path}/src/config.json`, '{ "foo": "bar" }'),
    file.write(`${path}/src/lib/index.ts`, 'export * from "./utils/foo";')
  ];

  await Promise.all(operations);
}

// ---

it('should determine if a directory with the specified path exists',

  async () =>
  {
    const path = join(targetDirectory, 'foo');

    expect(await directory.exists(path)).toBe(false);
  }
);

// ---

it('should create a new directory with the specified path',

  async () =>
  {
    const path = join(targetDirectory, 'foo');

    await directory.create(path);

    expect(await directory.exists(path)).toBe(true);
  }
);

// ---

it('should delete the directory with the specified path',

  async () =>
  {
    const path = join(targetDirectory, 'foo');

    await directory.create(path);

    expect(await directory.exists(path)).toBe(true);

    await directory.delete(path);

    expect(await directory.exists(path)).toBe(false);
  }
);

// ---

it('should determine if the file with the specified path exists',

  async () =>
  {
    const path = join(targetDirectory, 'foo.txt');

    expect(await file.exists(path)).toBe(false);
  }
);

// ---

it('should return `null` when determining the size of a file that does not exist',

  async () =>
  {
    const path = join(targetDirectory, 'foo.txt');

    expect(await file.size(path)).toBe(null);
  }
);

// ---

it('should create a new, empty file with the specified path',

  async () =>
  {
    const path = join(targetDirectory, 'foo.txt');

    await file.write(path, '');

    expect(await file.exists(path)).toBe(true);
  }
);

// ---

it('should create a new, empty file with the specified path in a nested directory',

  async () =>
  {
    const path = join(targetDirectory, 'test/foo.txt');

    await file.write(path, '');

    expect(await file.exists(path)).toBe(true);
  }
);

// ---

it('should return `null` when reading the content of a file that does not exist',

  async () =>
  {
    const path = join(targetDirectory, 'test/foo.txt');

    expect(await file.read(path)).toBe(null);
  }
);

// ---

it('should return the content of the file with the specified path',

  async () =>
  {
    const path = join(targetDirectory, 'foo.txt');

    await file.write(path, 'Hello world');
    const buffer = await file.read(path);

    expect(buffer!.toString()).toBe('Hello world');
  }
);

// ---

it('should replace the content of the file with the specified path',

  async () =>
  {
    const path = join(targetDirectory, 'foo.txt');

    await file.write(path, 'Hello world');
    const buffer = await file.read(path);

    expect(buffer!.toString()).toBe('Hello world');

    await file.write(path, 'Hello universe');
    const buffer2 = await file.read(path);

    expect(buffer2!.toString()).toBe('Hello universe');
  }
);

// ---

it('should delete the file with the specified path',

  async () =>
  {
    const path = join(targetDirectory, 'foo.txt');

    await file.write(path, 'Hello world');
    expect(await file.exists(path)).toBe(true);

    await file.delete(path);
    expect(await file.exists(path)).toBe(false);
  }
);

// ---

it('should list the contents of the directory with the specified path',

  async () =>
  {
    await createMockContents(targetDirectory);

    const path = join(targetDirectory, 'src');
    const list = await directory.list(path);

    expect(list).toContainEqual({ type: 'directory', path: 'lib' });
    expect(list).toContainEqual({ type: 'file', path: 'index.ts' });
    expect(list).toContainEqual({ type: 'file', path: 'config.json' });
  }
);