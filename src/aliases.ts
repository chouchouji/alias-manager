import fs from 'node:fs';
import { exec } from 'node:child_process';
import { isEmpty, isArray } from 'rattail';
import { Alias } from './types';
import storePath from './path';

function reloadStoreFile() {
  exec(`source ${storePath.path}`, { shell: '/bin/bash' });
}

export function getAliases() {
  const content = fs.readFileSync(storePath.path, 'utf-8').trim();

  if (isEmpty(content)) {
    return [];
  }

  const aliases = content
    .split('\n')
    .filter(Boolean)
    .map((alias) => alias.trim())
    .reduce((acc: Alias[], content) => {
      const match = content.match(/^alias (\w+)=['"](.*)['"]$/);
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

export function appendAliasToStoreFile(content: string) {
  const data = `
alias ${content}
`;

  fs.appendFileSync(storePath.path, data);

  reloadStoreFile();
}

export function deleteAliases(specificAlias?: Alias) {
  const content = fs.readFileSync(storePath.path, 'utf-8').trim();

  if (isEmpty(content)) {
    return;
  }

  const data = content
    .split('\n')
    .filter(Boolean)
    .map((alias) => alias.trim())
    .filter((alias) => {
      const match = alias.match(/^alias (\w+)=['"](.*)['"]$/);

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

  fs.writeFileSync(storePath.path, data);

  reloadStoreFile();
}

export function renameAliases(specificAlias: Alias, command: string) {
  const content = fs.readFileSync(storePath.path, 'utf-8').trim();

  if (isEmpty(content)) {
    return;
  }

  const data = content
    .split('\n')
    .filter(Boolean)
    .map((alias) => alias.trim())
    .reduce((acc: string[], alias) => {
      const match = alias.match(/^alias (\w+)=['"](.*)['"]$/);

      if (isArray(match)) {
        const [oldCommand, key, value] = match;
        if (key === specificAlias.key && value === specificAlias.value) {
          acc.push(`alias ${key}='${command}'`);
        } else {
          acc.push(oldCommand);
        }
      } else {
        acc.push(alias);
      }

      return acc;
    }, [])
    .join('\n');

  fs.writeFileSync(storePath.path, data);

  reloadStoreFile();
}

export function getCopyAliases() {
  const content = fs.readFileSync(storePath.path, 'utf-8').trim();

  if (isEmpty(content)) {
    return;
  }

  const data = content
    .split('\n')
    .map((alias) => alias.trim())
    .filter((alias) => {
      const match = alias.match(/^alias (\w+)=['"](.*)['"]$/);
      return !!match;
    })
    .join('\n');

  return data;
}
