import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import { isEmpty, isArray } from 'rattail';
import { Alias } from './types';

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
    .reduce((acc: Alias[], content) => {
      const match = content.match(/^alias (\w+)='(.*)'$/);
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

export function appendAliasToZshrc(content: string) {
  const data = `
alias ${content}
`;

  fs.appendFileSync(zshrcPath, data);

  reloadZshrc();
}

function reloadZshrc() {
  exec('source ~/.zshrc', { shell: '/bin/bash' });
}
