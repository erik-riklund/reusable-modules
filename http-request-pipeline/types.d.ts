//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

export type MiddlewareDefinition = { path: string, method: RequestMethod, handler: MiddlewareHandler };
export type MiddlewareHandler<C = Record<string, unknown>> = (request: Request, context: C) => MaybePromise<Response | void>;
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type RouteDefinition = { path: string, method: RequestMethod, handler: RouteHandler };
export type RouteHandler<C = Record<string, unknown>> = (request: Request, context: C) => MaybePromise<Response>;