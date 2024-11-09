import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { isEmpty, isArray } from 'rattail';

const homeDir = os.homedir();
const zshrcPath = path.join(homeDir, '.zshrc');

export function getAliases() {
  const content = fs.readFileSync(zshrcPath, 'utf-8').trim();

  if (isEmpty(content)) {
    return [];
  }

  const aliases = content
    .split('\n')
    .filter(Boolean)
    .reduce((acc: { key: string; value: string }[], line) => {
      const match = line.match(/^alias (\w+)='(.*)'$/);
      if (isArray(match)) {
        const [_command, key, value] = match;
        acc.push({
          key,
          value,
        });
      }
      return acc;
    }, []);

  return aliases;
}
