import { isArray, isEmpty } from 'rattail'
import type { Alias } from './types'

/**
 * Check all values in array are same to target
 * @returns {boolean}
 */
export function allNotEqualToTarget<T>(values: T[], target: T) {
  return values.every((value) => value !== target)
}

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
 * @returns If it is valid, return true
 */
export function isValid(value: string) {
  const firstChar = value.charAt(0)
  const lastChar = value.charAt(value.length - 1)

  if (firstChar === `'` && lastChar === `'`) {
    return true
  }

  if (firstChar === `"` && lastChar === `"`) {
    return true
  }

  if (![`'`, `"`].includes(firstChar) && ![`'`, `"`].includes(lastChar)) {
    return true
  }

  return false
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
 * @example
 * ```typescript
 * resolveAlias(`alias nv=node -v`) // { aliasName: 'nv', command: 'node' }
 * ```
 *
 * @example
 * ```typescript
 * resolveAlias(`alias nv=node`) // { aliasName: 'nv', command: 'node' }
 * ```
 *
 * @param {value} string
 * @returns If it is not valid, return undefined
 */
export function resolveAlias(value: string): Pick<Alias, 'aliasName' | 'command'> | undefined {
  if (!value.startsWith('alias')) {
    return
  }

  const formatValue = value.slice(5).trim()
  let aliasName = ''
  let command = ''
  let hasEqual = false

  for (const char of formatValue) {
    if (char === '=') {
      hasEqual = true
      continue
    }

    if (!hasEqual) {
      aliasName += char
    } else {
      command += char
    }
  }

  // don't allow the last char of alias name to be a space
  if (aliasName.charAt(aliasName.length - 1) === ' ') {
    return
  }

  const firstCommandChar = command.charAt(0)
  const lastCommandChar = command.charAt(command.length - 1)

  // clear command if command isn't wrapper by quote, e.g. node -v -> node
  if (
    allNotEqualToTarget([firstCommandChar, lastCommandChar], `'`) &&
    allNotEqualToTarget([firstCommandChar, lastCommandChar], `"`)
  ) {
    command = command.split(' ')[0]
  }

  if (isValid(aliasName) && isValid(command)) {
    return {
      aliasName: aliasName.replace(/^['"](.*)['"]$/, '$1'),
      command: command.replace(/^['"](.*)['"]$/, '$1'),
    }
  }

  return
}

/**
 * Check whether it is the same alias
 * @param {Alias} targetAlias
 * @param {Alias} sourceAlias
 * @returns {boolean}
 */
export function isSameAlias(targetAlias: Alias, sourceAlias: Alias) {
  return targetAlias.aliasName === sourceAlias.aliasName && targetAlias.command === sourceAlias.command
}

/**
 * Covert value to array
 * @param {Array | undefined} value
 * @returns {boolean}
 */
export function normalizeAliasesToArray<T>(value: T[] | undefined) {
  return isArray(value) ? value : []
}

/**
 * Generate unalias command
 * @param {Alias[]} aliases
 * @returns {string}
 */
export function formatUnaliasCommand(aliases: Alias[]) {
  return aliases.reduce((acc, alias) => {
    return `${acc} ${alias.aliasName}`
  }, 'unalias')
}

/**
 * Merge alias
 * @param {Record<string, Alias[]>} source system alias data
 * @param {Record<string, Alias[]>} target import alias data
 * @returns {Record<string, Alias[]>}
 */
export function mergeAlias(source: Record<string, Alias[]>, target: Record<string, Alias[]>) {
  const aliasMap = new Map<string, Alias[]>()

  Object.entries(source).forEach(([groupName, aliases]) => {
    aliasMap.set(groupName, aliases)
  })
  Object.entries(target).forEach(([groupName, targetAliases]) => {
    if (aliasMap.has(groupName)) {
      // need to merge same alias
      const sourceAliasMap = new Map<string, Alias>()
      const allAliases = [...(aliasMap.get(groupName) ?? []), ...targetAliases]
      allAliases.forEach((alias) => {
        // use import alias to cover system alias
        sourceAliasMap.set(alias.aliasName, alias)
      })
      aliasMap.set(groupName, [...sourceAliasMap.values()])
    } else {
      aliasMap.set(groupName, targetAliases)
    }
  })

  const result = {}
  for (const [groupName, aliases] of aliasMap.entries()) {
    Reflect.set(result, groupName, aliases)
  }

  return result
}

/**
 * get all aliases from text
 * @param {string} content
 * @returns {Alias[]}
 */
export function filterAliases(content: string) {
  if (isEmpty(content)) {
    return []
  }

  const aliases = content
    .split('\n')
    .filter(Boolean)
    .map((text) => text.trim())
    .reduce((acc: Alias[], text) => {
      const alias = resolveAlias(text)
      if (alias) {
        const { aliasName, command } = alias
        acc.push({
          aliasName,
          command,
          frequency: 0,
          description: '',
        })
      }
      return acc
    }, [])

  return aliases
}
