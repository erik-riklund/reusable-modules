//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type { Adapter, Middleware, Route, ServerOptions } from './types'

// ---

export const createHttpServer = (
  adapter: Adapter, options: Partial<ServerOptions> = {}) =>
{
  const config =
  {
    routes: [] as Route[],
    middlewares: [] as Middleware[],

    port: options.port || 800,

    assets: {
      route: options.assets?.route || '/public',
      folder: options.assets?.folder || './public'
    }
  };

  return {
    start: () => adapter.serve(config),
    stop: () => adapter.shutdown(),

    registerMiddlewares: (middlewares: Middleware[]) =>
    {
      config.middlewares.push(...middlewares);
    },

    registerRoutes: (routes: Route[]) =>
    {
      config.routes.push(...routes);
    }
  };
}
