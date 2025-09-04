//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

export interface Adapter
{
  serve: (config: AdapterConfig) => void;
  shutdown: () => MaybePromise<void>;
}

export interface AdapterConfig
{
  port: number;
  routes: any[]; // !todo: type?
  middlewares: any[]; // !todo: type?
  assets: { route: string, folder: string };
}

export interface RequestContext<T = Request>
{
  request: T;
  data: Record<string, any>;

  file: (path: string) => Promise<Response>;
  html: (content: string) => MaybePromise<Response>;
  json: (data: JsonValue) => MaybePromise<Response>;
}

// ---

export type Middleware = { path: string; method: RequestMethod | 'ANY'; handler: MiddlewareHandler };
export type MiddlewareHandler = (context: RequestContext) => MaybePromise<Response | void>;
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Route = { path: string; method: RequestMethod; handler: RouteHandler };
export type RouteHandler = (context: RequestContext) => MaybePromise<Response>;
export type ServerOptions = { port: number; assets: { route: string, folder: string } };