//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect, beforeEach, mock } from 'bun:test'
import { createTemplateParser } from '../transpiler/parser'

// ---

let parser: ReturnType<typeof createTemplateParser>;
beforeEach(() => parser = createTemplateParser());

// ---

