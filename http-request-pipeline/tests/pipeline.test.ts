//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type {
  MiddlewareDefinition,
  MiddlewareHandler,
  RouteDefinition,
  RouteHandler
} from 'http-request-pipeline/types'

import { it, expect } from 'bun:test'
import { createHttpRequestPipeline } from 'http-request-pipeline'

// ---

it('should return a request handler function',

  async () =>
  {
    const handler: RouteHandler = () => new Response('Hello world');
    const route: RouteDefinition = { path: '/', method: 'GET', handler };

    const pipeline = createHttpRequestPipeline(route, []);

    expect(typeof pipeline).toBe('function');
  }
);

// ---

it('should return the response from the route handler',

  async () =>
  {
    const handler: RouteHandler = () => new Response('Hello world');
    const route: RouteDefinition = { path: '/', method: 'GET', handler };

    const pipeline = createHttpRequestPipeline(route, []);
    const response = await pipeline(new Request('http://localhost/'), {});

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe('Hello world');
  }
);

// ---

it('should return the response from the route handler (with middleware)',

  async () =>
  {
    const middleware: MiddlewareDefinition = { path: '/', method: 'GET', handler: () => {} };
    const middleware2: MiddlewareDefinition = { path: '/foo', method: 'GET', handler: () => {} };
    const route: RouteDefinition = { path: '/foo', method: 'GET', handler: () => new Response('Hello world') };

    const pipeline = createHttpRequestPipeline(route, [middleware, middleware2]);
    const response = await pipeline(new Request('http://localhost/foo'), {});

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe('Hello world');
  }
);

// ---

it('should return the response from the middleware handler',

  async () =>
  {
    const middlewareHandler: MiddlewareHandler = () => {};
    const middleware: MiddlewareDefinition = { path: '/', method: 'GET', handler: middlewareHandler };

    const middlewareHandler2: MiddlewareHandler = () => new Response('Hello from middleware 2');
    const middleware2: MiddlewareDefinition = { path: '/foo', method: 'GET', handler: middlewareHandler2 };

    const middlewareHandler3: MiddlewareHandler = () => new Response('Hello from middleware 3');
    const middleware3: MiddlewareDefinition = { path: '/foo/bar', method: 'GET', handler: middlewareHandler3 };

    const route: RouteDefinition = { path: '/foo/bar', method: 'GET', handler: () => new Response('Hello world') };

    const pipeline = createHttpRequestPipeline(route, [middleware, middleware2, middleware3]);
    const response = await pipeline(new Request('http://localhost/foo/bar'), {});

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe('Hello from middleware 2');
  }
);

// ---

it('should return the response from the middleware handler',

  async () =>
  {
    const middlewareHandler: MiddlewareHandler = (_, context) => { context.first = 1 };
    const middleware: MiddlewareDefinition = { path: '*', method: 'GET', handler: middlewareHandler };

    const middlewareHandler2: MiddlewareHandler = (_, context) => { context.second = 2 };
    const middleware2: MiddlewareDefinition = { path: '/foo', method: 'GET', handler: middlewareHandler2 };

    const middlewareHandler3: MiddlewareHandler = (_, context) => { return new Response(JSON.stringify(context)) };
    const middleware3: MiddlewareDefinition = { path: '/foo/bar', method: 'GET', handler: middlewareHandler3 };

    const route: RouteDefinition = { path: '/foo/bar', method: 'GET', handler: () => new Response('Hello world') };

    const pipeline = createHttpRequestPipeline(route, [middleware, middleware2, middleware3]);
    const response = await pipeline(new Request('http://localhost/foo/bar'), {});

    expect(response).toBeInstanceOf(Response);
    expect(await response.json()).toEqual({ first: 1, second: 2 });
  }
);