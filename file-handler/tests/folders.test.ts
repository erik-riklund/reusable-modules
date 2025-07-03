// @ts-nocheck

import { fs, vol } from 'memfs'
import { it, expect } from 'bun:test'
import { beforeEach, afterEach } from 'bun:test'
import { makeFileSystemHandler } from '..'

afterEach(() => vol.reset());
beforeEach(() => vol.fromJSON(
  {
    '/simple.txt': 'Hello world',
    '/sub/test.json': '{"key":"value"}',
    '/sub/child/test.txt': 'Hello world',
    '/sub/child/test2.json': '{"key2":"value2"}',
    '/another/folder/path/test3.txt': 'Hello world 3'
  }
));

it('should return the path to the folder',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);

    expect(fileSystem.folder('/sub').path).toBe('/sub');
    expect(fileSystem.folder('/sub/test').path).toBe('/sub/test');
  }
);

it('should check if the folder exists',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);

    expect(fileSystem.folder('/sub').exists).toBe(true);
    expect(fileSystem.folder('/nonexistent').exists).toBe(false);
  }
);

it('should create the new folder',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);
    const folder = fileSystem.folder('/newFolder');

    folder.create();

    expect(folder.exists).toBe(true);
  }
);

it('it should read the contents of a folder',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);
    const contents = fileSystem.folder('/sub').read();

    expect(contents).toEqual(['test.json']);
  }
);

it('should read the contents of a folder recursively',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);
    const contents = fileSystem.folder('/sub').read({ recursive: true });

    expect(contents).toEqual(['test.json', 'child/test.txt', 'child/test2.json']);
  }
);

it('should create a new file object for the specified path',
  () =>
  {
    const folderHandler = makeFileSystemHandler(fs).folder('/sub');
    const file = folderHandler.file('test.txt');

    expect(file.name).toBe('test.txt');
  }
);

it('should delete the folder and its contents',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);
    const folder = fileSystem.folder('/sub');

    folder.delete()

    expect(folder.exists).toBe(false);
  }
);

it('should delete the contents but leave the folder',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs);
    const folder = fileSystem.folder('/sub');

    folder.clear();

    expect(folder.exists).toBe(true);
  }
);