//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type {
  Observer,
  Observers,
  Snapshot,
  WatchController,
  WatcherEvent,
  WatchOptions
} from 'file-watcher/types'

import { basename } from 'node:path'

import type { DirectoryHandler } from 'filesystem-adapter/types'

// ---

export const createFileWatcher = (
  directory: DirectoryHandler, options?: Partial<WatchOptions>) =>
{
  const deep = options?.deep ?? false;
  const interval = options?.interval ?? 750; // ms
  const throttle = options?.throttle ?? 30; // ms

  const controller: WatchController = options?.controller ?? (
    {
      run: (handler, interval) => setInterval(handler, interval),
      stop: (reference: number) => clearInterval(reference)
    }
  );

  const observers: Observers = { create: [], delete: [], change: [] };

  // ---

  const notifyObservers = async (event: WatcherEvent, path: string) =>
  {
    const relativeFilePath = path.slice(directory.path.length + 1);
    const fileHandler = directory.file(relativeFilePath);

    for (const observer of observers[event])
    {
      if (Date.now() - observer.invoked >= throttle)
      {
        observer.invoked = Date.now();

        observer.callback(event, { path: relativeFilePath, file: fileHandler });
      }
    }
  }

  // ---

  let snapshot: Snapshot = {};

  const createSnapshot = async (): Promise<Snapshot> =>
  {
    const newSnapshot: Snapshot = {};

    const content = await directory.list({ deep });
    const files = content.filter(entry => entry.type === 'file');

    const modifiedPromises: Array<Promise<number>> = files.map(
      entry => directory.file(basename(entry.path)).modified as Promise<number>
    );

    const modified = await Promise.all(modifiedPromises);
    files.forEach(({ path }, index) => newSnapshot[path] = modified[index]);

    return newSnapshot;
  }

  // ---

  const compareWithPreviousSnapshot = (currentSnapshot: Snapshot) =>
  {
    const changes: Array<{ event: WatcherEvent, path: string }> = [];
    const paths = new Set([...Object.keys(snapshot), ...Object.keys(currentSnapshot)]);

    for (const path of paths)
    {
      if (path in currentSnapshot && !(path in snapshot))
      {
        changes.push({ event: 'create', path });
      }
      else if (!(path in currentSnapshot) && path in snapshot)
      {
        changes.push({ event: 'delete', path });
      }
      else if (currentSnapshot[path] > snapshot[path])
      {
        changes.push({ event: 'change', path });
      }
    }

    return changes;
  }

  // ---

  let initialized: boolean;

  const watcher = controller.run(
    async () =>
    {
      const newSnapshot = await createSnapshot();
      const changes = compareWithPreviousSnapshot(newSnapshot);

      // console.debug('changes:', changes);

      if (initialized && changes.length > 0)
      {
        // console.debug('notifying observers...');

        changes.forEach(({ event, path }) => notifyObservers(event, path));
      }

      initialized ??= true;
      snapshot = newSnapshot;
    },

    interval
  );

  return {
    any: (callback: Observer) =>
    {
      for (const event in observers)
      {
        const eventName = event as WatcherEvent;

        if (!observers[eventName].some(o => o.callback === callback))
        {
          observers[eventName].push({ callback, invoked: 0 });
        }
      }
    },

    on: (event: WatcherEvent, callback: Observer) =>
    {
      if (!observers[event].some(o => o.callback === callback))
      {
        observers[event].push({ callback, invoked: 0 });
      }
    },

    kill: () => controller.stop(watcher)
  }
}