import { resolveAlias, isSameAlias, normalizeAliasesToArray } from '../src/utils';
import { it, expect, describe } from 'vitest';
import { Alias } from '../src/types';

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

  it('alias command without quote', () => {
    const value = `alias "nv"=node -v`;
    expect(resolveAlias(value)).toStrictEqual(undefined);
  });

  it('space before =', () => {
    const value = `alias nv ='node -v'`;
    expect(resolveAlias(value)).toStrictEqual(undefined);
  });

  it('space after =', () => {
    const value = `alias nv= 'node -v'`;
    expect(resolveAlias(value)).toStrictEqual(undefined);
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
