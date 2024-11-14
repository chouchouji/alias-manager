import { resolveAlias } from '../src/utils';
import { it, expect, describe } from 'vitest';

const alias = {
  aliasName: 'nv',
  command: 'node -v',
};

describe('test alias resolve', () => {
  it('alias with blank between alias keyword and alias name', () => {
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

  it('blank after =', () => {
    const value = `alias nv= 'node -v'`;
    expect(resolveAlias(value)).toStrictEqual(undefined);
  });
});
