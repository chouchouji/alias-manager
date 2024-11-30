import { exec } from 'node:child_process';
import fs from 'node:fs';
import { isEmpty } from 'rattail';
import storePath from './path';
import { Alias } from './types';
import { isSameAlias, resolveAlias } from './utils';

function reloadStoreFile() {
  exec(`source ${storePath.path}`, { shell: '/bin/bash' });
}

function getAliasFromPath() {
  return fs.readFileSync(storePath.path, 'utf-8').trim();
}

export function getAliases() {
  const content = getAliasFromPath();

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
  const content = getAliasFromPath();

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
        return !isSameAlias(alias, specificAlias);
      }

      return true;
    })
    .join('\n');

  fs.writeFileSync(storePath.path, data);

  reloadStoreFile();
}

export function renameAliases(specificAlias: Alias, command: string) {
  const content = getAliasFromPath();

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
        const { aliasName } = alias;
        if (isSameAlias(alias, specificAlias)) {
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
