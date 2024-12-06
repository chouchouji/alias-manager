import { describe, expect, it } from 'vitest';
import type { Alias } from '../src/types';
import {
  allNotEqualToTarget,
  formatUnaliasCommand,
  isSameAlias,
  isValid,
  normalizeAliasesToArray,
  resolveAlias,
} from '../src/utils';

const alias = {
  aliasName: 'nv',
  command: 'node -v',
};

describe('test alias resolve', () => {
  it('alias with space between alias keyword and alias name', () => {
    const value = `alias    nv='node -v'`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('alias name without quote and command with single quote', () => {
    const value = `alias nv='node -v'`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('alias name without quote and command with double quote', () => {
    const value = `alias nv="node -v"`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('alias name with single quote and command with single quote', () => {
    const value = `alias 'nv'='node -v'`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('alias name with single quote and command with double quote', () => {
    const value = `alias 'nv'="node -v"`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('alias name with double quote and command with single quote', () => {
    const value = `alias "nv"='node -v'`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('alias name with double quote and command with double quote', () => {
    const value = `alias "nv"="node -v"`;
    expect(resolveAlias(value)).toStrictEqual(alias);
  });

  it('space before =', () => {
    const value = `alias nv ='node -v'`;
    expect(resolveAlias(value)).toStrictEqual(undefined);
  });

  it('space after =', () => {
    const value = `alias nv= 'node -v'`;
    expect(resolveAlias(value)).toStrictEqual(undefined);
  });

  it('alias name without quote and command has space without quote', () => {
    const value = 'alias nv=node -v';
    expect(resolveAlias(value)).toStrictEqual({
      aliasName: alias.aliasName,
      command: 'node',
    });
  });

  it('alias name without quote and command without space and quote', () => {
    const value = 'alias nv=node';
    expect(resolveAlias(value)).toStrictEqual({
      aliasName: alias.aliasName,
      command: 'node',
    });
  });
});

describe('test same alias', () => {
  it('have same alias name and command', () => {
    expect(isSameAlias({ aliasName: 'nv', command: 'node -v' }, { aliasName: 'nv', command: 'node -v' })).toBe(true);
  });

  it('same alias name and different command', () => {
    expect(isSameAlias({ aliasName: 'nv', command: 'node -v' }, { aliasName: 'nv', command: 'node --version' })).toBe(
      false,
    );
  });

  it('different alias name and same command', () => {
    expect(isSameAlias({ aliasName: 'nv2', command: 'node -v' }, { aliasName: 'nv', command: 'node -v' })).toBe(false);
  });

  it('different alias name and different command', () => {
    expect(isSameAlias({ aliasName: 'nv2', command: 'node -v' }, { aliasName: 'nv', command: 'node --version' })).toBe(
      false,
    );
  });
});

describe('test normalize aliases to array', () => {
  it('param is empty alias array', () => {
    expect(normalizeAliasesToArray<Alias>([])).toStrictEqual([]);
  });

  it('param is alias array with value', () => {
    expect(normalizeAliasesToArray<Alias>([alias])).toStrictEqual([alias]);
  });

  it('param is undefined', () => {
    expect(normalizeAliasesToArray<Alias>(undefined)).toStrictEqual([]);
  });
});

describe('test format unalias command', () => {
  it('param is alias array with empty value', () => {
    expect(formatUnaliasCommand([])).toBe('unalias');
  });

  it('param is alias array with single value', () => {
    expect(formatUnaliasCommand([alias])).toBe('unalias nv');
  });

  it('param is alias array with multiple value', () => {
    expect(formatUnaliasCommand([alias, alias])).toBe('unalias nv nv');
  });
});

describe('test alias name and command are valid', () => {
  it('param without quote', () => {
    expect(isValid('test')).toBe(true);
  });

  it('param without quote', () => {
    expect(isValid(`'test'`)).toBe(true);
  });

  it('param without quote', () => {
    expect(isValid(`"test"`)).toBe(true);
  });
});

describe('test all values are not equal to target', () => {
  it('param are same to target', () => {
    expect(allNotEqualToTarget(['1', '1'], '2')).toBe(true);
  });

  it('param are not same to target', () => {
    expect(allNotEqualToTarget(['2', '1'], '2')).toBe(false);
  });
});
