/*
 * Copyright 2025 Erik Riklund (Gopher)
 * <https://github.com/erik-riklund>
 */

import { makePathFilter } from 'path-filter'

/**
 * Creates a file watcher using the provided folder object and pattern.
 */
export const makeFileWatcher = (folder: FileHandler.FolderObject,
  pattern: string, options: Partial<FileWatcher.Options> = {}) =>
{
  const watchers: Record<string, FileWatcher.Listener[]> = { create: [], change: [], delete: [] };
  const watcherOptions = { interval: 500, debounce: 100, ...options } as FileWatcher.Options;

  const filterPaths = makePathFilter(pattern);

  const trackedFiles = {
    current: {} as Record<string, FileWatcher.TrackedFileState>,
    previous: {} as Record<string, FileWatcher.TrackedFileState>
  };

  /**
   * Invokes the watchers for the specified event.
   */
  const invokeWatchers = (
    event: FileWatcher.Event, file: FileHandler.FileObject) =>
  {
    const now = Date.now();
    const { debounce } = watcherOptions;

    for (const watcher of watchers[event])
    {
      if (now - watcher.lastInvoked > debounce)
      {
        watcher.callback(file);
        watcher.lastInvoked = now;
      }
    }
  }

  /**
   * Compares the current and previous file lists to detect changes.
   */
  const detectFileChanges = () =>
  {
    trackedFiles.previous = { ...trackedFiles.current };
    const fileList = filterPaths(folder.read({ recursive: true }));

    for (const filePath of fileList)
    {
      const file = folder.file(filePath);
      const state: FileWatcher.TrackedFileState = { file, modified: file.lastModified };

      trackedFiles.current[filePath] = state;
    }

    const filePaths = [
      ...Object.keys(trackedFiles.current),
      ...Object.keys(trackedFiles.previous)
    ];

    for (const filePath of filePaths)
    {
      const currentFile = trackedFiles.current[filePath];
      const previousFile = trackedFiles.previous[filePath];

      const wasCreated = !previousFile;
      const wasModified = currentFile.modified !== previousFile?.modified;
      const wasDeleted = !currentFile;

      const event = wasCreated ? 'create' : (
        wasModified && !wasDeleted ? 'change' : (wasDeleted ? 'delete' : null)
      );

      if (event) invokeWatchers(event, currentFile.file);
    }
  };

  const watchProcess = setInterval(detectFileChanges, options.interval);

  return {
    /**
     * Registers a callback to be executed when a file is created, changed, or deleted.
     */
    on: (event: FileWatcher.Event, callback: FileWatcher.Callback) =>
    {
      watchers[event].push({ callback, lastInvoked: 0 });
    },

    /**
     * Stops the file watcher by cancelling the interval process.
     */
    cancel: () => clearInterval(watchProcess)
  };
}