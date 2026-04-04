import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let snippet = '';
try {
  snippet = readFileSync(join(__dirname, '../_includes/scripts/newrelic.html'), 'utf8');
} catch {
  // ファイルが存在しない場合は空文字
}

export default snippet;
