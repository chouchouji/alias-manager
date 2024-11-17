import fs from 'node:fs';
import { exec } from 'node:child_process';
import { isEmpty } from 'rattail';
import { Alias } from './types';
import storePath from './path';
import { resolveAlias } from './utils';

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
    .map((text) => text.trim())
    .reduce((acc: Alias[], text) => {
      const alias = resolveAlias(text);
      if (alias) {
        const { aliasName, command } = alias;
        acc.push({
          aliasName,
          command,
          frequency: 0,
          description: '',
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
    .map((text) => text.trim())
    .filter((text) => {
      const alias = resolveAlias(text);

      if (!specificAlias) {
        return !alias;
      }

      if (alias) {
        const isSameAlias = alias.aliasName === specificAlias.aliasName && alias.command === specificAlias.command;
        return !isSameAlias;
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
    .map((text) => text.trim())
    .reduce((acc: string[], text) => {
      const alias = resolveAlias(text);

      if (alias) {
        const { aliasName, command: OldCommand } = alias;
        if (aliasName === specificAlias.aliasName && OldCommand === specificAlias.command) {
          acc.push(`alias ${aliasName}='${command}'`);
        } else {
          acc.push(text);
        }
      } else {
        acc.push(text);
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
    .filter((content) => {
      const alias = resolveAlias(content);
      return !!alias;
    })
    .join('\n');

  return data;
}
