//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { BunFile } from 'bun'

// ---

export const createHtmlResponse = (content: string | BunFile) =>
{
  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// ---

export const createNotFoundResponse = () => 
{
  return new Response('The requested resource was not found.', { status: 404 });
}