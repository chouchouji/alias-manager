import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import { isEmpty, isArray } from 'rattail';
import { Alias } from './types';

const homeDir = os.homedir();
const zshrcPath = path.join(homeDir, '.zshrc');

function reloadZshrc() {
  exec('source ~/.zshrc', { shell: '/bin/bash' });
}

export function getAliases() {
  const content = fs.readFileSync(zshrcPath, 'utf-8').trim();

  if (isEmpty(content)) {
    return [];
  }

  const aliases = content
    .split('\n')
    .filter(Boolean)
    .map((alias) => alias.trim())
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

export function deleteAliases(specificAlias?: Alias) {
  const content = fs.readFileSync(zshrcPath, 'utf-8').trim();

  if (isEmpty(content)) {
    return;
  }

  const data = content
    .split('\n')
    .filter(Boolean)
    .map((alias) => alias.trim())
    .filter((alias) => {
      const match = alias.match(/^alias (\w+)='(.*)'$/);

      if (!specificAlias) {
        return !match;
      }

      if (isArray(match)) {
        const [_command, key, value] = match;
        return key !== specificAlias.key && value !== specificAlias.value;
      }

      return true;
    })
    .join('\n');

  fs.writeFileSync(zshrcPath, data);

  reloadZshrc();
}
