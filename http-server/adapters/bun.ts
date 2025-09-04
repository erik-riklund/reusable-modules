//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Server } from 'bun'
import type { Adapter, Middleware, RequestContext, RequestMethod, Route } from '../types'

// ---

export const createHttpServerAdapter = (): Adapter =>
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

                return createFileResponse(`${config.assets.folder}/${path}`);
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

// ---

export const createHttpRequestContext = (request: Request): RequestContext =>
{
  return {
    request,
    data: {},

    file: createFileResponse,
    html: createHtmlResponse,
    json: createJsonResponse
  };
}

// ---

const createRoutePipelines = (routes: Route[], middlewares: Middleware[]) =>
{
  type RequestHandler = (request: Request) => Promise<Response>;
  const pipelines: Record<string, Record<RequestMethod, RequestHandler>> = {};

  // ---

  const createMiddlewareStack = (routeMethod: RequestMethod, routePath: string) =>
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

  // ---

  for (const { path, method, handler } of routes)
  {
    const middlewareStack = createMiddlewareStack(method, path);

    pipelines[path] = pipelines[path] || {};

    pipelines[path][method] = async (request: Request) =>
    {
      const context = createHttpRequestContext(request);

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

// ---

export const createFileResponse = async (filePath: string) =>
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

// ---

export const createHtmlResponse = (content: string) =>
{
  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};

// ---

export const createJsonResponse = (data: JsonValue) =>
{
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};
