export {};

/*
 * Copyright 2025 Erik Riklund (Gopher)
 * <https://github.com/erik-riklund>
 */

declare global
{
  namespace HttpServer
  {
    /**
     * Represents an adapter for the HTTP server, defining the core
     * functionalities to serve and shut down the server.
     */
    interface Adapter
    {
      /**
       * Starts the HTTP server with the provided configuration.
       */
      serve: (config: AdapterConfig) => void;

      /**
       * Shuts down the HTTP server gracefully.
       */
      shutdown: () => Awaitable<void>;
    }

    /**
     * Defines the configuration options for an HTTP server adapter.
     */
    interface AdapterConfig
    {
      /**
       * The port number on which the HTTP server will listen.
       */
      port: number,

      /**
       * An array of routes to be registered with the HTTP server.
       */
      routes: any[], // TODO: type?

      /**
       * An array of middleware functions to be applied to requests.
       */
      middlewares: any[], // TODO: type?

      /**
       * Configuration for serving static assets,
       * including the route and the corresponding folder.
       */
      assets: { route: string, folder: string }
    }

    /**
     * Represents the context for a given HTTP request, providing access
     * to the request, data, and response utilities.
     */
    interface RequestContext<T = Request>
    {
      /**
       * The raw request object.
       */
      request: T,

      /**
       * A record of key-value pairs representing data associated with the request.
       */
      data: Record<string, any>,

      /**
       * Sends a file as the response.
       * 
       * @returns A promise that resolves to a `Response` object.
       */
      file: (path: string) => Promise<Response>,

      /**
       * Sends HTML content as the response.
       * 
       * @returns A promise that resolves to a `Response` object,
       *          or the `Response` object directly.
       */
      html: (content: string) => Awaitable<Response>,

      /**
       * Sends JSON data as the response.
       * 
       * @returns A promise that resolves to a `Response` object,
       *          or the `Response` object directly.
       */
      json: (data: JsonValue) => Awaitable<Response>
    }

    /**
     * Represents a middleware configuration,
     * including its path, HTTP method, and handler function.
     */
    type Middleware = {
      path: string, method: RequestMethod | 'ANY', handler: MiddlewareHandler };

    /**
     * Defines the signature for a middleware handler function.
     */
    type MiddlewareHandler = (context: RequestContext) => Awaitable<Response | void>;

    /**
     * Defines basic options for the HTTP server.
     */
    type Options = { port: number, assets: { route: string, folder: string } };

    /**
     * Represents the standard HTTP request methods.
     */
    type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    /**
     * Represents a route configuration, including its path, HTTP method, and handler function.
     */
    type Route = { path: string, method: RequestMethod, handler: RouteHandler };

    /**
     * Defines the signature for a route handler function.
     */
    type RouteHandler = (context: RequestContext) => Awaitable<Response>;
  }
}