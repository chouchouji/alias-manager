import { Alias } from './types';
import { isArray } from 'rattail';

/**
 * Check alias name or command is valid
 *
 * @example
 * ```typescript
 * isValid(`test`) // true
 * ```
 * @example
 * ```typescript
 * isValid(`'test'`) // true
 * ```
 * @example
 * ```typescript
 * isValid(`"test"`) // true
 * ```
 *
 * @param {value} string
 * @param {boolean} [skipNoQuote=false] - whether to skip no quote validation
 * @returns If it is valid, return true
 */
function isValid(value: string, skipNoQuote = false) {
  const firstChar = value.charAt(0);
  const lastChar = value.charAt(value.length - 1);

  if (firstChar === `'` && lastChar === `'`) {
    return true;
  }

  if (firstChar === `"` && lastChar === `"`) {
    return true;
  }

  if (![`'`, `"`].includes(firstChar) && ![`'`, `"`].includes(lastChar) && !skipNoQuote) {
    return true;
  }

  return false;
}

/**
 * Resolve alias to alias name and command.
 *
 * @example
 * ```typescript
 * resolveAlias(`alias     nv='node -v'`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 *
 * @example
 * ```typescript
 * resolveAlias(`alias nv='node -v'`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 *
 * @example
 * ```typescript
 * resolveAlias(`alias nv="node -v"`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 * @example
 * ```typescript
 * resolveAlias(`alias 'nv'='node -v'`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 *
 * @example
 * ```typescript
 * resolveAlias(`alias 'nv'="node -v"`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 *
 * @example
 * ```typescript
 * resolveAlias(`alias "nv"='node -v'`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 *
 * @example
 * ```typescript
 * resolveAlias(`alias "nv"="node -v"`) // { aliasName: 'nv', command: 'node -v' }
 * ```
 *
 * @param {value} string
 * @returns If it is not valid, return undefined
 */
export function resolveAlias(value: string): Omit<Alias, 'frequency'> | undefined {
  if (!value.startsWith('alias')) {
    return;
  }

  const formatValue = value.slice(5).trim();
  let aliasName = '';
  let command = '';
  let hasEqual = false;

  for (let char of formatValue) {
    if (char === '=') {
      hasEqual = true;
      continue;
    }

    if (!hasEqual) {
      aliasName += char;
    } else {
      command += char;
    }
  }

  // don't allow the last char of alias name to be a space
  if (aliasName.charAt(aliasName.length - 1) === ' ') {
    return;
  }

  if (isValid(aliasName) && isValid(command, true)) {
    return {
      aliasName: aliasName.replace(/^['"](.*)['"]$/, '$1'),
      command: command.replace(/^['"](.*)['"]$/, '$1'),
    };
  }

  return;
}

/**
 * Check whether it is the same alias
 * @param {Alias} targetAlias
 * @param {Alias} sourceAlias
 * @returns {boolean}
 */
export function isSameAlias(targetAlias: Alias, sourceAlias: Alias) {
  return targetAlias.aliasName === sourceAlias.aliasName && targetAlias.command === sourceAlias.command;
}

export function normalizeAliasesToArray<T>(value: T[] | undefined) {
  return isArray(value) ? value : [];
}
