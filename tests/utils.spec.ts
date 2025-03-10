import { describe, expect, it } from 'vitest'
import { SYSTEM_ALIAS } from '../src/constants'
import type { Alias } from '../src/types'
import {
  allNotEqualToTarget,
  filterAliases,
  formatUnaliasCommand,
  isAliasSubset,
  isSameAlias,
  isValid,
  mergeAlias,
  normalizeAliasesToArray,
  resolveAlias,
} from '../src/utils'

const alias = {
  aliasName: 'nv',
  command: 'node -v',
}

describe('test alias resolve', () => {
  it('alias with space between alias keyword and alias name', () => {
    const value = `alias    nv='node -v'`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('alias name without quote and command with single quote', () => {
    const value = `alias nv='node -v'`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('alias name without quote and command with double quote', () => {
    const value = `alias nv="node -v"`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('alias name with single quote and command with single quote', () => {
    const value = `alias 'nv'='node -v'`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('alias name with single quote and command with double quote', () => {
    const value = `alias 'nv'="node -v"`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('alias name with double quote and command with single quote', () => {
    const value = `alias "nv"='node -v'`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('alias name with double quote and command with double quote', () => {
    const value = `alias "nv"="node -v"`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('space before =', () => {
    const value = `alias nv ='node -v'`
    expect(resolveAlias(value)).toStrictEqual(undefined)
  })

  it('space after =', () => {
    const value = `alias nv= 'node -v'`
    expect(resolveAlias(value)).toStrictEqual(undefined)
  })

  it('alias name without quote and command has space without quote', () => {
    const value = 'alias nv=node -v'
    expect(resolveAlias(value)).toStrictEqual({
      aliasName: alias.aliasName,
      command: 'node',
    })
  })

  it('alias name without quote and command without space and quote', () => {
    const value = 'alias nv=node'
    expect(resolveAlias(value)).toStrictEqual({
      aliasName: alias.aliasName,
      command: 'node',
    })
  })

  it('command contains single equal sign', () => {
    const alias = {
      aliasName: 'nr',
      command: 'npm config set registry=https://registry.npmjs.org/',
    }
    const value = `alias nr='npm config set registry=https://registry.npmjs.org/'`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })

  it('command contains multiple equal signs', () => {
    const alias = {
      aliasName: 'dev',
      command: 'tsup src/index.ts --format esm,cjs,iife --out-dir=lib --global-name=Rattail --dts --clean',
    }
    const value = `alias dev='tsup src/index.ts --format esm,cjs,iife --out-dir=lib --global-name=Rattail --dts --clean'`
    expect(resolveAlias(value)).toStrictEqual(alias)
  })
})

describe('test same alias', () => {
  it('have same alias name and command', () => {
    expect(isSameAlias({ aliasName: 'nv', command: 'node -v' }, { aliasName: 'nv', command: 'node -v' })).toBe(true)
  })

  it('same alias name and different command', () => {
    expect(isSameAlias({ aliasName: 'nv', command: 'node -v' }, { aliasName: 'nv', command: 'node --version' })).toBe(
      false,
    )
  })

  it('different alias name and same command', () => {
    expect(isSameAlias({ aliasName: 'nv2', command: 'node -v' }, { aliasName: 'nv', command: 'node -v' })).toBe(false)
  })

  it('different alias name and different command', () => {
    expect(isSameAlias({ aliasName: 'nv2', command: 'node -v' }, { aliasName: 'nv', command: 'node --version' })).toBe(
      false,
    )
  })
})

describe('test normalize aliases to array', () => {
  it('param is empty alias array', () => {
    expect(normalizeAliasesToArray<Alias>([])).toStrictEqual([])
  })

  it('param is alias array with value', () => {
    expect(normalizeAliasesToArray<Alias>([alias])).toStrictEqual([alias])
  })

  it('param is undefined', () => {
    expect(normalizeAliasesToArray<Alias>(undefined)).toStrictEqual([])
  })
})

describe('test format unalias command', () => {
  it('param is alias array with empty value', () => {
    expect(formatUnaliasCommand([])).toBe('unalias')
  })

  it('param is alias array with single value', () => {
    expect(formatUnaliasCommand([alias])).toBe('unalias nv')
  })

  it('param is alias array with multiple value', () => {
    expect(formatUnaliasCommand([alias, alias])).toBe('unalias nv nv')
  })
})

describe('test alias name and command are valid', () => {
  it('param without quote', () => {
    expect(isValid('test')).toBe(true)
  })

  it('param with single quote', () => {
    expect(isValid(`'test'`)).toBe(true)
  })

  it('param with double quote', () => {
    expect(isValid(`"test"`)).toBe(true)
  })
})

describe('test all values are not equal to target', () => {
  it('param are same to target', () => {
    expect(allNotEqualToTarget(['1', '1'], '2')).toBe(true)
  })

  it('param are not same to target', () => {
    expect(allNotEqualToTarget(['2', '1'], '2')).toBe(false)
  })
})

describe('test filter all alias from string', () => {
  it('no any alias', () => {
    expect(filterAliases(`al`)).toStrictEqual([])
  })

  it('all valid aliases', () => {
    expect(
      filterAliases(`
alias c='clear'
alias gpl='git pull'`),
    ).toStrictEqual([
      {
        aliasName: 'c',
        command: 'clear',
        frequency: 0,
        description: '',
      },
      {
        aliasName: 'gpl',
        command: 'git pull',
        frequency: 0,
        description: '',
      },
    ])
  })

  it('some valid aliases', () => {
    expect(
      filterAliases(`
alias c='clear'
test'`),
    ).toStrictEqual([
      {
        aliasName: 'c',
        command: 'clear',
        frequency: 0,
        description: '',
      },
    ])
  })
})

describe('test merge alias', () => {
  it('merge alias', () => {
    const source = {
      [SYSTEM_ALIAS]: [
        {
          aliasName: 'c',
          command: 'clear',
          frequency: 0,
          description: '',
        },
      ],
      git: [
        {
          aliasName: 'gpl',
          command: 'git pull',
          frequency: 0,
          description: '',
        },
        {
          aliasName: 'gps',
          command: 'git push',
          frequency: 0,
          description: '',
        },
      ],
      platano: [
        {
          aliasName: 'br',
          command: 'platano br',
          frequency: 0,
          description: '',
        },
      ],
    }
    const target = {
      [SYSTEM_ALIAS]: [
        {
          aliasName: 'nv',
          command: 'node -v',
          frequency: 0,
          description: '',
        },
      ],
      git: [
        {
          aliasName: 'gpl',
          command: 'git pull origin main',
          frequency: 0,
          description: '',
        },
        {
          aliasName: 'gps',
          command: 'git push',
          frequency: 0,
          description: '',
        },
      ],
      shell: [
        {
          aliasName: '18',
          command: 'sudo n 18.0.0',
          frequency: 0,
          description: '',
        },
      ],
    }
    expect(mergeAlias(source, target)).toStrictEqual({
      [SYSTEM_ALIAS]: [
        {
          aliasName: 'c',
          command: 'clear',
          frequency: 0,
          description: '',
        },
        {
          aliasName: 'nv',
          command: 'node -v',
          frequency: 0,
          description: '',
        },
      ],
      git: [
        {
          aliasName: 'gpl',
          command: 'git pull origin main',
          frequency: 0,
          description: '',
        },
        {
          aliasName: 'gps',
          command: 'git push',
          frequency: 0,
          description: '',
        },
      ],
      platano: [
        {
          aliasName: 'br',
          command: 'platano br',
          frequency: 0,
          description: '',
        },
      ],
      shell: [
        {
          aliasName: '18',
          command: 'sudo n 18.0.0',
          frequency: 0,
          description: '',
        },
      ],
    })
  })
})

describe('test is alias subset', () => {
  const source: Alias[] = [
    { aliasName: 'a', command: 'cmd1' },
    { aliasName: 'b', command: 'cmd2' },
    { aliasName: 'c', command: 'cmd3' },
  ]

  it('is subset', () => {
    const target: Alias[] = [
      { aliasName: 'a', command: 'cmd1' },
      { aliasName: 'b', command: 'cmd2' },
    ]

    expect(isAliasSubset(source, target)).toBe(true)
  })

  it('has different aliasName', () => {
    const target: Alias[] = [
      { aliasName: 'c', command: 'cmd1' },
      { aliasName: 'b', command: 'cmd3' },
    ]

    expect(isAliasSubset(source, target)).toBe(false)
  })

  it('has different command', () => {
    const target: Alias[] = [
      { aliasName: 'a', command: 'cmd1' },
      { aliasName: 'b', command: 'cmd3' },
    ]

    expect(isAliasSubset(source, target)).toBe(false)
  })

  it('has another alias', () => {
    const target: Alias[] = [
      { aliasName: 'a', command: 'cmd1' },
      { aliasName: 'b', command: 'cmd2' },
      { aliasName: 'd', command: 'cmd4' },
    ]

    expect(isAliasSubset(source, target)).toBe(false)
  })
})
