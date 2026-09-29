import type { ContentType, Post } from '../types/post';

export interface PedParseResult {
  posts: Partial<Post>[];
  unrecognized: string[];
}

type TextField = 'tipo' | 'orario' | 'cliente' | 'argomento' | 'captions';

const FIELD_PREFIXES: { field: TextField; prefix: string }[] = [
  { field: 'tipo', prefix: 'tipo' },
  { field: 'orario', prefix: 'orario' },
  { field: 'cliente', prefix: 'cliente' },
  { field: 'argomento', prefix: 'argomento' },
  { field: 'captions', prefix: 'caption' },
];

function splitIntoBlocks(testo: string): string[] {
  const lines = testo.split(/\r?\n/);
  const blocks: string[][] = [[]];

  for (const line of lines) {
    if (/^-{3,}$/.test(line.trim())) {
      blocks.push([]);
    } else {
      blocks[blocks.length - 1].push(line);
    }
  }

  return blocks.map((block) => block.join('\n').trim()).filter((block) => block.length > 0);
}

function parseDateLine(line: string): string | null {
  const match = line.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function normalizeTipo(raw: string): ContentType | null {
  const value = raw.trim().toLowerCase();
  if (value.startsWith('carosell')) return 'carosello';
  if (value.startsWith('reel')) return 'reels';
  if (value.startsWith('static')) return 'statico';
  return null;
}

function extractFieldValue(line: string, prefix: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.toLowerCase().startsWith(`${prefix}:`)) {
    return null;
  }
  return trimmed.slice(prefix.length + 1).trim();
}

export function parsePedText(testo: string): PedParseResult {
  const blocks = splitIntoBlocks(testo);
  const posts: Partial<Post>[] = [];
  const unrecognized: string[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      continue;
    }

    const data = parseDateLine(lines[0]);

    const fields: Partial<Record<TextField, string>> = {};
    for (const line of lines.slice(1)) {
      for (const { field, prefix } of FIELD_PREFIXES) {
        const value = extractFieldValue(line, prefix);
        if (value !== null) {
          fields[field] = value;
          break;
        }
      }
    }

    const tipo = fields.tipo ? normalizeTipo(fields.tipo) : null;

    if (!data || !tipo) {
      unrecognized.push(block);
      continue;
    }

    posts.push({
      data,
      tipo,
      orario: fields.orario,
      cliente: fields.cliente,
      argomento: fields.argomento,
      captions: fields.captions,
    });
  }

  return { posts, unrecognized };
}
