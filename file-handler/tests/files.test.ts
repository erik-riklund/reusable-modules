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

it('should check if a file exists',
  () =>
  {
    const fileSystem = makeFileSystemHandler(fs as any);

    expect(fileSystem.file('/simple.txt').exists).toBe(true);
    expect(fileSystem.file('/nonexistent.txt').exists).toBe(false);
  }
);

it('should return the file name',
  () =>
  {
    const file = makeFileSystemHandler(fs as any).file('/sub/test.json');

    expect(file.name).toBe('test.json');
  }
);

it('should read the file contents',
  () =>
  {
    const file = makeFileSystemHandler(fs as any).file('/simple.txt');

    expect(file.read()).toBe('Hello world');
  }
);

it('should read the file contents as JSON',
  () =>
  {
    const expected = { key: 'value' };
    const file = makeFileSystemHandler(fs as any).file('/sub/test.json');

    expect(file.readJson()).toEqual({ key: 'value' });
  }
);

it('should throw an error if the file does not exist',
  () =>
  {
    const file = makeFileSystemHandler(fs as any).file('/nonexistent.txt');

    expect(() => file.read()).toThrowError('File "/nonexistent.txt" does not exist.');
  }
);

it('should write the provided data to a file',
  () =>
  {
    const data = 'Goodbye cruel world...';
    const file = makeFileSystemHandler(fs as any).file('/simple.txt');

    file.write(data);

    expect(file.read()).toBe(data);
  }
);

it('should write the provided JSON data to a file', () =>
{
  const expected = { key: 'value' };
  const file = makeFileSystemHandler(fs as any).file('/sub/test.json');

  file.writeJson(expected);

  expect(file.readJson()).toEqual(expected);
}
);

it('should return the last modified time of the file',
  () =>
  {
    const file = makeFileSystemHandler(fs as any).file('/simple.txt');

    expect(file.lastModified).toBeNumber();
  }
);

it('should return `-1` if the file does not exist',
  () =>
  {
    const file = makeFileSystemHandler(fs as any).file('nonexistent.txt');

    expect(file.lastModified).toBe(-1);
  }
);

it('should delete the file', () =>
{
  const fileSystem = makeFileSystemHandler(fs as any);
  const file = fileSystem.file('/simple.txt');

  file.delete();

  expect(file.exists).toBe(false);
}
);

it('should copy a file', () =>
{
  const fileSystem = makeFileSystemHandler(fs as any);
  const file = fileSystem.file('/simple.txt');

  file.copy('/simple2.txt');

  const targetFile = fileSystem.file('/simple2.txt');
  expect(targetFile.exists).toBe(true);
}
);