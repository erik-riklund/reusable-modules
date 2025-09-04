//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { MiddlewareDefinition, RequestMethod, RouteDefinition, RouteHandler } from './types'

// ---

export const createHttpRequestPipeline = <C extends Record<string, unknown>> (
  route: RouteDefinition, middlewares: Array<MiddlewareDefinition>): RouteHandler<C> =>
{
  const middlewareHandlers = middlewares.filter(
    middleware =>
    {
      const { path, method } = middleware;

      const matchesRoute = path === '*' || path === route.path || route.path.startsWith(`${path}/`);
      const matchesMethod = (method === 'ANY' as RequestMethod) || method === route.method;

      return matchesRoute && matchesMethod;
    }
  );

  return async (request, context) =>
  {
    for (const { handler } of middlewareHandlers)
    {
      const result = await handler(request, context);

      if (result instanceof Response) 
      {
        // The middleware interrupted the request by returning a response,
        // effectively stopping the pipeline.

        return result;
      }
    }

    return await route.handler(request, context);
  }
}