//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect, jest, beforeEach } from 'bun:test'

import { createFileWatcher } from 'file-watcher'
import { createFileSystemHandler } from 'filesystem-adapter/index'
import { createMockFileSystemAdapter } from 'filesystem-adapter/adapters/mock'

import type { Observer, WatchController } from 'file-watcher/types'
import type { FileSystemHandler } from 'filesystem-adapter/types'

// ---

let fileSystemHandler: FileSystemHandler;

beforeEach(
  () =>
  {
    const adapter = createMockFileSystemAdapter(
      {
        '/src': {
          'index.ts': { content: 'Hello world', modified: Date.now() - 300 }
        }
      }
    );

    fileSystemHandler = createFileSystemHandler(adapter);
  }
);

// ---

let mockInterval: () => MaybePromise<void>;

const mockController: WatchController = {
  run: (callback) => { mockInterval = callback }, stop: () => {}
};

// ---

it('should emit the "create" event when a file is created',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const watcher = createFileWatcher(directory, { controller: mockController });

    await mockInterval();

    // ---

    const observer: Observer = jest.fn();
    watcher.on('create', observer);

    expect(observer).toHaveBeenCalledTimes(0);

    // ---

    await directory.file('new-file.ts').write('Hello world');

    await mockInterval();

    expect(observer).toHaveBeenCalledTimes(1);
  }
);

// ---

it('should emit the "delete" event when a file is deleted',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const watcher = createFileWatcher(directory, { controller: mockController });

    await mockInterval();

    // ---

    const observer: Observer = jest.fn();
    watcher.on('delete', observer);

    expect(observer).toHaveBeenCalledTimes(0);

    // ---

    await directory.file('index.ts').delete();

    await mockInterval();

    expect(observer).toHaveBeenCalledTimes(1);
  }
);

// ---

it('should emit the "change" event when a file has changed',

  async () =>
  {
    const directory = fileSystemHandler.directory('src');
    const watcher = createFileWatcher(directory, { controller: mockController });

    await mockInterval();

    // ---

    const observer: Observer = jest.fn();
    watcher.on('change', observer);

    expect(observer).toHaveBeenCalledTimes(0);

    // ---

    await mockInterval();

    expect(observer).toHaveBeenCalledTimes(0);

    // ---

    await directory.file('index.ts').write('Hello world?');

    await mockInterval();

    expect(observer).toHaveBeenCalledTimes(1);
  }
);