//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { createFileWatcher } from 'file-watcher'
import type { FileHandler } from 'filesystem-adapter/types'

// --

export interface WatchController
{
  run: (handler: () => MaybePromise<void>, interval: number) => unknown;
  stop: (reference: any) => void;
}

// --

export type FileWatcher = ReturnType<typeof createFileWatcher>;

export type Observer = (event: WatcherEvent, metadata: WatcherEventMetadata) => MaybePromise<void>;

export type Observers = Record<WatcherEvent, Array<{ callback: Observer, invoked: number }>>;

export type Snapshot = { [path: string]: number };

export type WatcherEvent = 'create' | 'delete' | 'change';

export type WatcherEventMetadata = { path: string, file: FileHandler };

export type WatchOptions = { deep: boolean, interval: number, throttle: number, controller: WatchController };