/*
 * Copyright 2025 Erik Riklund (Gopher)
 * <https://github.com/erik-riklund>
 */

import type { Server } from 'bun'

/**
 * Creates a new server adapter using Bun's HTTP server.
 */
export const makeHttpServerAdapter = (): HttpServer.Adapter =>
{
  let server: Server = null!;

  return {
    serve: (config) =>
    {
      if (server !== null)
      {
        throw new Error('The server is already running.');
      }

      server = Bun.serve(
        {
          port: config.port,

          routes:
          {
            [`${config.assets.route}/*`]:
            {
              GET: (request: Request) =>
              {
                const url = new URL(request.url);
                const path = url.pathname.substring(config.assets.route.length + 1);

                return makeFileResponse(`${config.assets.folder}/${path}`);
              },
            },

            ...createRoutePipelines(config.routes, config.middlewares || []),
          },

          fetch: () =>
          {
            return new Response(null, { status: 404 });
          }
        }
      )
    },

    shutdown: async () =>
    {
      if (server === null)
      {
        throw new Error('The server is not running.');
      }

      await server.stop();
    }
  };
}

/**
 * Creates a new HTTP request context, providing utilities for response generation.
 *
 * @param request The request object to create a context for.
 * @returns An HTTP request context with utilities for file, HTML, and JSON responses.
 */
export const makeHttpRequestContext = (
  request: Request): HttpServer.RequestContext =>
{
  return {
    request, data: {},

    file: makeFileResponse,
    html: makeHtmlResponse,
    json: makeJsonResponse
  };
}

/**
 * Creates route pipelines with associated middleware stacks for handling requests.
 *
 * @param routes The list of route configurations.
 * @param middlewares The list of middleware configurations.
 * @returns A mapping of paths and methods to request handler functions.
 */
const createRoutePipelines = (
  routes: HttpServer.Route[], middlewares: HttpServer.Middleware[]) =>
{
  type RequestHandler = (request: Request) => Promise<Response>;
  const pipelines: Record<string, Record<HttpServer.RequestMethod, RequestHandler>> = {};

  /**
   * Creates a middleware stack for a given route and method.
   *
   * @param routeMethod The HTTP method of the route.
   * @param routePath The path of the route.
   * @returns An array of middleware handler functions.
   */
  const createMiddlewareStack = (
    routeMethod: HttpServer.RequestMethod, routePath: string) =>
  {
    const stack = [];

    for (const { handler, method, path } of middlewares)
    {
      const matchesRoute = path === '*' || path === routePath || routePath.startsWith(`${path}/`);
      const matchesMethod = method === 'ANY' || method === routeMethod;

      if (matchesRoute && matchesMethod) stack.push(handler);
    }

    return stack;
  };

  for (const { path, method, handler } of routes)
  {
    const middlewareStack = createMiddlewareStack(method, path);

    pipelines[path] = pipelines[path] || {};

    pipelines[path][method] = async (request: Request) =>
    {
      const context = makeHttpRequestContext(request);

      for (const middleware of middlewareStack)
      {
        const response = await middleware(context);

        if (response instanceof Response)
        {
          // Return the intercepted response,
          // effectively short-circuiting the route handler.

          return response;
        }
      }

      return handler(context);
    };
  }

  return pipelines;
};

/**
 * Generates a file response for the specified file path.
 *
 * @param filePath The path to the file to respond with.
 * @returns A `Response` object containing the file content or an error status.
 */
export const makeFileResponse = async (filePath: string) =>
{
  try
  {
    const assetFile = Bun.file(filePath);
    const fileExists = await assetFile.exists();
    const status = fileExists ? 200 : 404;

    return new Response(fileExists ? assetFile : null, { status });
  }
  catch (error)
  {
    return new Response(null, { status: 500 });
  }
};

/**
 * Generates an HTML response with the specified content.
 *
 * @param content The HTML content to include in the response.
 * @returns A `Response` object with the given HTML content.
 */
export const makeHtmlResponse = (content: string) =>
{
  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};

/**
 * Generates a JSON response with the specified data.
 *
 * @param data The JSON data to include in the response.
 * @returns A `Response` object with the given JSON data.
 */
export const makeJsonResponse = (data: JsonValue) =>
{
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};
