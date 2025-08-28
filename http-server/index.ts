//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

/**
 * Creates a new HTTP server instance, using the specified adapter and options.
 *
 * @param adapter The adapter to use for the HTTP server.
 * @param options The options for the HTTP server.
 */
export const makeHttpServer = (
  adapter: HttpServer.Adapter,
  options: Partial<HttpServer.Options> = {}) =>
{
  const config =
  {
    routes: [] as HttpServer.Route[],
    middlewares: [] as HttpServer.Middleware[],

    port: options.port || 800,

    assets: {
      route: options.assets?.route || '/public',
      folder: options.assets?.folder || './public'
    }
  };

  return {
    /**
     * Starts the HTTP server.
     */
    start: () => adapter.serve(config),

    /**
     * Stops the HTTP server.
     */
    stop: () => adapter.shutdown(),

    /**
     * Registers the specified middlewares with the HTTP server.
     *
     * @param middlewares The middlewares to register.
     */
    registerMiddlewares: (middlewares: HttpServer.Middleware[]) =>
    {
      config.middlewares.push(...middlewares);
    },

    /**
     * Registers the specified routes with the HTTP server.
     *
     * @param routes The routes to register.
     */
    registerRoutes: (routes: HttpServer.Route[]) =>
    {
      config.routes.push(...routes);
    }
  };
}
